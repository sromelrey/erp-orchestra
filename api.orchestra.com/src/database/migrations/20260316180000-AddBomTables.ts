import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBomTables20260316180000 implements MigrationInterface {
  name = 'AddBomTables20260316180000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure schema exists
    await queryRunner.query('CREATE SCHEMA IF NOT EXISTS "operations"');

    // Create BOM status enum if not exists
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type 
          WHERE typname = 'bom_status' 
          AND typnamespace = 'operations'::regnamespace
        ) THEN
          CREATE TYPE "operations"."bom_status" AS ENUM ('DRAFT', 'ACTIVE', 'OBSOLETE');
        END IF;
      END$$;
    `);

    // Create boms table if not exists
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "operations"."boms" (
        "id" SERIAL PRIMARY KEY,
        "tenant_id" INT NOT NULL,
        "parent_material_id" INT NOT NULL,
        "code" VARCHAR(100),
        "name" VARCHAR(255),
        "version" VARCHAR(20) NOT NULL DEFAULT '1.0',
        "status" "operations"."bom_status" NOT NULL DEFAULT 'DRAFT',
        "effective_date" TIMESTAMP WITHOUT TIME ZONE,
        "expiry_date" TIMESTAMP WITHOUT TIME ZONE,
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "created_by" INT,
        "updated_by" INT,
        "deleted_by" INT,
        "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITHOUT TIME ZONE,
        "deleted_at" TIMESTAMP WITHOUT TIME ZONE,
        CONSTRAINT "UQ_boms_tenant_material_version" UNIQUE ("tenant_id", "parent_material_id", "version")
      )
    `);

    // Create bom_items table if not exists
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "operations"."bom_items" (
        "id" SERIAL PRIMARY KEY,
        "bom_id" INT NOT NULL,
        "component_material_id" INT NOT NULL,
        "quantity" NUMERIC(12,4) NOT NULL,
        "uom" VARCHAR(10),
        "scrap_percentage" NUMERIC(5,2) NOT NULL DEFAULT 0,
        "sort_order" INT,
        "created_by" INT,
        "updated_by" INT,
        "deleted_by" INT,
        "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITHOUT TIME ZONE,
        "deleted_at" TIMESTAMP WITHOUT TIME ZONE,
        CONSTRAINT "UQ_bom_items_bom_component" UNIQUE ("bom_id", "component_material_id")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "operations"."boms" 
      ADD CONSTRAINT "FK_boms_tenant" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE RESTRICT
    `);

    await queryRunner.query(`
      ALTER TABLE "operations"."boms" 
      ADD CONSTRAINT "FK_boms_parent_material" FOREIGN KEY ("parent_material_id") REFERENCES "operations"."materials"("id") ON DELETE RESTRICT
    `);

    await queryRunner.query(`
      ALTER TABLE "operations"."bom_items" 
      ADD CONSTRAINT "FK_bom_items_bom" FOREIGN KEY ("bom_id") REFERENCES "operations"."boms"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "operations"."bom_items" 
      ADD CONSTRAINT "FK_bom_items_component_material" FOREIGN KEY ("component_material_id") REFERENCES "operations"."materials"("id") ON DELETE RESTRICT
    `);

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_boms_tenant" ON "operations"."boms" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_boms_parent_material" ON "operations"."boms" ("parent_material_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_boms_tenant_parent" ON "operations"."boms" ("tenant_id", "parent_material_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_boms_tenant_status" ON "operations"."boms" ("tenant_id", "status") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_boms_material_version" ON "operations"."boms" ("parent_material_id", "version") WHERE deleted_at IS NULL`,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_bom_items_bom" ON "operations"."bom_items" ("bom_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_bom_items_component" ON "operations"."bom_items" ("component_material_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_bom_items_bom_component" ON "operations"."bom_items" ("bom_id", "component_material_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_bom_items_sort_order" ON "operations"."bom_items" ("bom_id", "sort_order") WHERE deleted_at IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bom_items_sort_order"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_bom_items_bom_component"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bom_items_component"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bom_items_bom"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_boms_material_version"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_boms_tenant_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_boms_tenant_parent"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_boms_parent_material"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_boms_tenant"`);

    // Drop foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_items" DROP CONSTRAINT IF EXISTS "FK_bom_items_component_material"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."bom_items" DROP CONSTRAINT IF EXISTS "FK_bom_items_bom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" DROP CONSTRAINT IF EXISTS "FK_boms_parent_material"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" DROP CONSTRAINT IF EXISTS "FK_boms_tenant"`,
    );

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "operations"."bom_items"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "operations"."boms"`);

    // Drop enum
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM pg_type 
          WHERE typname = 'bom_status' 
          AND typnamespace = 'operations'::regnamespace
        ) THEN
          DROP TYPE "operations"."bom_status";
        END IF;
      END$$;
    `);
  }
}
