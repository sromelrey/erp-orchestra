import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateImportExportJobs20260315141500 implements MigrationInterface {
  name = 'CreateImportExportJobs20260315141500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "hris"`);

    await queryRunner.query(
      `CREATE TYPE "hris"."hris_job_status_enum" AS ENUM('PENDING','PROCESSING','COMPLETED','FAILED')`,
    );

    await queryRunner.query(`
      CREATE TABLE "hris"."hris_import_jobs" (
        "id" SERIAL NOT NULL,
        "tenant_id" integer NOT NULL,
        "requested_by" integer NOT NULL,
        "file_key" character varying NOT NULL,
        "dataset" character varying NOT NULL,
        "client_request_id" character varying,
        "status" "hris"."hris_job_status_enum" NOT NULL DEFAULT 'PENDING',
        "progress" double precision NOT NULL DEFAULT 0,
        "error" text,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_hris_import_jobs_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_hris_import_jobs_tenant" ON "hris"."hris_import_jobs" ("tenant_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "hris"."hris_export_jobs" (
        "id" SERIAL NOT NULL,
        "tenant_id" integer NOT NULL,
        "requested_by" integer NOT NULL,
        "dataset" character varying NOT NULL,
        "client_request_id" character varying,
        "file_key" character varying,
        "status" "hris"."hris_job_status_enum" NOT NULL DEFAULT 'PENDING',
        "progress" double precision NOT NULL DEFAULT 0,
        "error" text,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_hris_export_jobs_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_hris_export_jobs_tenant" ON "hris"."hris_export_jobs" ("tenant_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "hris"."IDX_hris_export_jobs_tenant"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "hris"."hris_export_jobs"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "hris"."IDX_hris_import_jobs_tenant"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "hris"."hris_import_jobs"`);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "hris"."hris_job_status_enum"`,
    );
  }
}
