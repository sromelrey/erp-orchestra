-- Simple check for required data
-- Run each query separately and share the results

-- 1. Check warehouse
SELECT 'Warehouse' as table_name, id::text, name, is_active::text FROM operations.warehouses WHERE id = 1;

-- 2. Check location  
SELECT 'Location' as table_name, id::text, name, warehouse_id::text FROM operations.warehouse_locations WHERE id = 1;

-- 3. Check department
SELECT 'Department' as table_name, id::text, name FROM hris.departments WHERE id = 1;

-- 4. Check item
SELECT 'Item' as table_name, id::text, name, is_active::text FROM operations.items WHERE id = 1;

-- 5. Check UOM
SELECT 'UOM' as table_name, id::text, name, code FROM operations.units_of_measure WHERE id = 1;

-- 6. Check if tenant_id column exists
SELECT 'tenant_id column' as info, 
       CASE WHEN COUNT(*) > 0 THEN 'EXISTS' ELSE 'MISSING' END as status
FROM information_schema.columns 
WHERE table_schema = 'operations' 
  AND table_name = 'goods_issuance_items' 
  AND column_name = 'tenant_id';

-- 7. Count goods issuances
SELECT 'Goods Issuances Count' as info, COUNT(*)::text as count
FROM operations.goods_issuances;

-- 8. Count goods issuance items
SELECT 'Goods Issuance Items Count' as info, COUNT(*)::text as count
FROM operations.goods_issuance_items;
