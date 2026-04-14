import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitSchema1000000000000 implements MigrationInterface {
  name = 'CreateInitSchema1000000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ============================================
    // CREATE ALL REQUIRED SCHEMAS
    // ============================================
    // This migration creates only the schemas. Tables are created by their
    // respective migrations with full column definitions and constraints.
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "public"`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "system"`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "hris"`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "operations"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop schemas (in reverse order of creation)
    await queryRunner.query(`DROP SCHEMA IF EXISTS "operations"`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS "hris"`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS "system"`);
    // Note: We don't drop public schema as it's PostgreSQL default
  }
}
