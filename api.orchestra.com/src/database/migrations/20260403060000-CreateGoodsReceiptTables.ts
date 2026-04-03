import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGoodsReceiptTables20260403060000 implements MigrationInterface {
  name = 'CreateGoodsReceiptTables20260403060000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create receipt type enum
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_type
          WHERE typname = 'goods_receipt_type'
          AND typnamespace = 'operations'::regnamespace
        ) THEN
          CREATE TYPE "operations"."goods_receipt_type" AS ENUM (
            'PURCHASE_ORDER',
            'PRODUCTION',
            'RETURN',
            'MANUAL'
          );
        END IF;
      END$$;
    `);

    // Create receipt status enum
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_type
          WHERE typname = 'goods_receipt_status'
          AND typnamespace = 'operations'::regnamespace
        ) THEN
          CREATE TYPE "operations"."goods_receipt_status" AS ENUM (
            'DRAFT',
            'CONFIRMED',
            'CANCELLED'
          );
        END IF;
      END$$;
    `);

    // Create goods_receipts table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "operations"."goods_receipts" (
        "id" SERIAL PRIMARY KEY,
        "tenant_id" INT NOT NULL,
        "receipt_number" VARCHAR(64) NOT NULL,
        "receipt_type" "operations"."goods_receipt_type" NOT NULL,
        "reference_type" VARCHAR(64),
        "reference_code" VARCHAR(64),
        "supplier_id" INT,
        "warehouse_id" INT NOT NULL,
        "location_id" INT,
        "receipt_date" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
        "expected_date" TIMESTAMP WITHOUT TIME ZONE,
        "status" "operations"."goods_receipt_status" NOT NULL DEFAULT 'DRAFT',
        "notes" TEXT,
        "total_quantity" NUMERIC(18, 6) NOT NULL DEFAULT 0,
        "total_value" NUMERIC(18, 2) NOT NULL DEFAULT 0,
        "created_by" INT,
        "updated_by" INT,
        "deleted_by" INT,
        "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITHOUT TIME ZONE,
        "deleted_at" TIMESTAMP WITHOUT TIME ZONE,
        CONSTRAINT "UQ_goods_receipts_tenant_number" UNIQUE ("tenant_id", "receipt_number"),
        CONSTRAINT "FK_goods_receipts_warehouse" FOREIGN KEY ("warehouse_id") REFERENCES "operations"."warehouses"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_goods_receipts_location" FOREIGN KEY ("location_id") REFERENCES "operations"."warehouse_locations"("id") ON DELETE SET NULL
      )
    `);

    // Create goods_receipt_items table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "operations"."goods_receipt_items" (
        "id" SERIAL PRIMARY KEY,
        "goods_receipt_id" INT NOT NULL,
        "item_id" INT NOT NULL,
        "uom_id" INT NOT NULL,
        "quantity_ordered" NUMERIC(18, 6) NOT NULL DEFAULT 0,
        "quantity_received" NUMERIC(18, 6) NOT NULL DEFAULT 0,
        "unit_price" NUMERIC(18, 2),
        "total_price" NUMERIC(18, 2),
        "batch_number" VARCHAR(64),
        "expiry_date" DATE,
        "notes" TEXT,
        "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITHOUT TIME ZONE,
        CONSTRAINT "FK_goods_receipt_items_receipt" FOREIGN KEY ("goods_receipt_id") REFERENCES "operations"."goods_receipts"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_goods_receipt_items_item" FOREIGN KEY ("item_id") REFERENCES "operations"."items"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_goods_receipt_items_uom" FOREIGN KEY ("uom_id") REFERENCES "operations"."units_of_measure"("id") ON DELETE RESTRICT
      )
    `);

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_goods_receipts_tenant" ON "operations"."goods_receipts" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_goods_receipts_number" ON "operations"."goods_receipts" ("receipt_number") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_goods_receipts_status" ON "operations"."goods_receipts" ("status") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_goods_receipts_date" ON "operations"."goods_receipts" ("receipt_date") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_goods_receipt_items_receipt" ON "operations"."goods_receipt_items" ("goods_receipt_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE IF EXISTS "operations"."goods_receipt_items"`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "operations"."goods_receipts"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "operations"."goods_receipt_status"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "operations"."goods_receipt_type"`,
    );
  }
}
