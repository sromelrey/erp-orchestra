import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitSchema1000000000000 implements MigrationInterface {
  name = 'CreateInitSchema1000000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ============================================
    // 1. CREATE ALL SCHEMAS
    // ============================================
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "public"`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "hris"`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "operations"`);

    // ============================================
    // 2. CREATE CORE TABLES - HRIS (MINIMAL STUB)
    // ============================================
    // Note: This is a minimal stub. The full employees table is created
    // by migration 1773027712695-AddEmployees.ts
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "hris"."employees" (
        "id" SERIAL PRIMARY KEY,
        "first_name" VARCHAR(100),
        "last_name" VARCHAR(100),
        "email" VARCHAR(150),
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ============================================
    // 3. CREATE CORE TABLES - OPERATIONS (MINIMAL STUBS)
    // ============================================
    // Note: These are minimal stubs. Full tables are created by later migrations:
    // - 20260316120000-CreateItemMasterTables.ts (items, units_of_measure, item_categories)
    // - 20260316153000-CreateWarehousesAndStockLedger.ts (warehouses, warehouse_locations)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "operations"."warehouses" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(150),
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "operations"."warehouse_locations" (
        "id" SERIAL PRIMARY KEY,
        "warehouse_id" INT,
        "name" VARCHAR(150),
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "operations"."items" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(150),
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ============================================
    // 4. ADD FOREIGN KEYS (AFTER TABLES EXIST)
    // ============================================
    // Check if constraint exists before adding to avoid errors
    const fkExists = await queryRunner.query(`
      SELECT COUNT(*) as count
      FROM information_schema.table_constraints
      WHERE constraint_name = 'fk_warehouse_locations_warehouse'
      AND table_schema = 'operations'
      AND table_name = 'warehouse_locations'
    `);

    if (fkExists[0].count === 0) {
      await queryRunner.query(`
        ALTER TABLE "operations"."warehouse_locations"
        ADD CONSTRAINT "fk_warehouse_locations_warehouse"
        FOREIGN KEY ("warehouse_id")
        REFERENCES "operations"."warehouses"("id")
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order due to foreign key constraints
    await queryRunner.query(`DROP TABLE IF EXISTS "operations"."items"`);
    await queryRunner.query(
      `DROP TABLE IF EXISTS "operations"."warehouse_locations"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "operations"."warehouses"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "hris"."employees"`);

    // Drop schemas
    await queryRunner.query(`DROP SCHEMA IF EXISTS "operations"`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS "hris"`);
    // Note: We don't drop public schema as it's PostgreSQL default
  }
}
