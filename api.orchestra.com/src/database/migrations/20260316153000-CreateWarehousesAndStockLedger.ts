import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWarehousesAndStockLedger20260316153000 implements MigrationInterface {
  name = 'CreateWarehousesAndStockLedger20260316153000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE SCHEMA IF NOT EXISTS "operations"');

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_type
          WHERE typname = 'stock_movement_type'
          AND typnamespace = 'operations'::regnamespace
        ) THEN
          CREATE TYPE "operations"."stock_movement_type" AS ENUM (
            'RECEIPT',
            'ISSUE',
            'TRANSFER_IN',
            'TRANSFER_OUT',
            'ADJUSTMENT'
          );
        END IF;
      END$$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "operations"."warehouses" (
        "id" SERIAL PRIMARY KEY,
        "tenant_id" INT NOT NULL,
        "code" VARCHAR(64) NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "is_default" BOOLEAN NOT NULL DEFAULT false,
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "created_by" INT,
        "updated_by" INT,
        "deleted_by" INT,
        "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITHOUT TIME ZONE,
        "deleted_at" TIMESTAMP WITHOUT TIME ZONE,
        CONSTRAINT "UQ_warehouses_tenant_code" UNIQUE ("tenant_id", "code")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "operations"."warehouse_locations" (
        "id" SERIAL PRIMARY KEY,
        "tenant_id" INT NOT NULL,
        "warehouse_id" INT NOT NULL,
        "parent_id" INT,
        "code" VARCHAR(64) NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "path" VARCHAR(512) NOT NULL,
        "depth" SMALLINT NOT NULL DEFAULT 0,
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "created_by" INT,
        "updated_by" INT,
        "deleted_by" INT,
        "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITHOUT TIME ZONE,
        "deleted_at" TIMESTAMP WITHOUT TIME ZONE,
        CONSTRAINT "UQ_locations_wh_code" UNIQUE ("warehouse_id", "code"),
        CONSTRAINT "FK_locations_warehouse" FOREIGN KEY ("warehouse_id") REFERENCES "operations"."warehouses"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_locations_parent" FOREIGN KEY ("parent_id") REFERENCES "operations"."warehouse_locations"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "operations"."stock_ledger" (
        "id" SERIAL PRIMARY KEY,
        "tenant_id" INT NOT NULL,
        "warehouse_id" INT NOT NULL,
        "location_id" INT,
        "item_id" INT NOT NULL,
        "uom_id" INT NOT NULL,
        "quantity" NUMERIC(18, 6) NOT NULL,
        "movement_type" "operations"."stock_movement_type" NOT NULL,
        "reference_type" VARCHAR(64),
        "reference_code" VARCHAR(64),
        "memo" TEXT,
        "document_date" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
        "created_by" INT,
        "updated_by" INT,
        "deleted_by" INT,
        "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITHOUT TIME ZONE,
        "deleted_at" TIMESTAMP WITHOUT TIME ZONE,
        CONSTRAINT "FK_stock_ledger_warehouse" FOREIGN KEY ("warehouse_id") REFERENCES "operations"."warehouses"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_stock_ledger_location" FOREIGN KEY ("location_id") REFERENCES "operations"."warehouse_locations"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_stock_ledger_item" FOREIGN KEY ("item_id") REFERENCES "operations"."items"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_stock_ledger_uom" FOREIGN KEY ("uom_id") REFERENCES "operations"."units_of_measure"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "operations"."stock_balances" (
        "id" SERIAL PRIMARY KEY,
        "tenant_id" INT NOT NULL,
        "warehouse_id" INT NOT NULL,
        "location_id" INT,
        "item_id" INT NOT NULL,
        "uom_id" INT NOT NULL,
        "on_hand_qty" NUMERIC(18, 6) NOT NULL DEFAULT 0,
        "created_by" INT,
        "updated_by" INT,
        "deleted_by" INT,
        "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITHOUT TIME ZONE,
        "deleted_at" TIMESTAMP WITHOUT TIME ZONE,
        CONSTRAINT "FK_stock_balance_warehouse" FOREIGN KEY ("warehouse_id") REFERENCES "operations"."warehouses"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_stock_balance_location" FOREIGN KEY ("location_id") REFERENCES "operations"."warehouse_locations"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_stock_balance_item" FOREIGN KEY ("item_id") REFERENCES "operations"."items"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_stock_balance_uom" FOREIGN KEY ("uom_id") REFERENCES "operations"."units_of_measure"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_warehouses_tenant" ON "operations"."warehouses" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_locations_tenant" ON "operations"."warehouse_locations" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_locations_path" ON "operations"."warehouse_locations" ("path") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_stock_ledger_tenant_item" ON "operations"."stock_ledger" ("tenant_id", "item_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_stock_ledger_tenant_wh" ON "operations"."stock_ledger" ("tenant_id", "warehouse_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_stock_ledger_document_date" ON "operations"."stock_ledger" ("document_date") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_stock_balance_scope" ON "operations"."stock_balances" ("tenant_id", "warehouse_id", COALESCE("location_id", 0), "item_id", "uom_id") WHERE deleted_at IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_stock_balance_scope"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_stock_ledger_document_date"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_stock_ledger_tenant_wh"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_stock_ledger_tenant_item"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_locations_path"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_locations_tenant"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_warehouses_tenant"`);

    await queryRunner.query(
      `DROP TABLE IF EXISTS "operations"."stock_balances"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "operations"."stock_ledger"`);
    await queryRunner.query(
      `DROP TABLE IF EXISTS "operations"."warehouse_locations"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "operations"."warehouses"`);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM pg_type
          WHERE typname = 'stock_movement_type'
          AND typnamespace = 'operations'::regnamespace
        ) THEN
          DROP TYPE "operations"."stock_movement_type";
        END IF;
      END$$;
    `);
  }
}
