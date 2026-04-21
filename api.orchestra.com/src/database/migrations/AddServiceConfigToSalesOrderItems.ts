import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddServiceConfigToSalesOrderItems1776607670496 implements MigrationInterface {
  name = 'AddServiceConfigToSalesOrderItems1776607670496';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add service configuration columns to sales_order_items
    await queryRunner.query(`
            ALTER TABLE "operations"."sales_order_items" 
            ADD COLUMN "service_type_id" integer NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "operations"."sales_order_items" 
            ADD COLUMN "service_option_id" integer NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "operations"."sales_order_items" 
            ADD COLUMN "label_source" character varying(50) NULL
        `);

    // Add indexes for the new columns
    await queryRunner.query(`
            CREATE INDEX "IDX_sales_order_items_service_type_id" 
            ON "operations"."sales_order_items" ("service_type_id") 
            WHERE "deleted_at" IS NULL
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_sales_order_items_service_option_id" 
            ON "operations"."sales_order_items" ("service_option_id") 
            WHERE "deleted_at" IS NULL
        `);

    // Add foreign key constraints
    await queryRunner.query(`
            ALTER TABLE "operations"."sales_order_items" 
            ADD CONSTRAINT "FK_sales_order_items_service_type" 
            FOREIGN KEY ("service_type_id") REFERENCES "service_config"."service_types"("id") ON DELETE SET NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "operations"."sales_order_items" 
            ADD CONSTRAINT "FK_sales_order_items_service_option" 
            FOREIGN KEY ("service_option_id") REFERENCES "service_config"."service_options"("id") ON DELETE SET NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(`
            ALTER TABLE "operations"."sales_order_items" 
            DROP CONSTRAINT "FK_sales_order_items_service_type"
        `);
    await queryRunner.query(`
            ALTER TABLE "operations"."sales_order_items" 
            DROP CONSTRAINT "FK_sales_order_items_service_option"
        `);

    // Drop indexes
    await queryRunner.query(`
            DROP INDEX IF EXISTS "IDX_sales_order_items_service_type_id"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "IDX_sales_order_items_service_option_id"
        `);

    // Drop columns
    await queryRunner.query(`
            ALTER TABLE "operations"."sales_order_items" 
            DROP COLUMN "service_type_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "operations"."sales_order_items" 
            DROP COLUMN "service_option_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "operations"."sales_order_items" 
            DROP COLUMN "label_source"
        `);
  }
}
