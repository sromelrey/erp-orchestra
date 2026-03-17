import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBomEffectiveExpiryColumns20260316190500 implements MigrationInterface {
  name = 'AddBomEffectiveExpiryColumns20260316190500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" ADD COLUMN IF NOT EXISTS "effective_date" TIMESTAMP WITHOUT TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" ADD COLUMN IF NOT EXISTS "expiry_date" TIMESTAMP WITHOUT TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" DROP COLUMN IF EXISTS "effective_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" DROP COLUMN IF EXISTS "expiry_date"`,
    );
  }
}
