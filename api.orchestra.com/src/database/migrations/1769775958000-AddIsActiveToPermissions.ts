import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsActiveToPermissions1769775958000 implements MigrationInterface {
  name = 'AddIsActiveToPermissions1769775958000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "system"."permissions" 
      ADD COLUMN IF NOT EXISTS "is_active" boolean NOT NULL DEFAULT true
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "system"."permissions" 
      DROP COLUMN IF EXISTS "is_active"
    `);
  }
}
