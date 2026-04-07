import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoveMaterialsToInventorySchema20260407050000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if materials table exists in operations schema
    const tableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'operations' 
        AND table_name = 'materials'
      );
    `);

    if (tableExists[0].exists) {
      // Drop indexes first (they will be recreated with the table)
      await queryRunner.query(
        `DROP INDEX IF EXISTS "operations"."materials_pkey" CASCADE;`,
      );
      await queryRunner.query(
        `DROP INDEX IF EXISTS "operations"."inventory_materials_sku_key" CASCADE;`,
      );
      await queryRunner.query(
        `DROP INDEX IF EXISTS "operations"."idx_materials_tenant_id" CASCADE;`,
      );
      await queryRunner.query(
        `DROP INDEX IF EXISTS "operations"."idx_materials_tenant_id_material_type" CASCADE;`,
      );
      await queryRunner.query(
        `DROP INDEX IF EXISTS "operations"."idx_materials_tenant_id_material_group" CASCADE;`,
      );
      await queryRunner.query(
        `DROP INDEX IF EXISTS "operations"."idx_materials_tenant_id_is_active" CASCADE;`,
      );

      // Move the table to inventory schema
      await queryRunner.query(`
        ALTER TABLE "operations"."materials" 
        SET SCHEMA "inventory";
      `);

      // Move sequences
      await queryRunner.query(`
        ALTER SEQUENCE IF EXISTS "operations"."materials_id_seq" 
        SET SCHEMA "inventory";
      `);

      // Recreate indexes in inventory schema (primary key already moved with table)
      await queryRunner.query(`
        CREATE UNIQUE INDEX "inventory_materials_sku_key" ON "inventory"."materials" ("sku") WHERE deleted_at IS NULL;
      `);

      await queryRunner.query(`
        CREATE INDEX "idx_materials_tenant_id" ON "inventory"."materials" ("tenant_id") WHERE deleted_at IS NULL;
      `);

      await queryRunner.query(`
        CREATE INDEX "idx_materials_tenant_id_material_type" ON "inventory"."materials" ("tenant_id", "material_type") WHERE deleted_at IS NULL;
      `);

      await queryRunner.query(`
        CREATE INDEX "idx_materials_tenant_id_material_group" ON "inventory"."materials" ("tenant_id", "material_group") WHERE deleted_at IS NULL;
      `);

      await queryRunner.query(`
        CREATE INDEX "idx_materials_tenant_id_is_active" ON "inventory"."materials" ("tenant_id", "is_active") WHERE deleted_at IS NULL;
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes in inventory schema
    await queryRunner.query(
      `DROP INDEX IF EXISTS "inventory"."idx_materials_tenant_id_is_active" CASCADE;`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "inventory"."idx_materials_tenant_id_material_group" CASCADE;`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "inventory"."idx_materials_tenant_id_material_type" CASCADE;`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "inventory"."idx_materials_tenant_id" CASCADE;`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "inventory"."inventory_materials_sku_key" CASCADE;`,
    );

    // Move back to operations schema
    await queryRunner.query(`
      ALTER TABLE "inventory"."materials" 
      SET SCHEMA "operations";
    `);

    // Move sequences back
    await queryRunner.query(`
      ALTER SEQUENCE IF EXISTS "inventory"."materials_id_seq" 
      SET SCHEMA "operations";
    `);

    // Recreate indexes in operations schema (primary key already moved with table)
    await queryRunner.query(`
      CREATE UNIQUE INDEX "inventory_materials_sku_key" ON "operations"."materials" ("sku") WHERE deleted_at IS NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_materials_tenant_id" ON "operations"."materials" ("tenant_id") WHERE deleted_at IS NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_materials_tenant_id_material_type" ON "operations"."materials" ("tenant_id", "material_type") WHERE deleted_at IS NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_materials_tenant_id_material_group" ON "operations"."materials" ("tenant_id", "material_group") WHERE deleted_at IS NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_materials_tenant_id_is_active" ON "operations"."materials" ("tenant_id", "is_active") WHERE deleted_at IS NULL;
    `);
  }
}
