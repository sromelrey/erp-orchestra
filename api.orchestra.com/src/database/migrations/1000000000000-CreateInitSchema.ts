import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitSchema1000000000000 implements MigrationInterface {
  name = 'CreateInitSchema1000000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ============================================
    // 1. CREATE ALL SCHEMAS
    // ============================================
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "public"`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "hris"`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "inventory"`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "sales"`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "production"`);

    // ============================================
    // 2. CREATE CORE TABLES - HRIS
    // ============================================
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "hris"."employee" (
        "id" SERIAL PRIMARY KEY,
        "first_name" VARCHAR(100),
        "last_name" VARCHAR(100),
        "email" VARCHAR(150),
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ============================================
    // 3. CREATE CORE TABLES - INVENTORY
    // ============================================
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory"."warehouse" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(150),
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory"."location" (
        "id" SERIAL PRIMARY KEY,
        "warehouse_id" INT,
        "name" VARCHAR(150),
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory"."item" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(150),
        "unit" VARCHAR(50),
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ============================================
    // 4. CREATE CORE TABLES - SALES
    // ============================================
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "sales"."customer" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(150),
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ============================================
    // 5. CREATE CORE TABLES - PRODUCTION
    // ============================================
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "production"."batch" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(150),
        "status" VARCHAR(50),
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ============================================
    // 6. ADD FOREIGN KEYS (AFTER TABLES EXIST)
    // ============================================
    // Check if constraint exists before adding to avoid errors
    const fkExists = await queryRunner.query(`
      SELECT COUNT(*) as count
      FROM information_schema.table_constraints
      WHERE constraint_name = 'fk_location_warehouse'
      AND table_schema = 'inventory'
      AND table_name = 'location'
    `);

    if (fkExists[0].count === 0) {
      await queryRunner.query(`
        ALTER TABLE "inventory"."location"
        ADD CONSTRAINT "fk_location_warehouse"
        FOREIGN KEY ("warehouse_id")
        REFERENCES "inventory"."warehouse"("id")
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order due to foreign key constraints
    await queryRunner.query(`DROP TABLE IF EXISTS "production"."batch"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sales"."customer"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory"."item"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory"."location"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory"."warehouse"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "hris"."employee"`);

    // Drop schemas
    await queryRunner.query(`DROP SCHEMA IF EXISTS "production"`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS "sales"`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS "inventory"`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS "hris"`);
    // Note: We don't drop public schema as it's PostgreSQL default
  }
}
