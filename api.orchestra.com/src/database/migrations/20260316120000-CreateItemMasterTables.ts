import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateItemMasterTables20260316120000 implements MigrationInterface {
  name = 'CreateItemMasterTables20260316120000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE SCHEMA IF NOT EXISTS "operations"');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "operations"."item_categories" (
        "id" SERIAL PRIMARY KEY,
        "tenant_id" INT NOT NULL,
        "code" VARCHAR(64) NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "created_by" INT,
        "updated_by" INT,
        "deleted_by" INT,
        "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITHOUT TIME ZONE,
        "deleted_at" TIMESTAMP WITHOUT TIME ZONE,
        CONSTRAINT "UQ_item_categories_tenant_code" UNIQUE ("tenant_id", "code")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "operations"."units_of_measure" (
        "id" SERIAL PRIMARY KEY,
        "tenant_id" INT NOT NULL,
        "code" VARCHAR(32) NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "precision" SMALLINT NOT NULL DEFAULT 2,
        "created_by" INT,
        "updated_by" INT,
        "deleted_by" INT,
        "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITHOUT TIME ZONE,
        "deleted_at" TIMESTAMP WITHOUT TIME ZONE,
        CONSTRAINT "UQ_units_of_measure_tenant_code" UNIQUE ("tenant_id", "code")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "operations"."items" (
        "id" SERIAL PRIMARY KEY,
        "tenant_id" INT NOT NULL,
        "code" VARCHAR(64) NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "category_id" INT,
        "base_uom_id" INT NOT NULL,
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "created_by" INT,
        "updated_by" INT,
        "deleted_by" INT,
        "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITHOUT TIME ZONE,
        "deleted_at" TIMESTAMP WITHOUT TIME ZONE,
        CONSTRAINT "UQ_items_tenant_code" UNIQUE ("tenant_id", "code"),
        CONSTRAINT "FK_items_category" FOREIGN KEY ("category_id") REFERENCES "operations"."item_categories"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_items_base_uom" FOREIGN KEY ("base_uom_id") REFERENCES "operations"."units_of_measure"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "operations"."item_units" (
        "id" SERIAL PRIMARY KEY,
        "tenant_id" INT NOT NULL,
        "item_id" INT NOT NULL,
        "uom_id" INT NOT NULL,
        "conversion_factor" NUMERIC(18,6) NOT NULL DEFAULT 1,
        "created_by" INT,
        "updated_by" INT,
        "deleted_by" INT,
        "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITHOUT TIME ZONE,
        "deleted_at" TIMESTAMP WITHOUT TIME ZONE,
        CONSTRAINT "UQ_item_units_item_uom" UNIQUE ("item_id", "uom_id"),
        CONSTRAINT "FK_item_units_item" FOREIGN KEY ("item_id") REFERENCES "operations"."items"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_item_units_uom" FOREIGN KEY ("uom_id") REFERENCES "operations"."units_of_measure"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_item_categories_tenant" ON "operations"."item_categories" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_units_of_measure_tenant" ON "operations"."units_of_measure" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_items_tenant" ON "operations"."items" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_items_category" ON "operations"."items" ("category_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_item_units_item" ON "operations"."item_units" ("item_id") WHERE deleted_at IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_item_units_item"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_items_category"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_items_tenant"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_units_of_measure_tenant"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_item_categories_tenant"`,
    );

    await queryRunner.query(`DROP TABLE IF EXISTS "operations"."item_units"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "operations"."items"`);
    await queryRunner.query(
      `DROP TABLE IF EXISTS "operations"."units_of_measure"`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "operations"."item_categories"`,
    );
  }
}
