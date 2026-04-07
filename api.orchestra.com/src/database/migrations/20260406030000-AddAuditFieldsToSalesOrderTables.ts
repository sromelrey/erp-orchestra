import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuditFieldsToSalesOrderTables20260406030000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add audit fields to sales_orders table
    await queryRunner.query(`
      ALTER TABLE "operations"."sales_orders"
      ADD COLUMN "created_by" integer;
    `);

    await queryRunner.query(`
      ALTER TABLE "operations"."sales_orders"
      ADD COLUMN "updated_by" integer;
    `);

    await queryRunner.query(`
      ALTER TABLE "operations"."sales_orders"
      ADD COLUMN "deleted_by" integer;
    `);

    // Add audit fields to sales_order_items table
    await queryRunner.query(`
      ALTER TABLE "operations"."sales_order_items"
      ADD COLUMN "created_by" integer;
    `);

    await queryRunner.query(`
      ALTER TABLE "operations"."sales_order_items"
      ADD COLUMN "updated_by" integer;
    `);

    await queryRunner.query(`
      ALTER TABLE "operations"."sales_order_items"
      ADD COLUMN "deleted_by" integer;
    `);

    // Add indexes for audit fields
    await queryRunner.query(`
      CREATE INDEX "idx_sales_orders_created_by" ON "operations"."sales_orders" ("created_by");
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_sales_order_items_created_by" ON "operations"."sales_order_items" ("created_by");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`
      DROP INDEX IF EXISTS "idx_sales_order_items_created_by";
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "idx_sales_orders_created_by";
    `);

    // Drop audit fields from sales_order_items table
    await queryRunner.query(`
      ALTER TABLE "operations"."sales_order_items"
      DROP COLUMN "deleted_by";
    `);

    await queryRunner.query(`
      ALTER TABLE "operations"."sales_order_items"
      DROP COLUMN "updated_by";
    `);

    await queryRunner.query(`
      ALTER TABLE "operations"."sales_order_items"
      DROP COLUMN "created_by";
    `);

    // Drop audit fields from sales_orders table
    await queryRunner.query(`
      ALTER TABLE "operations"."sales_orders"
      DROP COLUMN "deleted_by";
    `);

    await queryRunner.query(`
      ALTER TABLE "operations"."sales_orders"
      DROP COLUMN "updated_by";
    `);

    await queryRunner.query(`
      ALTER TABLE "operations"."sales_orders"
      DROP COLUMN "created_by";
    `);
  }
}
