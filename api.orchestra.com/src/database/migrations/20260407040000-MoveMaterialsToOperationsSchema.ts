import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoveMaterialsToOperationsSchema20260407040000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if materials table exists in inventory schema
    const tableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'inventory' 
        AND table_name = 'materials'
      );
    `);

    if (tableExists[0].exists) {
      // Move the table to operations schema
      await queryRunner.query(`
        ALTER TABLE "inventory"."materials" 
        SET SCHEMA "operations";
      `);

      // Move sequences
      await queryRunner.query(`
        ALTER SEQUENCE IF EXISTS "inventory"."materials_id_seq" 
        SET SCHEMA "operations";
      `);

      // Move indexes
      await queryRunner.query(`
        ALTER INDEX IF EXISTS "materials_pkey" 
        SET SCHEMA "operations";
      `);

      await queryRunner.query(`
        ALTER INDEX IF EXISTS "inventory_materials_sku_key" 
        SET SCHEMA "operations";
      `);

      await queryRunner.query(`
        ALTER INDEX IF EXISTS "idx_materials_tenant_id" 
        SET SCHEMA "operations";
      `);

      await queryRunner.query(`
        ALTER INDEX IF EXISTS "idx_materials_tenant_id_material_type" 
        SET SCHEMA "operations";
      `);

      await queryRunner.query(`
        ALTER INDEX IF EXISTS "idx_materials_tenant_id_material_group" 
        SET SCHEMA "operations";
      `);

      await queryRunner.query(`
        ALTER INDEX IF EXISTS "idx_materials_tenant_id_is_active" 
        SET SCHEMA "operations";
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Move back to inventory schema
    await queryRunner.query(`
      ALTER TABLE "operations"."materials" 
      SET SCHEMA "inventory";
    `);

    // Move sequences back
    await queryRunner.query(`
      ALTER SEQUENCE IF EXISTS "operations"."materials_id_seq" 
      SET SCHEMA "inventory";
    `);

    // Move indexes back
    await queryRunner.query(`
      ALTER INDEX IF EXISTS "operations"."materials_pkey" 
      SET SCHEMA "inventory";
    `);

    await queryRunner.query(`
      ALTER INDEX IF EXISTS "operations_inventory_materials_sku_key" 
      SET SCHEMA "inventory";
    `);

    await queryRunner.query(`
      ALTER INDEX IF EXISTS "operations_idx_materials_tenant_id" 
      SET SCHEMA "inventory";
    `);

    await queryRunner.query(`
      ALTER INDEX IF EXISTS "operations_idx_materials_tenant_id_material_type" 
      SET SCHEMA "inventory";
    `);

    await queryRunner.query(`
      ALTER INDEX IF EXISTS "operations_idx_materials_tenant_id_material_group" 
      SET SCHEMA "inventory";
    `);

    await queryRunner.query(`
      ALTER INDEX IF EXISTS "operations_idx_materials_tenant_id_is_active" 
      SET SCHEMA "inventory";
    `);
  }
}
