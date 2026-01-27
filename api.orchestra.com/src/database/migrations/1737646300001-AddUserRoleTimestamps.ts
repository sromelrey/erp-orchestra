import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRoleTimestamps1737646300001 implements MigrationInterface {
  name = 'AddUserRoleTimestamps1737646300001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "system"."user_roles" 
      ADD COLUMN "assigned_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN "expires_at" TIMESTAMP WITH TIME ZONE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "system"."user_roles" 
      DROP COLUMN "expires_at",
      DROP COLUMN "assigned_at"
    `);
  }
}
