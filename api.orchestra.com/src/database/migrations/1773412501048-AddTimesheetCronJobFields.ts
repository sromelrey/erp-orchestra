import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimesheetCronJobFields1773412501048 implements MigrationInterface {
  name = 'AddTimesheetCronJobFields1773412501048';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "system"."job_execution_logs_status_enum" AS ENUM('SUCCESS', 'FAILED', 'PARTIAL')`,
    );
    await queryRunner.query(
      `CREATE TABLE "system"."job_execution_logs" ("id" SERIAL NOT NULL, "jobName" character varying(100) NOT NULL, "metadata" json NOT NULL, "status" "system"."job_execution_logs_status_enum" NOT NULL, "errorMessage" text, "processed_count" integer NOT NULL, "error_count" integer NOT NULL, "started_at" TIMESTAMP NOT NULL, "completed_at" TIMESTAMP NOT NULL, "tenant_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_32e009c848dc4c86c6fe1aa7831" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."pay_periods" ADD "processed_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."pay_periods" ADD "processing_attempts" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."pay_periods" ADD "last_processing_error" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."pay_periods" ADD "processing_started_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TYPE "hris"."pay_periods_status_enum" RENAME TO "pay_periods_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "hris"."pay_periods_status_enum" AS ENUM('OPEN', 'PROCESSING', 'CLOSED', 'PROCESSED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."pay_periods" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."pay_periods" ALTER COLUMN "status" TYPE "hris"."pay_periods_status_enum" USING "status"::"text"::"hris"."pay_periods_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."pay_periods" ALTER COLUMN "status" SET DEFAULT 'OPEN'`,
    );
    await queryRunner.query(`DROP TYPE "hris"."pay_periods_status_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "hris"."employee_compensations" ALTER COLUMN "overtime_rate" SET DEFAULT '1.5'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hris"."employee_compensations" ALTER COLUMN "overtime_rate" SET DEFAULT 1.5`,
    );
    await queryRunner.query(
      `CREATE TYPE "hris"."pay_periods_status_enum_old" AS ENUM('OPEN', 'PROCESSING', 'CLOSED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."pay_periods" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."pay_periods" ALTER COLUMN "status" TYPE "hris"."pay_periods_status_enum_old" USING "status"::"text"::"hris"."pay_periods_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."pay_periods" ALTER COLUMN "status" SET DEFAULT 'OPEN'`,
    );
    await queryRunner.query(`DROP TYPE "hris"."pay_periods_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "hris"."pay_periods_status_enum_old" RENAME TO "pay_periods_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."pay_periods" DROP COLUMN "processing_started_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."pay_periods" DROP COLUMN "last_processing_error"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."pay_periods" DROP COLUMN "processing_attempts"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."pay_periods" DROP COLUMN "processed_at"`,
    );
    await queryRunner.query(`DROP TABLE "system"."job_execution_logs"`);
    await queryRunner.query(
      `DROP TYPE "system"."job_execution_logs_status_enum"`,
    );
  }
}
