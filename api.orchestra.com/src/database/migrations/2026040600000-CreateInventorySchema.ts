import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInventorySchema2026040600000 implements MigrationInterface {
  name = 'CreateInventorySchema2026040600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create inventory schema if it doesn't exist
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "inventory"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the inventory schema
    await queryRunner.query(`DROP SCHEMA IF EXISTS "inventory"`);
  }
}
