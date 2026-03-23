import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBomCostingTables20260320130000 implements MigrationInterface {
  name = 'CreateBomCostingTables20260320130000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create schema if not exists
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS operations`);

    // bom_costings
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS operations.bom_costings (
        id SERIAL PRIMARY KEY,
        tenant_id INT NOT NULL,
        bom_id INT NOT NULL,
        costing_method VARCHAR(30) NOT NULL DEFAULT 'STANDARD',
        total_material_cost NUMERIC(15,4) NOT NULL DEFAULT 0,
        total_labor_cost NUMERIC(15,4) NOT NULL DEFAULT 0,
        total_overhead_cost NUMERIC(15,4) NOT NULL DEFAULT 0,
        total_scrap_cost NUMERIC(15,4) NOT NULL DEFAULT 0,
        total_cost NUMERIC(15,4) NOT NULL DEFAULT 0,
        unit_cost NUMERIC(15,4) NOT NULL DEFAULT 0,
        output_quantity NUMERIC(8,4) NOT NULL DEFAULT 1,
        cost_uom VARCHAR(10) NOT NULL DEFAULT 'EA',
        costing_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
        notes TEXT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        effective_from TIMESTAMP WITHOUT TIME ZONE NULL,
        effective_to TIMESTAMP WITHOUT TIME ZONE NULL,
        created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP WITHOUT TIME ZONE NULL,
        CONSTRAINT fk_bom_costings_tenant FOREIGN KEY (tenant_id) REFERENCES system.tenants(id) ON DELETE RESTRICT,
        CONSTRAINT fk_bom_costings_bom FOREIGN KEY (bom_id) REFERENCES operations.boms(id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_bom_costings_tenant ON operations.bom_costings (tenant_id) WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_bom_costings_bom ON operations.bom_costings (bom_id) WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_bom_costings_tenant_bom ON operations.bom_costings (tenant_id, bom_id) WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_bom_costings_tenant_date ON operations.bom_costings (tenant_id, costing_date) WHERE deleted_at IS NULL`,
    );

    // bom_costing_components
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS operations.bom_costing_components (
        id SERIAL PRIMARY KEY,
        tenant_id INT NOT NULL,
        bom_costing_id INT NOT NULL,
        component_material_id INT NOT NULL,
        cost_component_type VARCHAR(30) NOT NULL DEFAULT 'MATERIAL',
        required_quantity NUMERIC(12,4) NOT NULL,
        quantity_uom VARCHAR(10) NOT NULL,
        scrap_percentage NUMERIC(8,4) NOT NULL DEFAULT 0,
        effective_quantity NUMERIC(12,4) NOT NULL,
        unit_cost NUMERIC(15,4) NOT NULL DEFAULT 0,
        total_cost NUMERIC(15,4) NOT NULL DEFAULT 0,
        cost_source VARCHAR(20) NULL,
        cost_date TIMESTAMP WITHOUT TIME ZONE NULL,
        notes TEXT NULL,
        created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP WITHOUT TIME ZONE NULL,
        CONSTRAINT fk_bom_costing_components_tenant FOREIGN KEY (tenant_id) REFERENCES system.tenants(id) ON DELETE RESTRICT,
        CONSTRAINT fk_bom_costing_components_costing FOREIGN KEY (bom_costing_id) REFERENCES operations.bom_costings(id) ON DELETE CASCADE,
        CONSTRAINT fk_bom_costing_components_material FOREIGN KEY (component_material_id) REFERENCES operations.materials(id) ON DELETE RESTRICT
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_bom_costing_components_tenant ON operations.bom_costing_components (tenant_id) WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_bom_costing_components_costing ON operations.bom_costing_components (bom_costing_id) WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_bom_costing_components_material ON operations.bom_costing_components (component_material_id) WHERE deleted_at IS NULL`,
    );

    // bom_costing_history
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS operations.bom_costing_history (
        id SERIAL PRIMARY KEY,
        tenant_id INT NOT NULL,
        bom_id INT NOT NULL,
        bom_costing_id INT NOT NULL,
        costing_method VARCHAR(30) NOT NULL,
        total_material_cost NUMERIC(15,4) NOT NULL,
        total_labor_cost NUMERIC(15,4) NOT NULL,
        total_overhead_cost NUMERIC(15,4) NOT NULL,
        total_scrap_cost NUMERIC(15,4) NOT NULL,
        total_cost NUMERIC(15,4) NOT NULL,
        unit_cost NUMERIC(15,4) NOT NULL,
        output_quantity NUMERIC(8,4) NOT NULL,
        cost_uom VARCHAR(10) NOT NULL,
        costing_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
        change_reason VARCHAR(255) NULL,
        changed_by_user_id INT NULL,
        notes TEXT NULL,
        created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP WITHOUT TIME ZONE NULL,
        CONSTRAINT fk_bom_costing_history_tenant FOREIGN KEY (tenant_id) REFERENCES system.tenants(id) ON DELETE RESTRICT,
        CONSTRAINT fk_bom_costing_history_bom FOREIGN KEY (bom_id) REFERENCES operations.boms(id) ON DELETE CASCADE,
        CONSTRAINT fk_bom_costing_history_costing FOREIGN KEY (bom_costing_id) REFERENCES operations.bom_costings(id) ON DELETE CASCADE,
        CONSTRAINT fk_bom_costing_history_user FOREIGN KEY (changed_by_user_id) REFERENCES system.users(id) ON DELETE SET NULL
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_bom_costing_history_tenant ON operations.bom_costing_history (tenant_id) WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_bom_costing_history_bom ON operations.bom_costing_history (bom_id) WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_bom_costing_history_costing ON operations.bom_costing_history (bom_costing_id) WHERE deleted_at IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE IF EXISTS operations.bom_costing_history`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS operations.bom_costing_components`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS operations.bom_costings`);
  }
}
