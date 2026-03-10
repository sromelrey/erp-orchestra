import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePayPeriodsAndTimesheets1773064504936 implements MigrationInterface {
  name = 'CreatePayPeriodsAndTimesheets1773064504936';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "hris"."pay_periods_status_enum" AS ENUM('OPEN', 'PROCESSING', 'CLOSED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "hris"."pay_periods" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "status" "hris"."pay_periods_status_enum" NOT NULL DEFAULT 'OPEN', "tenant_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1eb133b5947dd46710dc78b94d7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "hris"."timesheet_days" ("id" SERIAL NOT NULL, "timesheet_id" uuid NOT NULL, "date" date NOT NULL, "check_in" TIMESTAMP, "check_out" TIMESTAMP, "regular_hours" numeric(10,2) NOT NULL DEFAULT '0', "overtime_hours" numeric(10,2) NOT NULL DEFAULT '0', "is_anomaly" boolean NOT NULL DEFAULT false, "anomaly_reason" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_560c50992be4545725f69752327" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "hris"."timesheets_status_enum" AS ENUM('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'LOCKED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "hris"."timesheets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "employee_id" integer NOT NULL, "pay_period_id" integer NOT NULL, "status" "hris"."timesheets_status_enum" NOT NULL DEFAULT 'DRAFT', "total_regular_hours" numeric(10,2) NOT NULL DEFAULT '0', "total_overtime_hours" numeric(10,2) NOT NULL DEFAULT '0', "tenant_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1dc280b68c9353ecce41a34be71" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."pay_periods" ADD CONSTRAINT "FK_33b2e77fb0c9dcc194e1bfbd503" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."timesheet_days" ADD CONSTRAINT "FK_b3c8f0ac1619738b3e3c8f0aca5" FOREIGN KEY ("timesheet_id") REFERENCES "hris"."timesheets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."timesheets" ADD CONSTRAINT "FK_267f76d9fa5bc70e8a3a1680a02" FOREIGN KEY ("employee_id") REFERENCES "hris"."employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."timesheets" ADD CONSTRAINT "FK_6a10799bdfed101ca8e59f6979a" FOREIGN KEY ("pay_period_id") REFERENCES "hris"."pay_periods"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."timesheets" ADD CONSTRAINT "FK_ddac109473cc2631c5752d0a055" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hris"."timesheets" DROP CONSTRAINT "FK_ddac109473cc2631c5752d0a055"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."timesheets" DROP CONSTRAINT "FK_6a10799bdfed101ca8e59f6979a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."timesheets" DROP CONSTRAINT "FK_267f76d9fa5bc70e8a3a1680a02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."timesheet_days" DROP CONSTRAINT "FK_b3c8f0ac1619738b3e3c8f0aca5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."pay_periods" DROP CONSTRAINT "FK_33b2e77fb0c9dcc194e1bfbd503"`,
    );
    await queryRunner.query(`DROP TABLE "hris"."timesheets"`);
    await queryRunner.query(`DROP TYPE "hris"."timesheets_status_enum"`);
    await queryRunner.query(`DROP TABLE "hris"."timesheet_days"`);
    await queryRunner.query(`DROP TABLE "hris"."pay_periods"`);
    await queryRunner.query(`DROP TYPE "hris"."pay_periods_status_enum"`);
  }
}
