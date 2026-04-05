import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGoodsIssuanceTables20260404060000 implements MigrationInterface {
  name = 'CreateGoodsIssuanceTables20260404060000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create issuance type enum
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_type
          WHERE typname = 'goods_issuance_type'
          AND typnamespace = 'operations'::regnamespace
        ) THEN
          CREATE TYPE "operations"."goods_issuance_type" AS ENUM (
            'PRODUCTION',
            'SALES',
            'TRANSFER',
            'ADJUSTMENT',
            'RETURN'
          );
        END IF;
      END$$;
    `);

    // Create issuance status enum
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_type
          WHERE typname = 'goods_issuance_status'
          AND typnamespace = 'operations'::regnamespace
        ) THEN
          CREATE TYPE "operations"."goods_issuance_status" AS ENUM (
            'DRAFT',
            'APPROVED',
            'ISSUED',
            'CANCELLED'
          );
        END IF;
      END$$;
    `);

    // Create reference type enum
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_type
          WHERE typname = 'goods_issuance_reference_type'
          AND typnamespace = 'operations'::regnamespace
        ) THEN
          CREATE TYPE "operations"."goods_issuance_reference_type" AS ENUM (
            'PRODUCTION_ORDER',
            'SALES_ORDER',
            'TRANSFER_ORDER',
            'ADJUSTMENT_REASON',
            'RETURN_ORDER',
            'NONE'
          );
        END IF;
      END$$;
    `);

    // Create goods_issuances table
    await queryRunner.query(`
      CREATE TABLE "operations"."goods_issuances" (
        "id" SERIAL NOT NULL,
        "tenant_id" integer NOT NULL,
        "issuance_number" character varying(64) NOT NULL,
        "issuance_type" "operations"."goods_issuance_type" NOT NULL,
        "reference_type" "operations"."goods_issuance_reference_type" NULL,
        "reference_code" character varying(64) NULL,
        "issued_to_department_id" integer NULL,
        "cost_center_id" integer NULL,
        "warehouse_id" integer NOT NULL,
        "location_id" integer NULL,
        "issuance_date" TIMESTAMP NOT NULL,
        "expected_date" TIMESTAMP NULL,
        "status" "operations"."goods_issuance_status" NOT NULL DEFAULT 'DRAFT',
        "notes" text NULL,
        "total_quantity" numeric(15,3) NOT NULL DEFAULT '0',
        "total_value" numeric(15,2) NOT NULL DEFAULT '0',
        "approved_by" integer NULL,
        "approved_at" TIMESTAMP NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP NULL,
        "created_by" integer NULL,
        "updated_by" integer NULL,
        "deleted_by" integer NULL,
        CONSTRAINT "pk_goods_issuances_id" PRIMARY KEY ("id"),
        CONSTRAINT "uq_goods_issuances_number" UNIQUE ("issuance_number"),
        CONSTRAINT "fk_goods_issuances_tenant" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "fk_goods_issuances_warehouse" FOREIGN KEY ("warehouse_id") REFERENCES "operations"."warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "fk_goods_issuances_location" FOREIGN KEY ("location_id") REFERENCES "operations"."warehouse_locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "fk_goods_issuances_department" FOREIGN KEY ("issued_to_department_id") REFERENCES "hris"."departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "fk_goods_issuances_approved_by" FOREIGN KEY ("approved_by") REFERENCES "system"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX "idx_goods_issuances_tenant_id" ON "operations"."goods_issuances" ("tenant_id");
      CREATE INDEX "idx_goods_issuances_number" ON "operations"."goods_issuances" ("issuance_number");
      CREATE INDEX "idx_goods_issuances_type" ON "operations"."goods_issuances" ("issuance_type");
      CREATE INDEX "idx_goods_issuances_status" ON "operations"."goods_issuances" ("status");
      CREATE INDEX "idx_goods_issuances_date" ON "operations"."goods_issuances" ("issuance_date");
      CREATE INDEX "idx_goods_issuances_warehouse" ON "operations"."goods_issuances" ("warehouse_id");
      CREATE INDEX "idx_goods_issuances_department" ON "operations"."goods_issuances" ("issued_to_department_id");
    `);

    // Create goods_issuance_items table
    await queryRunner.query(`
      CREATE TABLE "operations"."goods_issuance_items" (
        "id" SERIAL NOT NULL,
        "goods_issuance_id" integer NOT NULL,
        "item_id" integer NOT NULL,
        "uom_id" integer NOT NULL,
        "quantity_issued" numeric(15,3) NOT NULL,
        "unit_price" numeric(15,2) NULL,
        "total_price" numeric(15,2) NULL,
        "batch_number" character varying(64) NULL,
        "expiry_date" date NULL,
        "notes" text NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP NULL,
        "created_by" integer NULL,
        "updated_by" integer NULL,
        "deleted_by" integer NULL,
        CONSTRAINT "pk_goods_issuance_items_id" PRIMARY KEY ("id"),
        CONSTRAINT "fk_goods_issuance_items_issuance" FOREIGN KEY ("goods_issuance_id") REFERENCES "operations"."goods_issuances"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "fk_goods_issuance_items_item" FOREIGN KEY ("item_id") REFERENCES "operations"."items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "fk_goods_issuance_items_uom" FOREIGN KEY ("uom_id") REFERENCES "operations"."units_of_measure"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // Create indexes for items
    await queryRunner.query(`
      CREATE INDEX "idx_goods_issuance_items_issuance_id" ON "operations"."goods_issuance_items" ("goods_issuance_id");
      CREATE INDEX "idx_goods_issuance_items_item_id" ON "operations"."goods_issuance_items" ("item_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables
    await queryRunner.query(`DROP TABLE "operations"."goods_issuance_items"`);
    await queryRunner.query(`DROP TABLE "operations"."goods_issuances"`);

    // Drop enums
    await queryRunner.query(
      `DROP TYPE "operations"."goods_issuance_reference_type"`,
    );
    await queryRunner.query(`DROP TYPE "operations"."goods_issuance_status"`);
    await queryRunner.query(`DROP TYPE "operations"."goods_issuance_type"`);
  }
}
