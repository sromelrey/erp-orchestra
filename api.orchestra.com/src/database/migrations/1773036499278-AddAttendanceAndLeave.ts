import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAttendanceAndLeave1773036499278 implements MigrationInterface {
  name = 'AddAttendanceAndLeave1773036499278';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "hris"."time_events_type_enum" AS ENUM('CLOCK_IN', 'CLOCK_OUT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "hris"."time_events" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "employee_id" integer NOT NULL, "type" "hris"."time_events_type_enum" NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "location" jsonb, "ip_address" character varying(45), "device_info" text, CONSTRAINT "PK_399c5115e4478a43260485c05bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e703bdb37468a99180821c31dc" ON "hris"."time_events" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5a9159fe21ef6b244b01e737c8" ON "hris"."time_events" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8ed6b1514006c3a0d37ad81ba5" ON "hris"."time_events" ("employee_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7cd77a52521625ed8ea7c86916" ON "hris"."time_events" ("timestamp") `,
    );
    await queryRunner.query(
      `CREATE TABLE "hris"."leave_types" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(100) NOT NULL, "description" text, "is_paid" boolean NOT NULL DEFAULT true, "default_days_per_year" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_359223e0755d19711813cd07394" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_022f185730e3132ffa8de8b7f2" ON "hris"."leave_types" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_46e2390ee02eecd8e8a53028a8" ON "hris"."leave_types" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE TYPE "hris"."leave_requests_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "hris"."leave_requests" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "employee_id" integer NOT NULL, "leave_type_id" integer NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "reason" text NOT NULL, "status" "hris"."leave_requests_status_enum" NOT NULL DEFAULT 'PENDING', "approved_by_id" integer, CONSTRAINT "PK_d3abcf9a16cef1450129e06fa9f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9c70580c6c3fbbc080adea9da5" ON "hris"."leave_requests" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_456c183302308ddebd86d7b367" ON "hris"."leave_requests" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_52b4b7c7d295e204add6dbe0a0" ON "hris"."leave_requests" ("employee_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a9cc5df6df50aed58f4d84aa4f" ON "hris"."leave_requests" ("status") `,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."time_events" ADD CONSTRAINT "FK_8ed6b1514006c3a0d37ad81ba57" FOREIGN KEY ("employee_id") REFERENCES "hris"."employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."leave_requests" ADD CONSTRAINT "FK_52b4b7c7d295e204add6dbe0a09" FOREIGN KEY ("employee_id") REFERENCES "hris"."employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."leave_requests" ADD CONSTRAINT "FK_54a57db316598806786c2b95323" FOREIGN KEY ("leave_type_id") REFERENCES "hris"."leave_types"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."leave_requests" ADD CONSTRAINT "FK_eef6f2beeb96d468621f22e0f29" FOREIGN KEY ("approved_by_id") REFERENCES "hris"."employees"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hris"."leave_requests" DROP CONSTRAINT "FK_eef6f2beeb96d468621f22e0f29"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."leave_requests" DROP CONSTRAINT "FK_54a57db316598806786c2b95323"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."leave_requests" DROP CONSTRAINT "FK_52b4b7c7d295e204add6dbe0a09"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."time_events" DROP CONSTRAINT "FK_8ed6b1514006c3a0d37ad81ba57"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_a9cc5df6df50aed58f4d84aa4f"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_52b4b7c7d295e204add6dbe0a0"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_456c183302308ddebd86d7b367"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_9c70580c6c3fbbc080adea9da5"`,
    );
    await queryRunner.query(`DROP TABLE "hris"."leave_requests"`);
    await queryRunner.query(`DROP TYPE "hris"."leave_requests_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_46e2390ee02eecd8e8a53028a8"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_022f185730e3132ffa8de8b7f2"`,
    );
    await queryRunner.query(`DROP TABLE "hris"."leave_types"`);
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_7cd77a52521625ed8ea7c86916"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_8ed6b1514006c3a0d37ad81ba5"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_5a9159fe21ef6b244b01e737c8"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_e703bdb37468a99180821c31dc"`,
    );
    await queryRunner.query(`DROP TABLE "hris"."time_events"`);
    await queryRunner.query(`DROP TYPE "hris"."time_events_type_enum"`);
  }
}
