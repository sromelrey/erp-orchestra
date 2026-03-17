import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBomCodeColumn20260316190000 implements MigrationInterface {
  name = 'AddBomCodeColumn20260316190000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" ADD COLUMN IF NOT EXISTS "code" VARCHAR(100)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" DROP COLUMN IF EXISTS "code"`,
    );
  }
}
