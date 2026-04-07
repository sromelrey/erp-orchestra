import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductionStatusEnum20260407030000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create production_status enum if not exists
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_type
          WHERE typname = 'production_status'
          AND typnamespace = 'operations'::regnamespace
        ) THEN
          CREATE TYPE "operations"."production_status" AS ENUM (
            'PLANNED',
            'IN_PROGRESS',
            'COMPLETED',
            'CANCELLED'
          );
        END IF;
      END$$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop enum
    await queryRunner.query(
      `DROP TYPE IF EXISTS "operations"."production_status";`,
    );
  }
}
