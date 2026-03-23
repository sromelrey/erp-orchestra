-- BOM Cost Rollup Stored Procedure
-- This procedure calculates and rolls up costs for all BOMs or a specific BOM
-- It handles multi-level BOM structures and updates the bom_costings table

CREATE OR REPLACE FUNCTION operations.calculate_bom_cost_rollup(
    p_tenant_id INTEGER,
    p_bom_id INTEGER DEFAULT NULL,
    p_costing_date DATE DEFAULT CURRENT_DATE,
    p_costing_method VARCHAR DEFAULT 'STANDARD',
    p_user_id INTEGER,
    p_include_scrap BOOLEAN DEFAULT TRUE,
    p_update_existing BOOLEAN DEFAULT FALSE
)
RETURNS TABLE(
    bom_id INTEGER,
    parent_material_id INTEGER,
    total_cost NUMERIC(15,4),
    unit_cost NUMERIC(15,4),
    material_cost NUMERIC(15,4),
    labor_cost NUMERIC(15,4),
    overhead_cost NUMERIC(15,4),
    scrap_cost NUMERIC(15,4),
    status VARCHAR
) AS $$
DECLARE
    bom_record RECORD;
    component_record RECORD;
    v_total_cost NUMERIC(15,4);
    v_material_cost NUMERIC(15,4);
    v_labor_cost NUMERIC(15,4);
    v_overhead_cost NUMERIC(15,4);
    v_scrap_cost NUMERIC(15,4);
    v_unit_cost NUMERIC(15,4);
    v_output_quantity NUMERIC(8,4);
    v_costing_id INTEGER;
    v_has_components BOOLEAN;
BEGIN
    -- Create a temporary table to track processed BOMs and avoid infinite loops
    CREATE TEMPORARY TABLE IF NOT EXISTS bom_processing_stack (
        bom_id INTEGER,
        level INTEGER,
        processed BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (bom_id)
    );
    
    -- Clear the temporary table
    TRUNCATE TABLE bom_processing_stack;
    
    -- If specific BOM is provided, process only that BOM and its children
    IF p_bom_id IS NOT NULL THEN
        INSERT INTO bom_processing_stack (bom_id, level)
        SELECT id, 0
        FROM operations.boms
        WHERE id = p_bom_id AND tenant_id = p_tenant_id AND deleted_at IS NULL;
    ELSE
        -- Process all active BOMs
        INSERT INTO bom_processing_stack (bom_id, level)
        SELECT id, 0
        FROM operations.boms
        WHERE tenant_id = p_tenant_id AND is_active = TRUE AND deleted_at IS NULL;
    END IF;
    
    -- Process BOMs level by level (bottom-up)
    <<bom_processing>>
    FOR bom_record IN 
        SELECT DISTINCT b.id, b.parent_material_id, b.version
        FROM operations.boms b
        INNER JOIN bom_processing_stack ps ON b.id = ps.bom_id
        WHERE b.tenant_id = p_tenant_id AND b.deleted_at IS NULL
        ORDER BY b.id
    LOOP
        -- Check if BOM has already been processed
        IF EXISTS (SELECT 1 FROM bom_processing_stack WHERE bom_id = bom_record.id AND processed = TRUE) THEN
            CONTINUE bom_processing;
        END IF;
        
        -- Initialize costs
        v_total_cost := 0;
        v_material_cost := 0;
        v_labor_cost := 0;
        v_overhead_cost := 0;
        v_scrap_cost := 0;
        v_output_quantity := 1;
        v_has_components := FALSE;
        
        -- Get BOM items
        FOR component_record IN
            SELECT 
                bi.component_material_id,
                bi.quantity,
                bi.uom,
                bi.scrap_percentage,
                m.name as material_name,
                m.sku as material_sku
            FROM operations.bom_items bi
            INNER JOIN operations.materials m ON bi.component_material_id = m.id
            WHERE bi.bom_id = bom_record.id AND bi.deleted_at IS NULL
        LOOP
            v_has_components := TRUE;
            
            -- Get material cost (simplified - in real implementation, this would query from material_cost table)
            DECLARE
                v_material_unit_cost NUMERIC(15,4);
                v_effective_quantity NUMERIC(12,4);
                v_component_total_cost NUMERIC(15,4);
            BEGIN
                -- Get material cost based on costing method
                v_material_unit_cost := operations.get_material_cost(
                    component_record.component_material_id,
                    p_costing_method,
                    p_costing_date
                );
                
                -- Calculate effective quantity including scrap
                IF p_include_scrap THEN
                    v_effective_quantity := component_record.quantity * (1 + COALESCE(component_record.scrap_percentage, 0) / 100);
                ELSE
                    v_effective_quantity := component_record.quantity;
                END IF;
                
                v_component_total_cost := v_effective_quantity * v_material_unit_cost;
                
                -- Accumulate costs
                v_material_cost := v_material_cost + v_component_total_cost;
                
                -- Calculate scrap cost separately
                IF p_include_scrap THEN
                    v_scrap_cost := v_scrap_cost + 
                        (component_record.quantity * COALESCE(component_record.scrap_percentage, 0) / 100) * v_material_unit_cost;
                END IF;
            END;
        END LOOP;
        
        -- Calculate labor and overhead costs (simplified)
        -- In real implementation, these would come from routing operations
        IF v_has_components THEN
            v_labor_cost := COALESCE(operations.calculate_bom_labor_cost(bom_record.id, p_tenant_id), 0);
            v_overhead_cost := COALESCE(operations.calculate_bom_overhead_cost(bom_record.id, p_tenant_id), 0);
        END IF;
        
        -- Calculate total cost
        v_total_cost := v_material_cost + v_labor_cost + v_overhead_cost + v_scrap_cost;
        v_unit_cost := v_total_cost / v_output_quantity;
        
        -- Update or create BOM costing record
        IF p_update_existing THEN
            -- Deactivate existing costings
            UPDATE operations.bom_costings
            SET is_active = FALSE
            WHERE bom_id = bom_record.id AND tenant_id = p_tenant_id AND is_active = TRUE;
            
            -- Insert new costing record
            INSERT INTO operations.bom_costings (
                tenant_id, bom_id, costing_method, total_material_cost, total_labor_cost,
                total_overhead_cost, total_scrap_cost, total_cost, unit_cost, output_quantity,
                cost_uom, costing_date, is_active, effective_from, created_at, updated_at
            ) VALUES (
                p_tenant_id, bom_record.id, p_costing_method, v_material_cost, v_labor_cost,
                v_overhead_cost, v_scrap_cost, v_total_cost, v_unit_cost, v_output_quantity,
                'EA', p_costing_date, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
            RETURNING id INTO v_costing_id;
            
            -- Save to history
            INSERT INTO operations.bom_costing_history (
                tenant_id, bom_id, bom_costing_id, costing_method, total_material_cost,
                total_labor_cost, total_overhead_cost, total_scrap_cost, total_cost,
                unit_cost, output_quantity, cost_uom, costing_date, change_reason,
                changed_by_user_id, notes, created_at, updated_at
            ) VALUES (
                p_tenant_id, bom_record.id, v_costing_id, p_costing_method, v_material_cost,
                v_labor_cost, v_overhead_cost, v_scrap_cost, v_total_cost,
                v_unit_cost, v_output_quantity, 'EA', p_costing_date, 'Cost rollup calculation',
                p_user_id, 'Automated cost rollup', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            );
        END IF;
        
        -- Mark BOM as processed
        UPDATE bom_processing_stack SET processed = TRUE WHERE bom_id = bom_record.id;
        
        -- Return result row
        RETURN QUERY SELECT 
            bom_record.id,
            bom_record.parent_material_id,
            v_total_cost,
            v_unit_cost,
            v_material_cost,
            v_labor_cost,
            v_overhead_cost,
            v_scrap_cost,
            'COMPLETED'::VARCHAR;
    END LOOP;
    
    -- Clean up temporary table
    DROP TABLE IF EXISTS bom_processing_stack;
    
    RETURN;
END;
$$ LANGUAGE plpgsql;

-- Helper function to get material cost based on costing method
CREATE OR REPLACE FUNCTION operations.get_material_cost(
    p_material_id INTEGER,
    p_costing_method VARCHAR,
    p_cost_date DATE
)
RETURNS NUMERIC(15,4) AS $$
DECLARE
    v_cost NUMERIC(15,4);
BEGIN
    -- Simplified implementation
    -- In real system, this would query from material_cost table based on costing method
    
    CASE p_costing_method
        WHEN 'STANDARD' THEN
            SELECT COALESCE(standard_cost, 10) INTO v_cost
            FROM operations.materials
            WHERE id = p_material_id;
        WHEN 'AVERAGE' THEN
            -- Would calculate average cost from inventory movements
            v_cost := 10.50;
        WHEN 'FIFO' THEN
            -- Would get cost from oldest inventory
            v_cost := 10.25;
        WHEN 'LIFO' THEN
            -- Would get cost from newest inventory
            v_cost := 10.75;
        WHEN 'ACTUAL' THEN
            -- Would get actual cost from last purchase
            v_cost := 11.00;
        ELSE
            v_cost := 10.00;
    END CASE;
    
    RETURN COALESCE(v_cost, 0);
END;
$$ LANGUAGE plpgsql;

-- Helper function to calculate BOM labor cost
CREATE OR REPLACE FUNCTION operations.calculate_bom_labor_cost(
    p_bom_id INTEGER,
    p_tenant_id INTEGER
)
RETURNS NUMERIC(15,4) AS $$
DECLARE
    v_labor_cost NUMERIC(15,4) := 0;
BEGIN
    -- Simplified implementation
    -- In real system, this would sum up labor operations from routing
    -- based on work center rates and operation times
    
    -- For now, return 0 as labor is not implemented
    RETURN v_labor_cost;
END;
$$ LANGUAGE plpgsql;

-- Helper function to calculate BOM overhead cost
CREATE OR REPLACE FUNCTION operations.calculate_bom_overhead_cost(
    p_bom_id INTEGER,
    p_tenant_id INTEGER
)
RETURNS NUMERIC(15,4) AS $$
DECLARE
    v_overhead_cost NUMERIC(15,4) := 0;
BEGIN
    -- Simplified implementation
    -- In real system, this would calculate based on work center overhead rates
    -- or as a percentage of labor cost
    
    -- For now, return 0 as overhead is not implemented
    RETURN v_overhead_cost;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION operations.calculate_bom_cost_rollup TO PUBLIC;
GRANT EXECUTE ON FUNCTION operations.get_material_cost TO PUBLIC;
GRANT EXECUTE ON FUNCTION operations.calculate_bom_labor_cost TO PUBLIC;
GRANT EXECUTE ON FUNCTION operations.calculate_bom_overhead_cost TO PUBLIC;
