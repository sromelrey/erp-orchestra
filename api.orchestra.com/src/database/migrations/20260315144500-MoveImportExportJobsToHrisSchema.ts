import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Moves import/export job tables and enum into the dedicated "hris" schema
 * to stay aligned with the entity definitions (@Entity({ schema: 'hris' })).
 */
export class MoveImportExportJobsToHrisSchema20260315144500 implements MigrationInterface {
  name = 'MoveImportExportJobsToHrisSchema20260315144500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "hris"`);

    // Ensure enum exists inside hris schema
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM pg_type t
          JOIN pg_namespace n ON n.oid = t.typnamespace
          WHERE t.typname = 'hris_job_status_enum' AND n.nspname = 'public'
        ) THEN
          ALTER TYPE "public"."hris_job_status_enum" SET SCHEMA "hris";
        ELSIF NOT EXISTS (
          SELECT 1 FROM pg_type t
          JOIN pg_namespace n ON n.oid = t.typnamespace
          WHERE t.typname = 'hris_job_status_enum' AND n.nspname = 'hris'
        ) THEN
          CREATE TYPE "hris"."hris_job_status_enum" AS ENUM ('PENDING','PROCESSING','COMPLETED','FAILED');
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "hris"."hris_import_jobs" (
        "id" SERIAL PRIMARY KEY,
        "tenant_id" integer NOT NULL,
        "requested_by" integer NOT NULL,
        "file_key" character varying NOT NULL,
        "dataset" character varying NOT NULL,
        "client_request_id" character varying,
        "status" "hris"."hris_job_status_enum" NOT NULL DEFAULT 'PENDING',
        "progress" double precision NOT NULL DEFAULT 0,
        "error" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_hris_import_jobs_tenant" ON "hris"."hris_import_jobs" ("tenant_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "hris"."hris_export_jobs" (
        "id" SERIAL PRIMARY KEY,
        "tenant_id" integer NOT NULL,
        "requested_by" integer NOT NULL,
        "dataset" character varying NOT NULL,
        "client_request_id" character varying,
        "file_key" character varying,
        "status" "hris"."hris_job_status_enum" NOT NULL DEFAULT 'PENDING',
        "progress" double precision NOT NULL DEFAULT 0,
        "error" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_hris_export_jobs_tenant" ON "hris"."hris_export_jobs" ("tenant_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "hris"."hris_import_jobs" SET SCHEMA "public"`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "hris"."hris_export_jobs" SET SCHEMA "public"`,
    );
    await queryRunner.query(
      `ALTER TYPE IF EXISTS "hris"."hris_job_status_enum" SET SCHEMA "public"`,
    );
  }
}
