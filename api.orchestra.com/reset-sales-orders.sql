-- Reset Sales Orders Tables
-- This script truncates sales_orders and sales_order_items tables
-- and resets their identity sequences to start from 1

-- Disable foreign key checks temporarily
SET CONSTRAINTS ALL DEFERRED;

-- Truncate tables with CASCADE to handle foreign key relationships
-- This will delete all data and reset sequences
TRUNCATE TABLE "operations"."sales_order_items" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "operations"."sales_orders" RESTART IDENTITY CASCADE;

-- Re-enable constraints
SET CONSTRAINTS ALL IMMEDIATE;

-- Verify sequences are reset
SELECT 
    'sales_orders' as table_name,
    last_value as current_id_value
FROM "operations"."sales_orders_id_seq"
UNION ALL
SELECT 
    'sales_order_items' as table_name,
    last_value as current_id_value
FROM "operations"."sales_order_items_id_seq";

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Sales orders tables have been truncated and identities reset successfully.';
END $$;
