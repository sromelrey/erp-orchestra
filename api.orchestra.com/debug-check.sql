-- Check if warehouse exists
SELECT id, name, is_active FROM operations.warehouses WHERE id = 1;

-- Check if location exists
SELECT id, name, warehouse_id FROM operations.warehouse_locations WHERE id = 1;

-- Check if department exists
SELECT id, name FROM hris.departments WHERE id = 1;

-- Check if item exists
SELECT id, name, is_active FROM operations.items WHERE id = 1;

-- Check if UOM exists
SELECT id, name, code FROM operations.units_of_measure WHERE id = 1;

-- Check if goods_issuance_items table has tenant_id column
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'operations' 
  AND table_name = 'goods_issuance_items' 
  AND column_name IN ('tenant_id', 'goods_issuance_id')
ORDER BY column_name;

-- Check all columns in goods_issuance_items table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'operations' 
  AND table_name = 'goods_issuance_items'
ORDER BY ordinal_position;

-- Check latest goods issuance to see if it's being created
SELECT id, issuance_number, status, tenant_id, created_at
FROM operations.goods_issuances 
ORDER BY created_at DESC 
LIMIT 5;

-- Check if there are any goods issuance items (even deleted ones)
SELECT id, goods_issuance_id, tenant_id, created_at, deleted_at
FROM operations.goods_issuance_items 
ORDER BY created_at DESC 
LIMIT 5;
