import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAddonsSchema1776607670497 implements MigrationInterface {
  name = 'CreateAddonsSchema1776607670497';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create addons table
    await queryRunner.query(`
            CREATE TABLE "addons" (
                "id" SERIAL NOT NULL,
                "tenant_id" integer NOT NULL,
                "code" character varying(50) NOT NULL,
                "name" character varying(255) NOT NULL,
                "description" text,
                "type" character varying(20) NOT NULL DEFAULT 'PHYSICAL',
                "base_price" numeric(10,2) NOT NULL DEFAULT 0.00,
                "material_id" integer,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_by" integer NOT NULL,
                "updated_by" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_addons" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_addons_tenant_code" UNIQUE ("tenant_id", "code"),
                CONSTRAINT "CHK_addons_type" CHECK ("type" IN ('PHYSICAL', 'SERVICE'))
            )
        `);

    // Create addon_inclusion_rules table
    await queryRunner.query(`
            CREATE TABLE "addon_inclusion_rules" (
                "id" SERIAL NOT NULL,
                "tenant_id" integer NOT NULL,
                "addon_id" integer NOT NULL,
                "rule_type" character varying(20) NOT NULL DEFAULT 'MIN_QTY',
                "threshold_value" numeric(10,2) NOT NULL,
                "discount_percent" numeric(5,2) NOT NULL DEFAULT 100.00,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_by" integer NOT NULL,
                "updated_by" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_addon_inclusion_rules" PRIMARY KEY ("id"),
                CONSTRAINT "CHK_addon_rules_type" CHECK ("rule_type" IN ('MIN_QTY'))
            )
        `);

    // Create sales_order_item_addons table
    await queryRunner.query(`
            CREATE TABLE "sales_order_item_addons" (
                "id" SERIAL NOT NULL,
                "tenant_id" integer NOT NULL,
                "sales_order_item_id" integer NOT NULL,
                "addon_id" integer NOT NULL,
                "unit_price" numeric(10,2) NOT NULL,
                "quantity" numeric(15,6) NOT NULL DEFAULT 1.000000,
                "is_free" boolean NOT NULL DEFAULT false,
                "notes" text,
                "created_by" integer NOT NULL,
                "updated_by" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_sales_order_item_addons" PRIMARY KEY ("id")
            )
        `);

    // Create indexes
    await queryRunner.query(`
            CREATE INDEX "IDX_addons_tenant_id" ON "addons" ("tenant_id")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_addons_code" ON "addons" ("code")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_addons_type" ON "addons" ("type")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_addons_is_active" ON "addons" ("is_active")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_addon_inclusion_rules_tenant_id" ON "addon_inclusion_rules" ("tenant_id")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_addon_inclusion_rules_addon_id" ON "addon_inclusion_rules" ("addon_id")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_addon_inclusion_rules_is_active" ON "addon_inclusion_rules" ("is_active")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_sales_order_item_addons_tenant_id" ON "sales_order_item_addons" ("tenant_id")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_sales_order_item_addons_sales_order_item_id" ON "sales_order_item_addons" ("sales_order_item_id")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_sales_order_item_addons_addon_id" ON "sales_order_item_addons" ("addon_id")
        `);

    // Create foreign key constraints
    await queryRunner.query(`
            ALTER TABLE "addons" ADD CONSTRAINT "FK_addons_material_id" 
            FOREIGN KEY ("material_id") 
            REFERENCES "inventory"."materials"("id") 
            ON DELETE SET NULL
        `);

    await queryRunner.query(`
            ALTER TABLE "addon_inclusion_rules" ADD CONSTRAINT "FK_addon_inclusion_rules_addon_id" 
            FOREIGN KEY ("addon_id") 
            REFERENCES "addons"("id") 
            ON DELETE CASCADE
        `);

    await queryRunner.query(`
            ALTER TABLE "sales_order_item_addons" ADD CONSTRAINT "FK_sales_order_item_addons_sales_order_item_id" 
            FOREIGN KEY ("sales_order_item_id") 
            REFERENCES "operations"."sales_order_items"("id") 
            ON DELETE CASCADE
        `);

    await queryRunner.query(`
            ALTER TABLE "sales_order_item_addons" ADD CONSTRAINT "FK_sales_order_item_addons_addon_id" 
            FOREIGN KEY ("addon_id") 
            REFERENCES "addons"("id") 
            ON DELETE RESTRICT
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "sales_order_item_addons" DROP CONSTRAINT "FK_sales_order_item_addons_addon_id"
        `);

    await queryRunner.query(`
            ALTER TABLE "sales_order_item_addons" DROP CONSTRAINT "FK_sales_order_item_addons_sales_order_item_id"
        `);

    await queryRunner.query(`
            ALTER TABLE "addon_inclusion_rules" DROP CONSTRAINT "FK_addon_inclusion_rules_addon_id"
        `);

    await queryRunner.query(`
            ALTER TABLE "addons" DROP CONSTRAINT "FK_addons_material_id"
        `);

    await queryRunner.query(`
            DROP INDEX "IDX_sales_order_item_addons_addon_id"
        `);

    await queryRunner.query(`
            DROP INDEX "IDX_sales_order_item_addons_sales_order_item_id"
        `);

    await queryRunner.query(`
            DROP INDEX "IDX_sales_order_item_addons_tenant_id"
        `);

    await queryRunner.query(`
            DROP INDEX "IDX_addon_inclusion_rules_is_active"
        `);

    await queryRunner.query(`
            DROP INDEX "IDX_addon_inclusion_rules_addon_id"
        `);

    await queryRunner.query(`
            DROP INDEX "IDX_addon_inclusion_rules_tenant_id"
        `);

    await queryRunner.query(`
            DROP INDEX "IDX_addons_is_active"
        `);

    await queryRunner.query(`
            DROP INDEX "IDX_addons_type"
        `);

    await queryRunner.query(`
            DROP INDEX "IDX_addons_code"
        `);

    await queryRunner.query(`
            DROP INDEX "IDX_addons_tenant_id"
        `);

    await queryRunner.query(`
            DROP TABLE "sales_order_item_addons"
        `);

    await queryRunner.query(`
            DROP TABLE "addon_inclusion_rules"
        `);

    await queryRunner.query(`
            DROP TABLE "addons"
        `);
  }
}
