import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInventoryIndexes20260316170900 implements MigrationInterface {
  name = 'AddInventoryIndexes20260316170900';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_item_units_tenant" ON "operations"."item_units" ("tenant_id") WHERE deleted_at IS NULL`,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_item_units_tenant_item" ON "operations"."item_units" ("tenant_id", "item_id") WHERE deleted_at IS NULL`,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_stock_balance_tenant_wh_loc" ON "operations"."stock_balances" ("tenant_id", "warehouse_id", "location_id") WHERE deleted_at IS NULL`,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_stock_balance_scope_lookup" ON "operations"."stock_balances" ("tenant_id", "warehouse_id", "location_id", "item_id", "uom_id") WHERE deleted_at IS NULL`,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_stock_ledger_tenant_wh_doc" ON "operations"."stock_ledger" ("tenant_id", "warehouse_id", "document_date") WHERE deleted_at IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_stock_ledger_tenant_wh_doc"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_stock_balance_scope_lookup"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_stock_balance_tenant_wh_loc"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_item_units_tenant_item"`,
    );

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_item_units_tenant"`);
  }
}
