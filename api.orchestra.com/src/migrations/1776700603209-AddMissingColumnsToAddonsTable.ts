import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMissingColumnsToAddonsTable1776700603209 implements MigrationInterface {
  name = 'AddMissingColumnsToAddonsTable1776700603209';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" DROP CONSTRAINT "FK_boms_tenant"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" DROP CONSTRAINT "FK_boms_parent_material"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_config"."service_configurations" DROP CONSTRAINT "FK_service_configurations_service_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_config"."service_configurations" DROP CONSTRAINT "FK_service_configurations_service_option"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_config"."service_configurations" DROP CONSTRAINT "FK_service_configurations_bom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfer_items" DROP CONSTRAINT "FK_65b97def8b4b8818588df351085"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfer_items" DROP CONSTRAINT "FK_d96a54ec2527ba6eb25a172b177"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfer_items" DROP CONSTRAINT "FK_b33fcfec16f9f23a37ba4277bc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."items" DROP CONSTRAINT "FK_items_base_uom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."items" DROP CONSTRAINT "FK_items_category"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouse_locations" DROP CONSTRAINT "FK_locations_parent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouse_locations" DROP CONSTRAINT "FK_locations_warehouse"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_items" DROP CONSTRAINT "FK_bom_items_bom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_items" DROP CONSTRAINT "FK_bom_items_component_material"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" DROP CONSTRAINT "fk_bom_costings_tenant"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" DROP CONSTRAINT "fk_bom_costings_bom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" DROP CONSTRAINT "fk_bom_costings_created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" DROP CONSTRAINT "fk_bom_costings_updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" DROP CONSTRAINT "fk_bom_costings_deleted_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" DROP CONSTRAINT "fk_bom_costing_components_tenant"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" DROP CONSTRAINT "fk_bom_costing_components_costing"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" DROP CONSTRAINT "fk_bom_costing_components_material"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" DROP CONSTRAINT "fk_bom_costing_components_created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" DROP CONSTRAINT "fk_bom_costing_components_updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" DROP CONSTRAINT "fk_bom_costing_components_deleted_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" DROP CONSTRAINT "fk_bom_costing_history_tenant"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" DROP CONSTRAINT "fk_bom_costing_history_bom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" DROP CONSTRAINT "fk_bom_costing_history_costing"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" DROP CONSTRAINT "fk_bom_costing_history_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" DROP CONSTRAINT "fk_bom_costing_history_created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" DROP CONSTRAINT "fk_bom_costing_history_updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" DROP CONSTRAINT "fk_bom_costing_history_deleted_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."item_units" DROP CONSTRAINT "FK_item_units_item"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."item_units" DROP CONSTRAINT "FK_item_units_uom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" DROP CONSTRAINT "FK_stock_ledger_warehouse"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" DROP CONSTRAINT "FK_stock_ledger_location"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" DROP CONSTRAINT "FK_stock_ledger_item"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" DROP CONSTRAINT "FK_stock_ledger_uom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_balances" DROP CONSTRAINT "FK_stock_balance_warehouse"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_balances" DROP CONSTRAINT "FK_stock_balance_location"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_balances" DROP CONSTRAINT "FK_stock_balance_item"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_balances" DROP CONSTRAINT "FK_stock_balance_uom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustment_items" DROP CONSTRAINT "FK_5e0e7ab580d7353dbea6d5b00dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustment_items" DROP CONSTRAINT "FK_08639ba664eb716bc243fff516a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustment_items" DROP CONSTRAINT "FK_8652db11ecddc664555b04320f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustments" DROP CONSTRAINT "FK_ffcab531cd75f7559af2f209038"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustments" DROP CONSTRAINT "FK_7d4c66394f3e18da59ea4ffacf6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustments" DROP CONSTRAINT "FK_47a0d77bb1e6422ffb50967a37e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" DROP CONSTRAINT "FK_addon_inclusion_rules_addon_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addons" DROP CONSTRAINT "FK_addons_material_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" DROP CONSTRAINT "FK_sales_order_item_addons_sales_order_item_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" DROP CONSTRAINT "FK_sales_order_item_addons_addon_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" DROP CONSTRAINT "FK_sales_order_items_service_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" DROP CONSTRAINT "FK_sales_order_items_service_option"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."payslips" DROP CONSTRAINT "FK_40956e26bd6c726a7109991745b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."payslips" DROP CONSTRAINT "FK_3eed6f447923a5b9a255878879f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."payslips" DROP CONSTRAINT "FK_3ca6cde51127cd649278d038ca9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfers" DROP CONSTRAINT "FK_f7b8ce0d2d24cebaeb903d6cf5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfers" DROP CONSTRAINT "FK_90421bfbb4ed38bd740be7c03c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfers" DROP CONSTRAINT "FK_68f64445b6b21e94fb9964eebaf"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_service_options_tenant"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."UQ_service_options_tenant_code"`,
    );
    await queryRunner.query(`DROP INDEX "operations"."IDX_boms_tenant"`);
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_boms_parent_material"`,
    );
    await queryRunner.query(`DROP INDEX "operations"."IDX_boms_tenant_parent"`);
    await queryRunner.query(`DROP INDEX "operations"."IDX_boms_tenant_status"`);
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_boms_material_version"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_service_configurations_tenant"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_service_configurations_service_type"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_service_configurations_service_option"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_service_configurations_bom"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."UQ_service_configurations_lookup"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_service_types_tenant"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."UQ_service_types_tenant_code"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_service_conditions_tenant"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."UQ_service_conditions_tenant_code"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."inventory_materials_sku_key"`,
    );
    await queryRunner.query(`DROP INDEX "inventory"."idx_materials_tenant_id"`);
    await queryRunner.query(
      `DROP INDEX "inventory"."idx_materials_tenant_id_material_type"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."idx_materials_tenant_id_material_group"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."idx_materials_tenant_id_is_active"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_transfer_items_transfer_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_transfer_items_item_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_transfer_items_batch"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_item_categories_tenant"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_units_of_measure_tenant"`,
    );
    await queryRunner.query(`DROP INDEX "inventory"."IDX_items_tenant"`);
    await queryRunner.query(`DROP INDEX "inventory"."IDX_items_category"`);
    await queryRunner.query(`DROP INDEX "inventory"."IDX_locations_tenant"`);
    await queryRunner.query(`DROP INDEX "inventory"."IDX_locations_path"`);
    await queryRunner.query(`DROP INDEX "inventory"."IDX_warehouses_tenant"`);
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_bom_items_bom_component"`,
    );
    await queryRunner.query(`DROP INDEX "operations"."IDX_bom_items_bom"`);
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_bom_items_component"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_bom_items_sort_order"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_bom_costings_tenant"`,
    );
    await queryRunner.query(`DROP INDEX "operations"."idx_bom_costings_bom"`);
    await queryRunner.query(
      `DROP INDEX "operations"."idx_bom_costings_tenant_bom"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_bom_costings_tenant_date"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_bom_costing_components_costing"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_bom_costing_components_material"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_bom_costing_components_tenant"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_bom_costing_history_costing"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_bom_costing_history_tenant"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_bom_costing_history_bom"`,
    );
    await queryRunner.query(`DROP INDEX "operations"."IDX_item_units_item"`);
    await queryRunner.query(`DROP INDEX "operations"."IDX_item_units_tenant"`);
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_item_units_tenant_item"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_ledger_tenant_item"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_ledger_tenant_wh"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_ledger_document_date"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_ledger_tenant_wh_doc"`,
    );
    await queryRunner.query(`DROP INDEX "operations"."UQ_stock_balance_scope"`);
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_balance_tenant_wh_loc"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_balance_scope_lookup"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_adj_items_adjustment_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_adj_items_item_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_adj_items_batch"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_adjustments_tenant_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_adjustments_warehouse_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_adjustments_status"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_adjustments_date"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_adjustments_tenant_warehouse"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_addon_inclusion_rules_tenant_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_addon_inclusion_rules_addon_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_addon_inclusion_rules_is_active"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_addons_tenant_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_addons_code"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_addons_type"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_addons_is_active"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_sales_order_item_addons_tenant_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_sales_order_item_addons_sales_order_item_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_sales_order_item_addons_addon_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_sales_order_items_service_type_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_sales_order_items_service_option_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_sales_order_items_sales_order_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_sales_order_items_item_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_sales_order_items_created_by"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_sales_orders_tenant_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_sales_orders_customer_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_sales_orders_status"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_sales_orders_order_date"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_sales_orders_order_no"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_sales_orders_created_by"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_production_batches_status"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_production_batches_batch_no"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_production_batches_tenant_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_production_batches_bom_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_production_work_orders_batch_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_production_work_orders_status"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_production_consumption_batch_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."idx_production_consumption_item_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_hris_employee_tenant_status"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_hris_employee_tenant_department"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_hris_employee_tenant_manager"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."UQ_hris_leave_type_tenant_name"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_payslips_tenant_period_employee"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_hris_payslip_tenant_pay_period"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_hris_payslip_tenant_employee"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_hris_payslip_tenant_status"`,
    );
    await queryRunner.query(`DROP INDEX "hris"."IDX_hris_import_jobs_tenant"`);
    await queryRunner.query(`DROP INDEX "hris"."IDX_hris_export_jobs_tenant"`);
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_transfers_tenant_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_transfers_source_warehouse"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_transfers_dest_warehouse"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_transfers_status"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_stock_transfers_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" DROP CONSTRAINT "CHK_addon_rules_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addons" DROP CONSTRAINT "CHK_addons_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" DROP CONSTRAINT "UQ_permissions_module_action_resource"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" DROP CONSTRAINT "UQ_boms_tenant_material_version"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."item_categories" DROP CONSTRAINT "UQ_item_categories_tenant_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."units_of_measure" DROP CONSTRAINT "UQ_units_of_measure_tenant_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."items" DROP CONSTRAINT "UQ_items_tenant_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouse_locations" DROP CONSTRAINT "UQ_locations_wh_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouses" DROP CONSTRAINT "UQ_warehouses_tenant_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."item_units" DROP CONSTRAINT "UQ_item_units_item_uom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addons" DROP CONSTRAINT "UQ_addons_tenant_code"`,
    );
    await queryRunner.query(
      `CREATE TABLE "operations"."goods_receipt_items" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "goods_receipt_id" integer NOT NULL, "item_id" integer NOT NULL, "uom_id" integer NOT NULL, "quantity_ordered" numeric(18,6) NOT NULL DEFAULT '0', "quantity_received" numeric(18,6) NOT NULL DEFAULT '0', "unit_price" numeric(18,2), "total_price" numeric(18,2), "batch_number" character varying(64), "expiry_date" date, "notes" text, CONSTRAINT "PK_3773489ac01faa49777eed0a14f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_18cc8be3690442e0be958c2d89" ON "operations"."goods_receipt_items" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_70eee06015fd0dd630eed4a6b8" ON "operations"."goods_receipt_items" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE TYPE "operations"."goods_receipts_receipt_type_enum" AS ENUM('PURCHASE_ORDER', 'PRODUCTION', 'RETURN', 'MANUAL')`,
    );
    await queryRunner.query(
      `CREATE TYPE "operations"."goods_receipts_status_enum" AS ENUM('DRAFT', 'CONFIRMED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "operations"."goods_receipts" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "tenant_id" integer NOT NULL, "receipt_number" character varying(64) NOT NULL, "receipt_type" "operations"."goods_receipts_receipt_type_enum" NOT NULL, "reference_type" character varying(64), "reference_code" character varying(64), "supplier_id" integer, "warehouse_id" integer NOT NULL, "location_id" integer, "receipt_date" TIMESTAMP NOT NULL, "expected_date" TIMESTAMP, "status" "operations"."goods_receipts_status_enum" NOT NULL DEFAULT 'DRAFT', "notes" text, "total_quantity" numeric(18,6) NOT NULL DEFAULT '0', "total_value" numeric(18,2) NOT NULL DEFAULT '0', CONSTRAINT "PK_f8cac411be0211f923e1be8534f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8e43e8f319de3fe052f8e2f605" ON "operations"."goods_receipts" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eb2eca7ca7be2bf6cb4e9ff6ae" ON "operations"."goods_receipts" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_536cbd78047fc1325d999b85f9" ON "operations"."goods_receipts" ("receipt_date") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_85cf4c20aa82287f7435974383" ON "operations"."goods_receipts" ("status") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_1f700b4284c0aeb3dea8b289e1" ON "operations"."goods_receipts" ("tenant_id", "receipt_number") `,
    );
    await queryRunner.query(
      `CREATE TABLE "operations"."goods_issuance_items" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "tenant_id" integer NOT NULL, "goods_issuance_id" integer NOT NULL, "item_id" integer NOT NULL, "uom_id" integer NOT NULL, "quantity_issued" numeric(15,3) NOT NULL, "unit_price" numeric(15,2), "total_price" numeric(15,2), "batch_number" character varying(64), "expiry_date" date, "notes" text, CONSTRAINT "PK_3f5b083d06400be4823c5903434" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0211a28397496375d44bc458ad" ON "operations"."goods_issuance_items" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_530406662f8b68d7b9d7e7a962" ON "operations"."goods_issuance_items" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_024ce39439c968e68669ebda7b" ON "operations"."goods_issuance_items" ("item_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dd590f71e3c7e9d1e10743b18b" ON "operations"."goods_issuance_items" ("goods_issuance_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "operations"."goods_issuances_issuance_type_enum" AS ENUM('PRODUCTION', 'SALES', 'TRANSFER', 'ADJUSTMENT', 'RETURN')`,
    );
    await queryRunner.query(
      `CREATE TYPE "operations"."goods_issuances_reference_type_enum" AS ENUM('PRODUCTION_ORDER', 'SALES_ORDER', 'TRANSFER_ORDER', 'ADJUSTMENT_REASON', 'RETURN_ORDER', 'NONE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "operations"."goods_issuances_status_enum" AS ENUM('DRAFT', 'APPROVED', 'ISSUED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "operations"."goods_issuances" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "tenant_id" integer NOT NULL, "issuance_number" character varying(64) NOT NULL, "issuance_type" "operations"."goods_issuances_issuance_type_enum" NOT NULL, "reference_type" "operations"."goods_issuances_reference_type_enum", "reference_code" character varying(64), "issued_to_department_id" integer, "cost_center_id" integer, "warehouse_id" integer NOT NULL, "location_id" integer, "issuance_date" TIMESTAMP NOT NULL, "expected_date" TIMESTAMP, "status" "operations"."goods_issuances_status_enum" NOT NULL DEFAULT 'DRAFT', "notes" text, "total_quantity" numeric(15,3) NOT NULL DEFAULT '0', "total_value" numeric(15,2) NOT NULL DEFAULT '0', "approved_by" integer, "approved_at" TIMESTAMP, CONSTRAINT "UQ_29ed07014aa79ff5582ab50c7ee" UNIQUE ("issuance_number"), CONSTRAINT "PK_3169dac90a8126e6833c7669eb4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f628b73b36197928dd4b1b7bff" ON "operations"."goods_issuances" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1fc02b9087305469a4059daa79" ON "operations"."goods_issuances" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b42bc1d3353cbb33c4d6540710" ON "operations"."goods_issuances" ("issued_to_department_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a2c3b7e425129a2ba06d36434f" ON "operations"."goods_issuances" ("warehouse_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3685ff15a03f6c2a0476baa92b" ON "operations"."goods_issuances" ("issuance_date") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e11c485ca7523661c11abf05c9" ON "operations"."goods_issuances" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_420684d03ba26f2f6aa65bbf2d" ON "operations"."goods_issuances" ("issuance_type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_29ed07014aa79ff5582ab50c7e" ON "operations"."goods_issuances" ("issuance_number") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1f708e92c414c1cd336421283b" ON "operations"."goods_issuances" ("tenant_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" DROP COLUMN "previousvalues"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" DROP COLUMN "tenant_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" DROP COLUMN "rule_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" DROP COLUMN "threshold_value"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" DROP COLUMN "discount_percent"`,
    );
    await queryRunner.query(`ALTER TABLE "addons" DROP COLUMN "tenant_id"`);
    await queryRunner.query(`ALTER TABLE "addons" DROP COLUMN "base_price"`);
    await queryRunner.query(`ALTER TABLE "addons" DROP COLUMN "material_id"`);
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" DROP COLUMN "tenant_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" DROP COLUMN "unit_price"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" ADD "deleted_by" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" ADD "tenantId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" ADD "addonId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" ADD "ruleType" character varying(20) NOT NULL DEFAULT 'MIN_QTY'`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" ADD "thresholdValue" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" ADD "discountPercent" numeric(5,2) NOT NULL DEFAULT '100'`,
    );
    await queryRunner.query(`ALTER TABLE "addons" ADD "deleted_by" integer`);
    await queryRunner.query(
      `ALTER TABLE "addons" ADD "tenantId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "addons" ADD "basePrice" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "addons" ADD "materialId" integer`);
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" ADD "deleted_by" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" ADD "tenantId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" ADD "addonId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" ADD "unitPrice" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."job_execution_logs" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" DROP COLUMN "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" ADD "name" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_config"."service_configurations" ALTER COLUMN "price" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_1d477ea1e1e386bd06d08b839a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."materials" DROP COLUMN "material_type"`,
    );
    await queryRunner.query(
      `CREATE TYPE "inventory"."materials_material_type_enum" AS ENUM('RAW', 'SEMI_FINISHED', 'FINISHED', 'SERVICE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."materials" ADD "material_type" "inventory"."materials_material_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfer_items" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfer_items" ALTER COLUMN "updated_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfer_items" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."item_categories" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."units_of_measure" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."items" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouse_locations" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouses" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" ALTER COLUMN "updated_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" DROP COLUMN "costing_method"`,
    );
    await queryRunner.query(
      `CREATE TYPE "operations"."bom_costings_costing_method_enum" AS ENUM('STANDARD', 'AVERAGE', 'FIFO', 'LIFO', 'ACTUAL')`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" ADD "costing_method" "operations"."bom_costings_costing_method_enum" NOT NULL DEFAULT 'STANDARD'`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" ALTER COLUMN "costing_date" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" ALTER COLUMN "updated_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" DROP COLUMN "cost_component_type"`,
    );
    await queryRunner.query(
      `CREATE TYPE "operations"."bom_costing_components_cost_component_type_enum" AS ENUM('MATERIAL', 'LABOR', 'OVERHEAD', 'SCRAP')`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" ADD "cost_component_type" "operations"."bom_costing_components_cost_component_type_enum" NOT NULL DEFAULT 'MATERIAL'`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" ALTER COLUMN "updated_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" ALTER COLUMN "bom_costing_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" DROP COLUMN "costing_method"`,
    );
    await queryRunner.query(
      `CREATE TYPE "operations"."bom_costing_history_costing_method_enum" AS ENUM('STANDARD', 'AVERAGE', 'FIFO', 'LIFO', 'ACTUAL')`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" ADD "costing_method" "operations"."bom_costing_history_costing_method_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" DROP COLUMN "change_reason"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" ADD "change_reason" character varying(50) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" ALTER COLUMN "changed_by_user_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."item_units" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TYPE "operations"."stock_movement_type" RENAME TO "stock_movement_type_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "operations"."stock_ledger_movement_type_enum" AS ENUM('RECEIPT', 'ISSUE', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" ALTER COLUMN "movement_type" TYPE "operations"."stock_ledger_movement_type_enum" USING "movement_type"::"text"::"operations"."stock_ledger_movement_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "operations"."stock_movement_type_old"`);
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" ALTER COLUMN "document_date" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_balances" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustment_items" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustment_items" ALTER COLUMN "updated_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustment_items" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustments" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustments" ALTER COLUMN "updated_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustments" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" ALTER COLUMN "created_by" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" ALTER COLUMN "updated_by" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" ALTER COLUMN "updated_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" ALTER COLUMN "addon_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "addons" ALTER COLUMN "created_by" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "addons" ALTER COLUMN "updated_by" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "addons" ALTER COLUMN "updated_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" ALTER COLUMN "created_by" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" ALTER COLUMN "updated_by" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" ALTER COLUMN "updated_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" ALTER COLUMN "quantity" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" ALTER COLUMN "addon_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ALTER COLUMN "created_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ALTER COLUMN "discount_percent" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ALTER COLUMN "discount_amount" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ALTER COLUMN "tax_percent" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ALTER COLUMN "tax_amount" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ALTER COLUMN "delivered_quantity" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ALTER COLUMN "allocated_quantity" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "created_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TYPE "operations"."sales_order_status" RENAME TO "sales_order_status_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "operations"."sales_orders_status_enum" AS ENUM('DRAFT', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "status" TYPE "operations"."sales_orders_status_enum" USING "status"::"text"::"operations"."sales_orders_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`DROP TYPE "operations"."sales_order_status_old"`);
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "status" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "total_amount" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "discount_amount" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "tax_amount" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "final_amount" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_batches" ALTER COLUMN "created_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_batches" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_batches" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TYPE "operations"."production_status" RENAME TO "production_status_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "operations"."production_batches_status_enum" AS ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_batches" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_batches" ALTER COLUMN "status" TYPE "operations"."production_batches_status_enum" USING "status"::"text"::"operations"."production_batches_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_batches" ALTER COLUMN "status" SET DEFAULT 'PLANNED'`,
    );
    await queryRunner.query(`DROP TYPE "operations"."production_status_old"`);
    await queryRunner.query(
      `ALTER TABLE "operations"."production_batches" ALTER COLUMN "status" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_work_orders" ALTER COLUMN "created_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_work_orders" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_work_orders" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TYPE "operations"."production_status" RENAME TO "production_status_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "operations"."production_work_orders_status_enum" AS ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_work_orders" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_work_orders" ALTER COLUMN "status" TYPE "operations"."production_work_orders_status_enum" USING "status"::"text"::"operations"."production_work_orders_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_work_orders" ALTER COLUMN "status" SET DEFAULT 'PLANNED'`,
    );
    await queryRunner.query(`DROP TYPE "operations"."production_status_old"`);
    await queryRunner.query(
      `ALTER TABLE "operations"."production_work_orders" ALTER COLUMN "status" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_consumption" ALTER COLUMN "created_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_consumption" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_consumption" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_consumption" ALTER COLUMN "waste_quantity" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."employee_compensations" ALTER COLUMN "overtime_rate" SET DEFAULT '1.5'`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."payslips" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."payslips" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TYPE "hris"."hris_job_status_enum" RENAME TO "hris_job_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "hris"."hris_import_jobs_status_enum" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_import_jobs" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_import_jobs" ALTER COLUMN "status" TYPE "hris"."hris_import_jobs_status_enum" USING "status"::"text"::"hris"."hris_import_jobs_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_import_jobs" ALTER COLUMN "status" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(`DROP TYPE "hris"."hris_job_status_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_import_jobs" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_import_jobs" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_import_jobs" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_import_jobs" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TYPE "hris"."hris_job_status_enum" RENAME TO "hris_job_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "hris"."hris_export_jobs_status_enum" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_export_jobs" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_export_jobs" ALTER COLUMN "status" TYPE "hris"."hris_export_jobs_status_enum" USING "status"::"text"::"hris"."hris_export_jobs_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_export_jobs" ALTER COLUMN "status" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(`DROP TYPE "hris"."hris_job_status_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_export_jobs" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_export_jobs" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_export_jobs" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_export_jobs" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfers" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfers" ALTER COLUMN "updated_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfers" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_12c4a270427ba0a6ae6a09fdb1" ON "service_config"."service_options" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c3a664d20f12bda1265b22995c" ON "service_config"."service_options" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3b515861a3b646576bfee7a9fa" ON "service_config"."service_options" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b2bf7aa6e088a184f422c58025" ON "service_config"."service_options" ("tenant_id", "code") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8e2e6dbaf5efc52f7daa729c2a" ON "service_config"."service_configurations" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4de40ca44f094976782466fc20" ON "service_config"."service_configurations" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5dc73ade5cd26a4d353ce2662f" ON "service_config"."service_configurations" ("bom_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_256538da4eef8cfa85ff0c7c85" ON "service_config"."service_configurations" ("service_option_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_be76f68bf56d8759c05fb0dd03" ON "service_config"."service_configurations" ("service_type_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c4fd2870fe6fda89e519cf48a2" ON "service_config"."service_configurations" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_6ca2f850e608f68d8d5003efea" ON "service_config"."service_configurations" ("tenant_id", "service_type_id", "service_option_id", "condition_key", "condition_value") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0da7d39769a1e4a208e0b8f83e" ON "service_config"."service_types" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fb99027007816c3075dd92e325" ON "service_config"."service_types" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_298bb64117e3c2c5b1f431e6ef" ON "service_config"."service_types" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_04060d1bb05702fd4863898682" ON "service_config"."service_types" ("tenant_id", "code") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2b9e1d27ae9f5ad754475a278d" ON "service_config"."service_conditions" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0e20d891bc0bf2561e933f61d2" ON "service_config"."service_conditions" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_465835f1e33cbaf3106cea8ac7" ON "service_config"."service_conditions" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4ee7cba1a9f258b347198ef239" ON "service_config"."service_conditions" ("tenant_id", "code") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1d477ea1e1e386bd06d08b839a" ON "inventory"."materials" ("tenant_id", "material_type") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_65b97def8b4b8818588df35108" ON "operations"."stock_transfer_items" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fd5629216a74058d56891ce73d" ON "operations"."stock_transfer_items" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6bbf0b8664e146bfd40c81c0df" ON "operations"."stock_transfer_items" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c7bc2589bd1fe4671b64d3a307" ON "operations"."stock_transfer_items" ("stock_transfer_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5cba72118c885bcdaa0fb39efa" ON "operations"."stock_transfer_items" ("item_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_75aea322fc65c99f97d20c208e" ON "operations"."stock_transfer_items" ("batch_number") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9f9053ca0fc56da9517e17c942" ON "operations"."stock_transfer_items" ("item_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_976e94ac7ff52e9865ecab78e1" ON "operations"."stock_transfer_items" ("stock_transfer_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_24a85a5dc53bdd2f63393162cd" ON "operations"."stock_transfer_items" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f2a4c2797fc44e6f6e749b5539" ON "inventory"."item_categories" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_614d10949717c3b71f77449ec3" ON "inventory"."item_categories" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_91db5b2678d1a5f10532917187" ON "inventory"."item_categories" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d70752545799d3765b8410a519" ON "inventory"."item_categories" ("tenant_id", "code") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_41635e17371ae549c9613a8a7e" ON "inventory"."units_of_measure" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ef552f22175a720d41feff4304" ON "inventory"."units_of_measure" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5e444db68b0195d4bb9ca87680" ON "inventory"."units_of_measure" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4326f7aa6691d4cafbb224a0ca" ON "inventory"."units_of_measure" ("tenant_id", "code") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_25a958155bb9a9d741210749e0" ON "inventory"."items" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_02c9c7f4f86c3628ba6ec2e02b" ON "inventory"."items" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a7447b3c6c0f84185b14ffaff0" ON "inventory"."items" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d8235b485bd2694707257f7432" ON "inventory"."items" ("tenant_id", "code") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_aaeda3c25476c756fce76fbc6d" ON "inventory"."warehouse_locations" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bbed7c73e82507820c45d0f74f" ON "inventory"."warehouse_locations" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_417c0987f9a97c8810a41609fe" ON "inventory"."warehouse_locations" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d066c1135d4623a115c3996b7b" ON "inventory"."warehouses" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d458d3ad7d187ba7e4d4139cd6" ON "inventory"."warehouses" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_539e63f0d9fadf561bca4de13d" ON "inventory"."warehouses" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_f0721373cb4cbd452c16aed3b0" ON "inventory"."warehouses" ("tenant_id", "code") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_914c74963ec0ad6ff689e0355c" ON "operations"."bom_costings" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0bfe4beea50e94ace8c6ec25cf" ON "operations"."bom_costings" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_aa93b5e971211ae164a61e0d65" ON "operations"."bom_costings" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_de786974602a16f2a4c0769879" ON "operations"."bom_costings" ("bom_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a72669143115115187dbe4af5f" ON "operations"."bom_costings" ("tenant_id", "costing_date") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_aa362ef95a82651776f9e71874" ON "operations"."bom_costings" ("tenant_id", "bom_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_21d8146355e8027297d60d0d92" ON "operations"."bom_costings" ("bom_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_198da8b72090339e1dad671b48" ON "operations"."bom_costings" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0a58869b7519d23594a7ee718d" ON "operations"."bom_costing_components" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_50da63915296f5cc994865a192" ON "operations"."bom_costing_components" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a92369fdff5ee9817b5710ae29" ON "operations"."bom_costing_components" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_99728f95b76b93f9d3e0620d18" ON "operations"."bom_costing_components" ("bom_costing_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_aaab59825a34874e36b042ed63" ON "operations"."bom_costing_components" ("component_material_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5f535c182f3c40aa5b6002c211" ON "operations"."bom_costing_components" ("component_material_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9cc3225ca64436ce75532ca969" ON "operations"."bom_costing_components" ("bom_costing_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c4739c3a0b69b1d43fe4c256de" ON "operations"."bom_costing_components" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d4939630a5a91c8ca978f74ff0" ON "operations"."bom_costing_history" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_de37e0a012c6b642b8e16e0f54" ON "operations"."bom_costing_history" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c0942bfbc5f7bad9f3420019aa" ON "operations"."bom_costing_history" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5f0d7dfb03d536babf89e8311b" ON "operations"."bom_costing_history" ("bom_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4d39422453f35a4f7a25527c9d" ON "operations"."bom_costing_history" ("bom_costing_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b99f6dbf24ed12baf86ed09f87" ON "operations"."bom_costing_history" ("tenant_id", "costing_date") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_52a1ada4cb961e7b31e6952581" ON "operations"."bom_costing_history" ("bom_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1e20cf02e1bfc0348160598774" ON "operations"."bom_costing_history" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6a679bb89cdfbba1c8f2670b1a" ON "operations"."item_units" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2ee98d42d3c1103a182da5f850" ON "operations"."item_units" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_deeac787929387f1b062cc7b9a" ON "operations"."item_units" ("tenant_id", "item_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_630fea8d284ee921f3196f4aec" ON "operations"."item_units" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_adb884a07d39dde40bdd09f6c6" ON "operations"."item_units" ("item_id", "uom_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7340a71ef4da810b6aead6e148" ON "operations"."stock_ledger" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0def5a8f767d73d98ec7491168" ON "operations"."stock_ledger" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1619422843b286c93af935322f" ON "operations"."stock_ledger" ("tenant_id", "warehouse_id", "document_date") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_920b286d420bc8b3ef75c020b1" ON "operations"."stock_ledger" ("tenant_id", "document_date") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cfe5fce54551b160812115cffa" ON "operations"."stock_ledger" ("tenant_id", "warehouse_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cefc248f2898802104da24d20e" ON "operations"."stock_ledger" ("tenant_id", "item_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c59406f4d54da342b6eb2c6600" ON "operations"."stock_balances" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0a825f5bb4a60f5221899804d5" ON "operations"."stock_balances" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4aabc1a024a9913077b724674b" ON "operations"."stock_balances" ("tenant_id", "warehouse_id", "location_id", "item_id", "uom_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5bd22386c9e906d76c7f1e8d29" ON "operations"."stock_balances" ("tenant_id", "warehouse_id", "location_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9ce45533d071a93c36ce65f84a" ON "operations"."stock_balances" ("tenant_id", "warehouse_id", "item_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5e0e7ab580d7353dbea6d5b00d" ON "operations"."stock_adjustment_items" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_19898f5f1d5e97276e51a4133e" ON "operations"."stock_adjustment_items" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9d968c8f9d27ee95872026ce60" ON "operations"."stock_adjustment_items" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_925deb47adbe2247c55c02d24b" ON "operations"."stock_adjustment_items" ("stock_adjustment_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7bb663d9f768cbdf51f4fc0912" ON "operations"."stock_adjustment_items" ("item_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_83551c77750e9cde53e24a85cf" ON "operations"."stock_adjustment_items" ("batch_number") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6ad6b3a7cbb6069dc23a374867" ON "operations"."stock_adjustment_items" ("item_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_abbd2470221437286638796297" ON "operations"."stock_adjustment_items" ("stock_adjustment_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e3e980ff3d86a0d672680ea0dd" ON "operations"."stock_adjustment_items" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ffcab531cd75f7559af2f20903" ON "operations"."stock_adjustments" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0ebc6e598874ba2aa7783fed01" ON "operations"."stock_adjustments" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f88dacd92b4cc8d5a48a8c1999" ON "operations"."stock_adjustments" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f40054e820f89f9463c35425a6" ON "operations"."stock_adjustments" ("warehouse_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_75fccba2b27c40f428867a9119" ON "operations"."stock_adjustments" ("tenant_id", "warehouse_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5ebd6af2a4838bef6c44f49e18" ON "operations"."stock_adjustments" ("adjustment_date") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0be6ad0f6e90037cfc9a95e756" ON "operations"."stock_adjustments" ("status") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_aff9f11a9dcbc641fd341fb54b" ON "operations"."stock_adjustments" ("warehouse_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_57c6e9424510e7b0de921292a0" ON "operations"."stock_adjustments" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_916ce6241eec605505d3580244" ON "addon_inclusion_rules" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_babd6cfc7a10b1d78001ffb0f4" ON "addon_inclusion_rules" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0ec6c6e5be3deed864f3aa8971" ON "addon_inclusion_rules" ("is_active") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0b05fb462b154b1b0686b8e025" ON "addon_inclusion_rules" ("addonId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_15bf077642bf5a3a0e0e1e9339" ON "addon_inclusion_rules" ("tenantId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a0ba02cd019558f68e1161460f" ON "addons" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_898d2bf7dd322d796eb75cdfbc" ON "addons" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_63787d8fb3e5244dfa7212389a" ON "addons" ("is_active") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bbb79bbc22505f1d89aea91c4b" ON "addons" ("type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0e613feca1d38f47ca5e1d9b9d" ON "addons" ("code") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_48018b3d6da92e13252da5346c" ON "addons" ("tenantId", "code") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dc271d00aa8cf50af97874716f" ON "sales_order_item_addons" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a7d3950e932868b9e95d6dc93b" ON "sales_order_item_addons" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0d99f3ed6ebb95971af126f3df" ON "sales_order_item_addons" ("addonId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_56a805f4aca4e670cb0a7c243c" ON "sales_order_item_addons" ("sales_order_item_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_10d0736c8dcb301305d9b8da5d" ON "sales_order_item_addons" ("tenantId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5c66c07b1976dda4608ff0fdc6" ON "operations"."sales_order_items" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0806b826f0500eedad765a9255" ON "operations"."sales_order_items" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bdab0ead28df1ee5283a111d1a" ON "operations"."sales_order_items" ("sales_order_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_81efa4653ef3647faacf95b7f1" ON "operations"."sales_order_items" ("item_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_85f0c0baeed073d55fd8550206" ON "operations"."sales_order_items" ("item_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4ed083a58389b4fea4f9f14da6" ON "operations"."sales_order_items" ("sales_order_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8912b0505ae8f7b20060e50c45" ON "operations"."sales_orders" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bc903e68bac282f58be98648d2" ON "operations"."sales_orders" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_77e3868b735c09c41f48951170" ON "operations"."sales_orders" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1fb56bee917dfd98ada56d626d" ON "operations"."sales_orders" ("customer_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_07aa6e5fb4df4d3a126927c74c" ON "operations"."sales_orders" ("order_date") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7f7f76481f39b9f9845dfe0c9f" ON "operations"."sales_orders" ("status") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c6fcd419b1bc42ffab4e846ffd" ON "operations"."sales_orders" ("customer_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_664f1c09d2dd63b40cd2f6691f" ON "operations"."sales_orders" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ac7758170a1fe0303cba5562fb" ON "operations"."production_batches" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_98fadd22bb476f4040db43673f" ON "operations"."production_batches" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b04f2799c687cf1c9b33cb3323" ON "operations"."production_batches" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ebaec77c26ef9d6389b8d96067" ON "operations"."production_batches" ("bom_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d959a33345a25e03289ce7ef31" ON "operations"."production_batches" ("batch_no") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f90c965b7ac92bc9c5dc9ec6bf" ON "operations"."production_batches" ("status") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9a07fbf1cc087cfada8a5c17f3" ON "operations"."production_batches" ("bom_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4efdc2e9c72b777dffd21d2d97" ON "operations"."production_batches" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b72dd3bb2971fe6900de23aa56" ON "operations"."production_work_orders" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_394b7eb89ab1db144dfaa1707f" ON "operations"."production_work_orders" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_93ccba94afff324ab62962b91b" ON "operations"."production_work_orders" ("batch_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a6609e7e15ad057974353c2993" ON "operations"."production_work_orders" ("status") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c5af4de8a2131f86230ac4ac9a" ON "operations"."production_work_orders" ("batch_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5249244b38c58105620ce6f88c" ON "operations"."production_consumption" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7962b3c04e3ce2438965691c1a" ON "operations"."production_consumption" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_23d8718a609b7bda30db1e4a0b" ON "operations"."production_consumption" ("batch_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_33edebd1f482fab3704f126881" ON "operations"."production_consumption" ("item_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d81ebd9af9a5469f9446cb1395" ON "operations"."production_consumption" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cfac9490ddc721a7706f44b77f" ON "operations"."production_consumption" ("item_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9ba2f3791875f2d0fe28cf09ed" ON "operations"."production_consumption" ("batch_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1cbd4a56143cc7c1904ca7565f" ON "hris"."employees" ("tenant_id", "manager_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2fbff002423bbdb4f7e1b7627b" ON "hris"."employees" ("tenant_id", "department_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_08cd648e380ffd1e61ca839bb2" ON "hris"."employees" ("tenant_id", "status") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b2d01419353f082b43485aa596" ON "hris"."leave_types" ("tenant_id", "name") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_95a3ee7399200996a2061f9232" ON "hris"."payslips" ("tenant_id", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_31e8c92d6182dc08d6c49be5ad" ON "hris"."payslips" ("tenant_id", "employee_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0184a44de6ba6189ef8edef5fe" ON "hris"."payslips" ("tenant_id", "pay_period_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1e22e7f8cb549651a3bc925a1e" ON "hris"."hris_import_jobs" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0b97f49c5df39b7213fee9b521" ON "hris"."hris_export_jobs" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f7b8ce0d2d24cebaeb903d6cf5" ON "operations"."stock_transfers" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5972704fd20b3436814a2f8c4c" ON "operations"."stock_transfers" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_65e78a521cbef64720491f3a0d" ON "operations"."stock_transfers" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_160d538ff4f574a6d0a6f5db99" ON "operations"."stock_transfers" ("source_warehouse_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bd19b098953a9d374520e8c2ff" ON "operations"."stock_transfers" ("destination_warehouse_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a9a2716bda6c11528b59628a8d" ON "operations"."stock_transfers" ("transfer_date") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2e705df2cd14b76dde831f0cb4" ON "operations"."stock_transfers" ("status") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ffee6ebb57ab93afc8cf7fde51" ON "operations"."stock_transfers" ("destination_warehouse_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0fef9d228cc7f1b69a364349d" ON "operations"."stock_transfers" ("source_warehouse_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_af951718c00f8c28c801f58aed" ON "operations"."stock_transfers" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_config"."service_configurations" ADD CONSTRAINT "FK_c5027261f4fd1dac4d70444d1d9" FOREIGN KEY ("service_type_id") REFERENCES "service_config"."service_types"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_config"."service_configurations" ADD CONSTRAINT "FK_2e29b3f96cef6348a1e7a88168b" FOREIGN KEY ("service_option_id") REFERENCES "service_config"."service_options"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_config"."service_configurations" ADD CONSTRAINT "FK_0cd28f6ef8fbb3bf60c45ed3dc6" FOREIGN KEY ("bom_id") REFERENCES "operations"."boms"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."item_categories" ADD CONSTRAINT "FK_856079bf9836dc5e11c0a2dffd1" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."units_of_measure" ADD CONSTRAINT "FK_85e6be1c939c289e5b6ee3afd04" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."items" ADD CONSTRAINT "FK_d7d027b642add7f0e77c36b874f" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."items" ADD CONSTRAINT "FK_0c4aa809ddf5b0c6ca45d8a8e80" FOREIGN KEY ("category_id") REFERENCES "inventory"."item_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."items" ADD CONSTRAINT "FK_f31029b62065e7047547979d730" FOREIGN KEY ("base_uom_id") REFERENCES "inventory"."units_of_measure"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouse_locations" ADD CONSTRAINT "FK_b4f4eb7faff15be3ff56ff83ebf" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouse_locations" ADD CONSTRAINT "FK_850b86bd98dd7d3647d6466789f" FOREIGN KEY ("warehouse_id") REFERENCES "inventory"."warehouses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouse_locations" ADD CONSTRAINT "FK_a54247986d4680a3bd90dcee008" FOREIGN KEY ("parent_id") REFERENCES "inventory"."warehouse_locations"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouses" ADD CONSTRAINT "FK_09106b8068aeaf74fa33666df8f" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" ADD CONSTRAINT "FK_aa93b5e971211ae164a61e0d650" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" ADD CONSTRAINT "FK_de786974602a16f2a4c07698791" FOREIGN KEY ("bom_id") REFERENCES "operations"."boms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" ADD CONSTRAINT "FK_a92369fdff5ee9817b5710ae297" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" ADD CONSTRAINT "FK_99728f95b76b93f9d3e0620d18f" FOREIGN KEY ("bom_costing_id") REFERENCES "operations"."bom_costings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" ADD CONSTRAINT "FK_aaab59825a34874e36b042ed636" FOREIGN KEY ("component_material_id") REFERENCES "inventory"."materials"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" ADD CONSTRAINT "FK_c0942bfbc5f7bad9f3420019aae" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" ADD CONSTRAINT "FK_5f0d7dfb03d536babf89e8311bd" FOREIGN KEY ("bom_id") REFERENCES "operations"."boms"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" ADD CONSTRAINT "FK_4d39422453f35a4f7a25527c9d8" FOREIGN KEY ("bom_costing_id") REFERENCES "operations"."bom_costings"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."item_units" ADD CONSTRAINT "FK_0b4a90889c05119ca76090734e0" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."item_units" ADD CONSTRAINT "FK_643d371785ec0b773590252ba18" FOREIGN KEY ("item_id") REFERENCES "inventory"."items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."item_units" ADD CONSTRAINT "FK_a70335a7989d3f732a9adc81a99" FOREIGN KEY ("uom_id") REFERENCES "inventory"."units_of_measure"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" ADD CONSTRAINT "FK_09e1c5b6577a7b26f049e981b94" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" ADD CONSTRAINT "FK_70e7bab4395978f9895988ce886" FOREIGN KEY ("warehouse_id") REFERENCES "inventory"."warehouses"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" ADD CONSTRAINT "FK_4fd6ed8d1add3622b224cf93cdf" FOREIGN KEY ("location_id") REFERENCES "inventory"."warehouse_locations"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" ADD CONSTRAINT "FK_d5df8e062a07221b2e96e8d0720" FOREIGN KEY ("item_id") REFERENCES "inventory"."items"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" ADD CONSTRAINT "FK_a3bc3dcab1d83b98f50a42f4a33" FOREIGN KEY ("uom_id") REFERENCES "inventory"."units_of_measure"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_balances" ADD CONSTRAINT "FK_a79262fc08bedb2c6485e6fc0e6" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_balances" ADD CONSTRAINT "FK_ec718dfbbf08afb84b0f665fc0d" FOREIGN KEY ("warehouse_id") REFERENCES "inventory"."warehouses"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_balances" ADD CONSTRAINT "FK_9fd22f1abbab021769c0f77ebec" FOREIGN KEY ("location_id") REFERENCES "inventory"."warehouse_locations"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_balances" ADD CONSTRAINT "FK_3dedc9490997427f90baa397b8b" FOREIGN KEY ("item_id") REFERENCES "inventory"."items"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_balances" ADD CONSTRAINT "FK_e714a365700e0a3fd478f744166" FOREIGN KEY ("uom_id") REFERENCES "inventory"."units_of_measure"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" ADD CONSTRAINT "FK_5b5ea92d40a036030eacbc1b326" FOREIGN KEY ("addon_id") REFERENCES "addons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" ADD CONSTRAINT "FK_9085b4ea0a0cf4626c00fdc3213" FOREIGN KEY ("addon_id") REFERENCES "addons"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" ADD CONSTRAINT "FK_56a805f4aca4e670cb0a7c243cb" FOREIGN KEY ("sales_order_item_id") REFERENCES "operations"."sales_order_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ADD CONSTRAINT "FK_bdab0ead28df1ee5283a111d1af" FOREIGN KEY ("sales_order_id") REFERENCES "operations"."sales_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ADD CONSTRAINT "FK_81efa4653ef3647faacf95b7f16" FOREIGN KEY ("item_id") REFERENCES "inventory"."items"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ADD CONSTRAINT "FK_2fc26f5619ca8e656eec6f36bac" FOREIGN KEY ("unit_of_measure_id") REFERENCES "inventory"."units_of_measure"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ADD CONSTRAINT "FK_3e37bbb0ba48849cdaf87a3b34b" FOREIGN KEY ("service_type_id") REFERENCES "service_config"."service_types"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ADD CONSTRAINT "FK_5048565236338412d59c4c8da8f" FOREIGN KEY ("service_option_id") REFERENCES "service_config"."service_options"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ADD CONSTRAINT "FK_77e3868b735c09c41f489511703" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ADD CONSTRAINT "FK_8834cc8e5fbd4d26a34d2f420e8" FOREIGN KEY ("approved_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ADD CONSTRAINT "FK_95324c7f122f6fc8bcb365a32d2" FOREIGN KEY ("shipped_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ADD CONSTRAINT "FK_38badf68ebb2ff278d3d813cc5d" FOREIGN KEY ("delivered_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_batches" ADD CONSTRAINT "FK_b04f2799c687cf1c9b33cb3323f" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_batches" ADD CONSTRAINT "FK_ebaec77c26ef9d6389b8d960670" FOREIGN KEY ("bom_id") REFERENCES "operations"."boms"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_work_orders" ADD CONSTRAINT "FK_93ccba94afff324ab62962b91b8" FOREIGN KEY ("batch_id") REFERENCES "operations"."production_batches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_consumption" ADD CONSTRAINT "FK_23d8718a609b7bda30db1e4a0bf" FOREIGN KEY ("batch_id") REFERENCES "operations"."production_batches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_consumption" ADD CONSTRAINT "FK_33edebd1f482fab3704f1268810" FOREIGN KEY ("item_id") REFERENCES "inventory"."items"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."payslips" ADD CONSTRAINT "FK_3eed6f447923a5b9a255878879f" FOREIGN KEY ("pay_period_id") REFERENCES "hris"."pay_periods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."payslips" ADD CONSTRAINT "FK_3ca6cde51127cd649278d038ca9" FOREIGN KEY ("employee_id") REFERENCES "hris"."employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."payslips" ADD CONSTRAINT "FK_40956e26bd6c726a7109991745b" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hris"."payslips" DROP CONSTRAINT "FK_40956e26bd6c726a7109991745b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."payslips" DROP CONSTRAINT "FK_3ca6cde51127cd649278d038ca9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."payslips" DROP CONSTRAINT "FK_3eed6f447923a5b9a255878879f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_consumption" DROP CONSTRAINT "FK_33edebd1f482fab3704f1268810"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_consumption" DROP CONSTRAINT "FK_23d8718a609b7bda30db1e4a0bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_work_orders" DROP CONSTRAINT "FK_93ccba94afff324ab62962b91b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_batches" DROP CONSTRAINT "FK_ebaec77c26ef9d6389b8d960670"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_batches" DROP CONSTRAINT "FK_b04f2799c687cf1c9b33cb3323f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" DROP CONSTRAINT "FK_38badf68ebb2ff278d3d813cc5d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" DROP CONSTRAINT "FK_95324c7f122f6fc8bcb365a32d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" DROP CONSTRAINT "FK_8834cc8e5fbd4d26a34d2f420e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" DROP CONSTRAINT "FK_77e3868b735c09c41f489511703"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" DROP CONSTRAINT "FK_5048565236338412d59c4c8da8f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" DROP CONSTRAINT "FK_3e37bbb0ba48849cdaf87a3b34b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" DROP CONSTRAINT "FK_2fc26f5619ca8e656eec6f36bac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" DROP CONSTRAINT "FK_81efa4653ef3647faacf95b7f16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" DROP CONSTRAINT "FK_bdab0ead28df1ee5283a111d1af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" DROP CONSTRAINT "FK_56a805f4aca4e670cb0a7c243cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" DROP CONSTRAINT "FK_9085b4ea0a0cf4626c00fdc3213"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" DROP CONSTRAINT "FK_5b5ea92d40a036030eacbc1b326"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_balances" DROP CONSTRAINT "FK_e714a365700e0a3fd478f744166"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_balances" DROP CONSTRAINT "FK_3dedc9490997427f90baa397b8b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_balances" DROP CONSTRAINT "FK_9fd22f1abbab021769c0f77ebec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_balances" DROP CONSTRAINT "FK_ec718dfbbf08afb84b0f665fc0d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_balances" DROP CONSTRAINT "FK_a79262fc08bedb2c6485e6fc0e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" DROP CONSTRAINT "FK_a3bc3dcab1d83b98f50a42f4a33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" DROP CONSTRAINT "FK_d5df8e062a07221b2e96e8d0720"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" DROP CONSTRAINT "FK_4fd6ed8d1add3622b224cf93cdf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" DROP CONSTRAINT "FK_70e7bab4395978f9895988ce886"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" DROP CONSTRAINT "FK_09e1c5b6577a7b26f049e981b94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."item_units" DROP CONSTRAINT "FK_a70335a7989d3f732a9adc81a99"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."item_units" DROP CONSTRAINT "FK_643d371785ec0b773590252ba18"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."item_units" DROP CONSTRAINT "FK_0b4a90889c05119ca76090734e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" DROP CONSTRAINT "FK_4d39422453f35a4f7a25527c9d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" DROP CONSTRAINT "FK_5f0d7dfb03d536babf89e8311bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" DROP CONSTRAINT "FK_c0942bfbc5f7bad9f3420019aae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" DROP CONSTRAINT "FK_aaab59825a34874e36b042ed636"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" DROP CONSTRAINT "FK_99728f95b76b93f9d3e0620d18f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" DROP CONSTRAINT "FK_a92369fdff5ee9817b5710ae297"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" DROP CONSTRAINT "FK_de786974602a16f2a4c07698791"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" DROP CONSTRAINT "FK_aa93b5e971211ae164a61e0d650"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouses" DROP CONSTRAINT "FK_09106b8068aeaf74fa33666df8f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouse_locations" DROP CONSTRAINT "FK_a54247986d4680a3bd90dcee008"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouse_locations" DROP CONSTRAINT "FK_850b86bd98dd7d3647d6466789f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouse_locations" DROP CONSTRAINT "FK_b4f4eb7faff15be3ff56ff83ebf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."items" DROP CONSTRAINT "FK_f31029b62065e7047547979d730"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."items" DROP CONSTRAINT "FK_0c4aa809ddf5b0c6ca45d8a8e80"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."items" DROP CONSTRAINT "FK_d7d027b642add7f0e77c36b874f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."units_of_measure" DROP CONSTRAINT "FK_85e6be1c939c289e5b6ee3afd04"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."item_categories" DROP CONSTRAINT "FK_856079bf9836dc5e11c0a2dffd1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_config"."service_configurations" DROP CONSTRAINT "FK_0cd28f6ef8fbb3bf60c45ed3dc6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_config"."service_configurations" DROP CONSTRAINT "FK_2e29b3f96cef6348a1e7a88168b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_config"."service_configurations" DROP CONSTRAINT "FK_c5027261f4fd1dac4d70444d1d9"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_af951718c00f8c28c801f58aed"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_f0fef9d228cc7f1b69a364349d"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_ffee6ebb57ab93afc8cf7fde51"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_2e705df2cd14b76dde831f0cb4"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_a9a2716bda6c11528b59628a8d"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_bd19b098953a9d374520e8c2ff"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_160d538ff4f574a6d0a6f5db99"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_65e78a521cbef64720491f3a0d"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_5972704fd20b3436814a2f8c4c"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_f7b8ce0d2d24cebaeb903d6cf5"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_0b97f49c5df39b7213fee9b521"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_1e22e7f8cb549651a3bc925a1e"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_0184a44de6ba6189ef8edef5fe"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_31e8c92d6182dc08d6c49be5ad"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_95a3ee7399200996a2061f9232"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_b2d01419353f082b43485aa596"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_08cd648e380ffd1e61ca839bb2"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_2fbff002423bbdb4f7e1b7627b"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_1cbd4a56143cc7c1904ca7565f"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_9ba2f3791875f2d0fe28cf09ed"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_cfac9490ddc721a7706f44b77f"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_d81ebd9af9a5469f9446cb1395"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_33edebd1f482fab3704f126881"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_23d8718a609b7bda30db1e4a0b"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_7962b3c04e3ce2438965691c1a"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_5249244b38c58105620ce6f88c"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_c5af4de8a2131f86230ac4ac9a"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_a6609e7e15ad057974353c2993"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_93ccba94afff324ab62962b91b"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_394b7eb89ab1db144dfaa1707f"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_b72dd3bb2971fe6900de23aa56"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_4efdc2e9c72b777dffd21d2d97"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_9a07fbf1cc087cfada8a5c17f3"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_f90c965b7ac92bc9c5dc9ec6bf"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_d959a33345a25e03289ce7ef31"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_ebaec77c26ef9d6389b8d96067"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_b04f2799c687cf1c9b33cb3323"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_98fadd22bb476f4040db43673f"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_ac7758170a1fe0303cba5562fb"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_664f1c09d2dd63b40cd2f6691f"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_c6fcd419b1bc42ffab4e846ffd"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_7f7f76481f39b9f9845dfe0c9f"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_07aa6e5fb4df4d3a126927c74c"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_1fb56bee917dfd98ada56d626d"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_77e3868b735c09c41f48951170"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_bc903e68bac282f58be98648d2"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_8912b0505ae8f7b20060e50c45"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_4ed083a58389b4fea4f9f14da6"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_85f0c0baeed073d55fd8550206"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_81efa4653ef3647faacf95b7f1"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_bdab0ead28df1ee5283a111d1a"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_0806b826f0500eedad765a9255"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_5c66c07b1976dda4608ff0fdc6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_10d0736c8dcb301305d9b8da5d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_56a805f4aca4e670cb0a7c243c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0d99f3ed6ebb95971af126f3df"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a7d3950e932868b9e95d6dc93b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dc271d00aa8cf50af97874716f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_48018b3d6da92e13252da5346c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0e613feca1d38f47ca5e1d9b9d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bbb79bbc22505f1d89aea91c4b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_63787d8fb3e5244dfa7212389a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_898d2bf7dd322d796eb75cdfbc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a0ba02cd019558f68e1161460f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_15bf077642bf5a3a0e0e1e9339"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0b05fb462b154b1b0686b8e025"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0ec6c6e5be3deed864f3aa8971"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_babd6cfc7a10b1d78001ffb0f4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_916ce6241eec605505d3580244"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_57c6e9424510e7b0de921292a0"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_aff9f11a9dcbc641fd341fb54b"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_0be6ad0f6e90037cfc9a95e756"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_5ebd6af2a4838bef6c44f49e18"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_75fccba2b27c40f428867a9119"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_f40054e820f89f9463c35425a6"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_f88dacd92b4cc8d5a48a8c1999"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_0ebc6e598874ba2aa7783fed01"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_ffcab531cd75f7559af2f20903"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_e3e980ff3d86a0d672680ea0dd"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_abbd2470221437286638796297"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_6ad6b3a7cbb6069dc23a374867"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_83551c77750e9cde53e24a85cf"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_7bb663d9f768cbdf51f4fc0912"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_925deb47adbe2247c55c02d24b"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_9d968c8f9d27ee95872026ce60"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_19898f5f1d5e97276e51a4133e"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_5e0e7ab580d7353dbea6d5b00d"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_9ce45533d071a93c36ce65f84a"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_5bd22386c9e906d76c7f1e8d29"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_4aabc1a024a9913077b724674b"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_0a825f5bb4a60f5221899804d5"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_c59406f4d54da342b6eb2c6600"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_cefc248f2898802104da24d20e"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_cfe5fce54551b160812115cffa"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_920b286d420bc8b3ef75c020b1"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_1619422843b286c93af935322f"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_0def5a8f767d73d98ec7491168"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_7340a71ef4da810b6aead6e148"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_adb884a07d39dde40bdd09f6c6"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_630fea8d284ee921f3196f4aec"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_deeac787929387f1b062cc7b9a"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_2ee98d42d3c1103a182da5f850"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_6a679bb89cdfbba1c8f2670b1a"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_1e20cf02e1bfc0348160598774"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_52a1ada4cb961e7b31e6952581"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_b99f6dbf24ed12baf86ed09f87"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_4d39422453f35a4f7a25527c9d"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_5f0d7dfb03d536babf89e8311b"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_c0942bfbc5f7bad9f3420019aa"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_de37e0a012c6b642b8e16e0f54"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_d4939630a5a91c8ca978f74ff0"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_c4739c3a0b69b1d43fe4c256de"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_9cc3225ca64436ce75532ca969"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_5f535c182f3c40aa5b6002c211"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_aaab59825a34874e36b042ed63"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_99728f95b76b93f9d3e0620d18"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_a92369fdff5ee9817b5710ae29"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_50da63915296f5cc994865a192"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_0a58869b7519d23594a7ee718d"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_198da8b72090339e1dad671b48"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_21d8146355e8027297d60d0d92"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_aa362ef95a82651776f9e71874"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_a72669143115115187dbe4af5f"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_de786974602a16f2a4c0769879"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_aa93b5e971211ae164a61e0d65"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_0bfe4beea50e94ace8c6ec25cf"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_914c74963ec0ad6ff689e0355c"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_f0721373cb4cbd452c16aed3b0"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_539e63f0d9fadf561bca4de13d"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_d458d3ad7d187ba7e4d4139cd6"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_d066c1135d4623a115c3996b7b"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_417c0987f9a97c8810a41609fe"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_bbed7c73e82507820c45d0f74f"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_aaeda3c25476c756fce76fbc6d"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_d8235b485bd2694707257f7432"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_a7447b3c6c0f84185b14ffaff0"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_02c9c7f4f86c3628ba6ec2e02b"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_25a958155bb9a9d741210749e0"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_4326f7aa6691d4cafbb224a0ca"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_5e444db68b0195d4bb9ca87680"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_ef552f22175a720d41feff4304"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_41635e17371ae549c9613a8a7e"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_d70752545799d3765b8410a519"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_91db5b2678d1a5f10532917187"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_614d10949717c3b71f77449ec3"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_f2a4c2797fc44e6f6e749b5539"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_24a85a5dc53bdd2f63393162cd"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_976e94ac7ff52e9865ecab78e1"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_9f9053ca0fc56da9517e17c942"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_75aea322fc65c99f97d20c208e"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_5cba72118c885bcdaa0fb39efa"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_c7bc2589bd1fe4671b64d3a307"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_6bbf0b8664e146bfd40c81c0df"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_fd5629216a74058d56891ce73d"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_65b97def8b4b8818588df35108"`,
    );
    await queryRunner.query(
      `DROP INDEX "inventory"."IDX_1d477ea1e1e386bd06d08b839a"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_4ee7cba1a9f258b347198ef239"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_465835f1e33cbaf3106cea8ac7"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_0e20d891bc0bf2561e933f61d2"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_2b9e1d27ae9f5ad754475a278d"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_04060d1bb05702fd4863898682"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_298bb64117e3c2c5b1f431e6ef"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_fb99027007816c3075dd92e325"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_0da7d39769a1e4a208e0b8f83e"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_6ca2f850e608f68d8d5003efea"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_c4fd2870fe6fda89e519cf48a2"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_be76f68bf56d8759c05fb0dd03"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_256538da4eef8cfa85ff0c7c85"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_5dc73ade5cd26a4d353ce2662f"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_4de40ca44f094976782466fc20"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_8e2e6dbaf5efc52f7daa729c2a"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_b2bf7aa6e088a184f422c58025"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_3b515861a3b646576bfee7a9fa"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_c3a664d20f12bda1265b22995c"`,
    );
    await queryRunner.query(
      `DROP INDEX "service_config"."IDX_12c4a270427ba0a6ae6a09fdb1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfers" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfers" ALTER COLUMN "updated_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfers" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_export_jobs" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_export_jobs" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_export_jobs" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_export_jobs" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `CREATE TYPE "hris"."hris_job_status_enum_old" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_export_jobs" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_export_jobs" ALTER COLUMN "status" TYPE "hris"."hris_job_status_enum_old" USING "status"::"text"::"hris"."hris_job_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_export_jobs" ALTER COLUMN "status" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(`DROP TYPE "hris"."hris_export_jobs_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "hris"."hris_job_status_enum_old" RENAME TO "hris_job_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_import_jobs" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_import_jobs" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_import_jobs" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_import_jobs" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `CREATE TYPE "hris"."hris_job_status_enum_old" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_import_jobs" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_import_jobs" ALTER COLUMN "status" TYPE "hris"."hris_job_status_enum_old" USING "status"::"text"::"hris"."hris_job_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."hris_import_jobs" ALTER COLUMN "status" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(`DROP TYPE "hris"."hris_import_jobs_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "hris"."hris_job_status_enum_old" RENAME TO "hris_job_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."payslips" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."payslips" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."employee_compensations" ALTER COLUMN "overtime_rate" SET DEFAULT 1.5`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_consumption" ALTER COLUMN "waste_quantity" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_consumption" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_consumption" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_consumption" ALTER COLUMN "created_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_work_orders" ALTER COLUMN "status" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "operations"."production_status_old" AS ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_work_orders" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_work_orders" ALTER COLUMN "status" TYPE "operations"."production_status_old" USING "status"::"text"::"operations"."production_status_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_work_orders" ALTER COLUMN "status" SET DEFAULT 'PLANNED'`,
    );
    await queryRunner.query(
      `DROP TYPE "operations"."production_work_orders_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "operations"."production_status_old" RENAME TO "production_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_work_orders" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_work_orders" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_work_orders" ALTER COLUMN "created_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_batches" ALTER COLUMN "status" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "operations"."production_status_old" AS ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_batches" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_batches" ALTER COLUMN "status" TYPE "operations"."production_status_old" USING "status"::"text"::"operations"."production_status_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_batches" ALTER COLUMN "status" SET DEFAULT 'PLANNED'`,
    );
    await queryRunner.query(
      `DROP TYPE "operations"."production_batches_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "operations"."production_status_old" RENAME TO "production_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_batches" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_batches" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."production_batches" ALTER COLUMN "created_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "final_amount" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "tax_amount" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "discount_amount" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "total_amount" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "status" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "operations"."sales_order_status_old" AS ENUM('DRAFT', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "status" TYPE "operations"."sales_order_status_old" USING "status"::"text"::"operations"."sales_order_status_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(
      `DROP TYPE "operations"."sales_orders_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "operations"."sales_order_status_old" RENAME TO "sales_order_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" ALTER COLUMN "created_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ALTER COLUMN "allocated_quantity" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ALTER COLUMN "delivered_quantity" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ALTER COLUMN "tax_amount" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ALTER COLUMN "tax_percent" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ALTER COLUMN "discount_amount" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ALTER COLUMN "discount_percent" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ALTER COLUMN "created_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" ALTER COLUMN "addon_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" ALTER COLUMN "quantity" SET DEFAULT 1.000000`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" ALTER COLUMN "updated_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" ALTER COLUMN "updated_by" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" ALTER COLUMN "created_by" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "addons" ALTER COLUMN "updated_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "addons" ALTER COLUMN "updated_by" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "addons" ALTER COLUMN "created_by" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" ALTER COLUMN "addon_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" ALTER COLUMN "updated_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" ALTER COLUMN "updated_by" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" ALTER COLUMN "created_by" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustments" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustments" ALTER COLUMN "updated_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustments" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustment_items" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustment_items" ALTER COLUMN "updated_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustment_items" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_balances" ALTER COLUMN "updated_at" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" ALTER COLUMN "document_date" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `CREATE TYPE "operations"."stock_movement_type_old" AS ENUM('RECEIPT', 'ISSUE', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" ALTER COLUMN "movement_type" TYPE "operations"."stock_movement_type_old" USING "movement_type"::"text"::"operations"."stock_movement_type_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "operations"."stock_ledger_movement_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "operations"."stock_movement_type_old" RENAME TO "stock_movement_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" ALTER COLUMN "updated_at" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."item_units" ALTER COLUMN "updated_at" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" ALTER COLUMN "changed_by_user_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" DROP COLUMN "change_reason"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" ADD "change_reason" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" DROP COLUMN "costing_method"`,
    );
    await queryRunner.query(
      `DROP TYPE "operations"."bom_costing_history_costing_method_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" ADD "costing_method" character varying(30) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" ALTER COLUMN "bom_costing_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" ALTER COLUMN "updated_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" DROP COLUMN "cost_component_type"`,
    );
    await queryRunner.query(
      `DROP TYPE "operations"."bom_costing_components_cost_component_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" ADD "cost_component_type" character varying(30) NOT NULL DEFAULT 'MATERIAL'`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" ALTER COLUMN "updated_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" ALTER COLUMN "costing_date" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" DROP COLUMN "costing_method"`,
    );
    await queryRunner.query(
      `DROP TYPE "operations"."bom_costings_costing_method_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" ADD "costing_method" character varying(30) NOT NULL DEFAULT 'STANDARD'`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" ALTER COLUMN "updated_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouses" ALTER COLUMN "updated_at" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouse_locations" ALTER COLUMN "updated_at" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."items" ALTER COLUMN "updated_at" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."units_of_measure" ALTER COLUMN "updated_at" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."item_categories" ALTER COLUMN "updated_at" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfer_items" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfer_items" ALTER COLUMN "updated_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfer_items" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."materials" DROP COLUMN "material_type"`,
    );
    await queryRunner.query(
      `DROP TYPE "inventory"."materials_material_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."materials" ADD "material_type" operations.materials_material_type_enum`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1d477ea1e1e386bd06d08b839a" ON "inventory"."materials" ("material_type", "tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_config"."service_configurations" ALTER COLUMN "price" SET DEFAULT 0.00`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" DROP COLUMN "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" ADD "name" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."job_execution_logs" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" DROP COLUMN "unitPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" DROP COLUMN "addonId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" DROP COLUMN "deleted_by"`,
    );
    await queryRunner.query(`ALTER TABLE "addons" DROP COLUMN "materialId"`);
    await queryRunner.query(`ALTER TABLE "addons" DROP COLUMN "basePrice"`);
    await queryRunner.query(`ALTER TABLE "addons" DROP COLUMN "tenantId"`);
    await queryRunner.query(`ALTER TABLE "addons" DROP COLUMN "deleted_by"`);
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" DROP COLUMN "discountPercent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" DROP COLUMN "thresholdValue"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" DROP COLUMN "ruleType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" DROP COLUMN "addonId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" DROP COLUMN "deleted_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" ADD "unit_price" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" ADD "tenant_id" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "addons" ADD "material_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "addons" ADD "base_price" numeric(10,2) NOT NULL DEFAULT 0.00`,
    );
    await queryRunner.query(
      `ALTER TABLE "addons" ADD "tenant_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" ADD "discount_percent" numeric(5,2) NOT NULL DEFAULT 100.00`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" ADD "threshold_value" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" ADD "rule_type" character varying(20) NOT NULL DEFAULT 'MIN_QTY'`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" ADD "tenant_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" ADD "previousvalues" jsonb`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_1f708e92c414c1cd336421283b"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_29ed07014aa79ff5582ab50c7e"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_420684d03ba26f2f6aa65bbf2d"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_e11c485ca7523661c11abf05c9"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_3685ff15a03f6c2a0476baa92b"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_a2c3b7e425129a2ba06d36434f"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_b42bc1d3353cbb33c4d6540710"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_1fc02b9087305469a4059daa79"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_f628b73b36197928dd4b1b7bff"`,
    );
    await queryRunner.query(`DROP TABLE "operations"."goods_issuances"`);
    await queryRunner.query(
      `DROP TYPE "operations"."goods_issuances_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "operations"."goods_issuances_reference_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "operations"."goods_issuances_issuance_type_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_dd590f71e3c7e9d1e10743b18b"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_024ce39439c968e68669ebda7b"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_530406662f8b68d7b9d7e7a962"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_0211a28397496375d44bc458ad"`,
    );
    await queryRunner.query(`DROP TABLE "operations"."goods_issuance_items"`);
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_1f700b4284c0aeb3dea8b289e1"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_85cf4c20aa82287f7435974383"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_536cbd78047fc1325d999b85f9"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_eb2eca7ca7be2bf6cb4e9ff6ae"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_8e43e8f319de3fe052f8e2f605"`,
    );
    await queryRunner.query(`DROP TABLE "operations"."goods_receipts"`);
    await queryRunner.query(
      `DROP TYPE "operations"."goods_receipts_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "operations"."goods_receipts_receipt_type_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_70eee06015fd0dd630eed4a6b8"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_18cc8be3690442e0be958c2d89"`,
    );
    await queryRunner.query(`DROP TABLE "operations"."goods_receipt_items"`);
    await queryRunner.query(
      `ALTER TABLE "addons" ADD CONSTRAINT "UQ_addons_tenant_code" UNIQUE ("tenant_id", "code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."item_units" ADD CONSTRAINT "UQ_item_units_item_uom" UNIQUE ("item_id", "uom_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouses" ADD CONSTRAINT "UQ_warehouses_tenant_code" UNIQUE ("tenant_id", "code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouse_locations" ADD CONSTRAINT "UQ_locations_wh_code" UNIQUE ("warehouse_id", "code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."items" ADD CONSTRAINT "UQ_items_tenant_code" UNIQUE ("tenant_id", "code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."units_of_measure" ADD CONSTRAINT "UQ_units_of_measure_tenant_code" UNIQUE ("tenant_id", "code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."item_categories" ADD CONSTRAINT "UQ_item_categories_tenant_code" UNIQUE ("tenant_id", "code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" ADD CONSTRAINT "UQ_boms_tenant_material_version" UNIQUE ("tenant_id", "parent_material_id", "version")`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" ADD CONSTRAINT "UQ_permissions_module_action_resource" UNIQUE ("module", "resource", "action")`,
    );
    await queryRunner.query(
      `ALTER TABLE "addons" ADD CONSTRAINT "CHK_addons_type" CHECK (((type)::text = ANY ((ARRAY['PHYSICAL'::character varying, 'SERVICE'::character varying])::text[])))`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" ADD CONSTRAINT "CHK_addon_rules_type" CHECK (((rule_type)::text = 'MIN_QTY'::text))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_transfers_date" ON "operations"."stock_transfers" ("transfer_date") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_transfers_status" ON "operations"."stock_transfers" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_transfers_dest_warehouse" ON "operations"."stock_transfers" ("destination_warehouse_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_transfers_source_warehouse" ON "operations"."stock_transfers" ("source_warehouse_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_transfers_tenant_id" ON "operations"."stock_transfers" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_hris_export_jobs_tenant" ON "hris"."hris_export_jobs" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_hris_import_jobs_tenant" ON "hris"."hris_import_jobs" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_hris_payslip_tenant_status" ON "hris"."payslips" ("status", "tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_hris_payslip_tenant_employee" ON "hris"."payslips" ("employee_id", "tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_hris_payslip_tenant_pay_period" ON "hris"."payslips" ("pay_period_id", "tenant_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_payslips_tenant_period_employee" ON "hris"."payslips" ("employee_id", "pay_period_id", "tenant_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_hris_leave_type_tenant_name" ON "hris"."leave_types" ("name", "tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_hris_employee_tenant_manager" ON "hris"."employees" ("manager_id", "tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_hris_employee_tenant_department" ON "hris"."employees" ("department_id", "tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_hris_employee_tenant_status" ON "hris"."employees" ("status", "tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_production_consumption_item_id" ON "operations"."production_consumption" ("item_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_production_consumption_batch_id" ON "operations"."production_consumption" ("batch_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_production_work_orders_status" ON "operations"."production_work_orders" ("status") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_production_work_orders_batch_id" ON "operations"."production_work_orders" ("batch_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_production_batches_bom_id" ON "operations"."production_batches" ("bom_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_production_batches_tenant_id" ON "operations"."production_batches" ("tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_production_batches_batch_no" ON "operations"."production_batches" ("batch_no") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_production_batches_status" ON "operations"."production_batches" ("status") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_sales_orders_created_by" ON "operations"."sales_orders" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_sales_orders_order_no" ON "operations"."sales_orders" ("order_no") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_sales_orders_order_date" ON "operations"."sales_orders" ("order_date") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_sales_orders_status" ON "operations"."sales_orders" ("status") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_sales_orders_customer_id" ON "operations"."sales_orders" ("customer_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_sales_orders_tenant_id" ON "operations"."sales_orders" ("tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_sales_order_items_created_by" ON "operations"."sales_order_items" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_sales_order_items_item_id" ON "operations"."sales_order_items" ("item_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_sales_order_items_sales_order_id" ON "operations"."sales_order_items" ("sales_order_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_sales_order_items_service_option_id" ON "operations"."sales_order_items" ("service_option_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_sales_order_items_service_type_id" ON "operations"."sales_order_items" ("service_type_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_sales_order_item_addons_addon_id" ON "sales_order_item_addons" ("addon_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_sales_order_item_addons_sales_order_item_id" ON "sales_order_item_addons" ("sales_order_item_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_sales_order_item_addons_tenant_id" ON "sales_order_item_addons" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_addons_is_active" ON "addons" ("is_active") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_addons_type" ON "addons" ("type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_addons_code" ON "addons" ("code") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_addons_tenant_id" ON "addons" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_addon_inclusion_rules_is_active" ON "addon_inclusion_rules" ("is_active") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_addon_inclusion_rules_addon_id" ON "addon_inclusion_rules" ("addon_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_addon_inclusion_rules_tenant_id" ON "addon_inclusion_rules" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_adjustments_tenant_warehouse" ON "operations"."stock_adjustments" ("tenant_id", "warehouse_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_adjustments_date" ON "operations"."stock_adjustments" ("adjustment_date") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_adjustments_status" ON "operations"."stock_adjustments" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_adjustments_warehouse_id" ON "operations"."stock_adjustments" ("warehouse_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_adjustments_tenant_id" ON "operations"."stock_adjustments" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_adj_items_batch" ON "operations"."stock_adjustment_items" ("batch_number") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_adj_items_item_id" ON "operations"."stock_adjustment_items" ("item_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_adj_items_adjustment_id" ON "operations"."stock_adjustment_items" ("stock_adjustment_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_balance_scope_lookup" ON "operations"."stock_balances" ("item_id", "location_id", "tenant_id", "uom_id", "warehouse_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_balance_tenant_wh_loc" ON "operations"."stock_balances" ("location_id", "tenant_id", "warehouse_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_stock_balance_scope" ON "operations"."stock_balances" ("item_id", "tenant_id", "uom_id", "warehouse_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_ledger_tenant_wh_doc" ON "operations"."stock_ledger" ("document_date", "tenant_id", "warehouse_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_ledger_document_date" ON "operations"."stock_ledger" ("document_date") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_ledger_tenant_wh" ON "operations"."stock_ledger" ("tenant_id", "warehouse_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_ledger_tenant_item" ON "operations"."stock_ledger" ("item_id", "tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_item_units_tenant_item" ON "operations"."item_units" ("item_id", "tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_item_units_tenant" ON "operations"."item_units" ("tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_item_units_item" ON "operations"."item_units" ("item_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_bom_costing_history_bom" ON "operations"."bom_costing_history" ("bom_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_bom_costing_history_tenant" ON "operations"."bom_costing_history" ("tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_bom_costing_history_costing" ON "operations"."bom_costing_history" ("bom_costing_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_bom_costing_components_tenant" ON "operations"."bom_costing_components" ("tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_bom_costing_components_material" ON "operations"."bom_costing_components" ("component_material_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_bom_costing_components_costing" ON "operations"."bom_costing_components" ("bom_costing_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_bom_costings_tenant_date" ON "operations"."bom_costings" ("costing_date", "tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_bom_costings_tenant_bom" ON "operations"."bom_costings" ("bom_id", "tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_bom_costings_bom" ON "operations"."bom_costings" ("bom_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_bom_costings_tenant" ON "operations"."bom_costings" ("tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bom_items_sort_order" ON "operations"."bom_items" ("bom_id", "sort_order") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bom_items_component" ON "operations"."bom_items" ("component_material_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bom_items_bom" ON "operations"."bom_items" ("bom_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bom_items_bom_component" ON "operations"."bom_items" ("bom_id", "component_material_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_warehouses_tenant" ON "inventory"."warehouses" ("tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_locations_path" ON "inventory"."warehouse_locations" ("path") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_locations_tenant" ON "inventory"."warehouse_locations" ("tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_items_category" ON "inventory"."items" ("category_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_items_tenant" ON "inventory"."items" ("tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_units_of_measure_tenant" ON "inventory"."units_of_measure" ("tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_item_categories_tenant" ON "inventory"."item_categories" ("tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_transfer_items_batch" ON "operations"."stock_transfer_items" ("batch_number") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_transfer_items_item_id" ON "operations"."stock_transfer_items" ("item_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_transfer_items_transfer_id" ON "operations"."stock_transfer_items" ("stock_transfer_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_materials_tenant_id_is_active" ON "inventory"."materials" ("is_active", "tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_materials_tenant_id_material_group" ON "inventory"."materials" ("material_group", "tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_materials_tenant_id_material_type" ON "inventory"."materials" ("material_type", "tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_materials_tenant_id" ON "inventory"."materials" ("tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "inventory_materials_sku_key" ON "inventory"."materials" ("sku") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_service_conditions_tenant_code" ON "service_config"."service_conditions" ("code", "tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_service_conditions_tenant" ON "service_config"."service_conditions" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_service_types_tenant_code" ON "service_config"."service_types" ("code", "tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_service_types_tenant" ON "service_config"."service_types" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_service_configurations_lookup" ON "service_config"."service_configurations" ("condition_key", "condition_value", "service_option_id", "service_type_id", "tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_service_configurations_bom" ON "service_config"."service_configurations" ("bom_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_service_configurations_service_option" ON "service_config"."service_configurations" ("service_option_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_service_configurations_service_type" ON "service_config"."service_configurations" ("service_type_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_service_configurations_tenant" ON "service_config"."service_configurations" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_boms_material_version" ON "operations"."boms" ("parent_material_id", "version") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_boms_tenant_status" ON "operations"."boms" ("status", "tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_boms_tenant_parent" ON "operations"."boms" ("parent_material_id", "tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_boms_parent_material" ON "operations"."boms" ("parent_material_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_boms_tenant" ON "operations"."boms" ("tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_service_options_tenant_code" ON "service_config"."service_options" ("code", "tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_service_options_tenant" ON "service_config"."service_options" ("tenant_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfers" ADD CONSTRAINT "FK_68f64445b6b21e94fb9964eebaf" FOREIGN KEY ("deleted_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfers" ADD CONSTRAINT "FK_90421bfbb4ed38bd740be7c03c1" FOREIGN KEY ("updated_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfers" ADD CONSTRAINT "FK_f7b8ce0d2d24cebaeb903d6cf5f" FOREIGN KEY ("created_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."payslips" ADD CONSTRAINT "FK_3ca6cde51127cd649278d038ca9" FOREIGN KEY ("employee_id") REFERENCES "hris"."employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."payslips" ADD CONSTRAINT "FK_3eed6f447923a5b9a255878879f" FOREIGN KEY ("pay_period_id") REFERENCES "hris"."pay_periods"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."payslips" ADD CONSTRAINT "FK_40956e26bd6c726a7109991745b" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ADD CONSTRAINT "FK_sales_order_items_service_option" FOREIGN KEY ("service_option_id") REFERENCES "service_config"."service_options"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" ADD CONSTRAINT "FK_sales_order_items_service_type" FOREIGN KEY ("service_type_id") REFERENCES "service_config"."service_types"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" ADD CONSTRAINT "FK_sales_order_item_addons_addon_id" FOREIGN KEY ("addon_id") REFERENCES "addons"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_order_item_addons" ADD CONSTRAINT "FK_sales_order_item_addons_sales_order_item_id" FOREIGN KEY ("sales_order_item_id") REFERENCES "operations"."sales_order_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "addons" ADD CONSTRAINT "FK_addons_material_id" FOREIGN KEY ("material_id") REFERENCES "inventory"."materials"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "addon_inclusion_rules" ADD CONSTRAINT "FK_addon_inclusion_rules_addon_id" FOREIGN KEY ("addon_id") REFERENCES "addons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustments" ADD CONSTRAINT "FK_47a0d77bb1e6422ffb50967a37e" FOREIGN KEY ("deleted_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustments" ADD CONSTRAINT "FK_7d4c66394f3e18da59ea4ffacf6" FOREIGN KEY ("updated_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustments" ADD CONSTRAINT "FK_ffcab531cd75f7559af2f209038" FOREIGN KEY ("created_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustment_items" ADD CONSTRAINT "FK_8652db11ecddc664555b04320f1" FOREIGN KEY ("deleted_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustment_items" ADD CONSTRAINT "FK_08639ba664eb716bc243fff516a" FOREIGN KEY ("updated_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_adjustment_items" ADD CONSTRAINT "FK_5e0e7ab580d7353dbea6d5b00dd" FOREIGN KEY ("created_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_balances" ADD CONSTRAINT "FK_stock_balance_uom" FOREIGN KEY ("uom_id") REFERENCES "inventory"."units_of_measure"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_balances" ADD CONSTRAINT "FK_stock_balance_item" FOREIGN KEY ("item_id") REFERENCES "inventory"."items"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_balances" ADD CONSTRAINT "FK_stock_balance_location" FOREIGN KEY ("location_id") REFERENCES "inventory"."warehouse_locations"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_balances" ADD CONSTRAINT "FK_stock_balance_warehouse" FOREIGN KEY ("warehouse_id") REFERENCES "inventory"."warehouses"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" ADD CONSTRAINT "FK_stock_ledger_uom" FOREIGN KEY ("uom_id") REFERENCES "inventory"."units_of_measure"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" ADD CONSTRAINT "FK_stock_ledger_item" FOREIGN KEY ("item_id") REFERENCES "inventory"."items"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" ADD CONSTRAINT "FK_stock_ledger_location" FOREIGN KEY ("location_id") REFERENCES "inventory"."warehouse_locations"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_ledger" ADD CONSTRAINT "FK_stock_ledger_warehouse" FOREIGN KEY ("warehouse_id") REFERENCES "inventory"."warehouses"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."item_units" ADD CONSTRAINT "FK_item_units_uom" FOREIGN KEY ("uom_id") REFERENCES "inventory"."units_of_measure"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."item_units" ADD CONSTRAINT "FK_item_units_item" FOREIGN KEY ("item_id") REFERENCES "inventory"."items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" ADD CONSTRAINT "fk_bom_costing_history_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" ADD CONSTRAINT "fk_bom_costing_history_updated_by" FOREIGN KEY ("updated_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" ADD CONSTRAINT "fk_bom_costing_history_created_by" FOREIGN KEY ("created_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" ADD CONSTRAINT "fk_bom_costing_history_user" FOREIGN KEY ("changed_by_user_id") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" ADD CONSTRAINT "fk_bom_costing_history_costing" FOREIGN KEY ("bom_costing_id") REFERENCES "operations"."bom_costings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" ADD CONSTRAINT "fk_bom_costing_history_bom" FOREIGN KEY ("bom_id") REFERENCES "operations"."boms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_history" ADD CONSTRAINT "fk_bom_costing_history_tenant" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" ADD CONSTRAINT "fk_bom_costing_components_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" ADD CONSTRAINT "fk_bom_costing_components_updated_by" FOREIGN KEY ("updated_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" ADD CONSTRAINT "fk_bom_costing_components_created_by" FOREIGN KEY ("created_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" ADD CONSTRAINT "fk_bom_costing_components_material" FOREIGN KEY ("component_material_id") REFERENCES "inventory"."materials"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" ADD CONSTRAINT "fk_bom_costing_components_costing" FOREIGN KEY ("bom_costing_id") REFERENCES "operations"."bom_costings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costing_components" ADD CONSTRAINT "fk_bom_costing_components_tenant" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" ADD CONSTRAINT "fk_bom_costings_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" ADD CONSTRAINT "fk_bom_costings_updated_by" FOREIGN KEY ("updated_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" ADD CONSTRAINT "fk_bom_costings_created_by" FOREIGN KEY ("created_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" ADD CONSTRAINT "fk_bom_costings_bom" FOREIGN KEY ("bom_id") REFERENCES "operations"."boms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_costings" ADD CONSTRAINT "fk_bom_costings_tenant" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_items" ADD CONSTRAINT "FK_bom_items_component_material" FOREIGN KEY ("component_material_id") REFERENCES "inventory"."materials"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_items" ADD CONSTRAINT "FK_bom_items_bom" FOREIGN KEY ("bom_id") REFERENCES "operations"."boms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouse_locations" ADD CONSTRAINT "FK_locations_warehouse" FOREIGN KEY ("warehouse_id") REFERENCES "inventory"."warehouses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouse_locations" ADD CONSTRAINT "FK_locations_parent" FOREIGN KEY ("parent_id") REFERENCES "inventory"."warehouse_locations"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."items" ADD CONSTRAINT "FK_items_category" FOREIGN KEY ("category_id") REFERENCES "inventory"."item_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."items" ADD CONSTRAINT "FK_items_base_uom" FOREIGN KEY ("base_uom_id") REFERENCES "inventory"."units_of_measure"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfer_items" ADD CONSTRAINT "FK_b33fcfec16f9f23a37ba4277bc5" FOREIGN KEY ("deleted_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfer_items" ADD CONSTRAINT "FK_d96a54ec2527ba6eb25a172b177" FOREIGN KEY ("updated_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."stock_transfer_items" ADD CONSTRAINT "FK_65b97def8b4b8818588df351085" FOREIGN KEY ("created_by") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_config"."service_configurations" ADD CONSTRAINT "FK_service_configurations_bom" FOREIGN KEY ("bom_id") REFERENCES "operations"."boms"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_config"."service_configurations" ADD CONSTRAINT "FK_service_configurations_service_option" FOREIGN KEY ("service_option_id") REFERENCES "service_config"."service_options"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_config"."service_configurations" ADD CONSTRAINT "FK_service_configurations_service_type" FOREIGN KEY ("service_type_id") REFERENCES "service_config"."service_types"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" ADD CONSTRAINT "FK_boms_parent_material" FOREIGN KEY ("parent_material_id") REFERENCES "inventory"."materials"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" ADD CONSTRAINT "FK_boms_tenant" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }
}
