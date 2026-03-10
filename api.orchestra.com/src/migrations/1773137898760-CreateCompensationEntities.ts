import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCompensationEntities1773137898760 implements MigrationInterface {
  name = 'CreateCompensationEntities1773137898760';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "hris"."employee_compensations_payment_frequency_enum" AS ENUM('weekly', 'bi-weekly', 'semi-monthly', 'monthly')`,
    );
    await queryRunner.query(
      `CREATE TABLE "hris"."employee_compensations" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "employee_id" integer NOT NULL, "base_salary" numeric(10,2), "hourly_rate" numeric(8,2), "overtime_rate" numeric(8,2), "effective_date" date NOT NULL, "end_date" date, "currency" character varying(3) NOT NULL DEFAULT 'USD', "payment_frequency" "hris"."employee_compensations_payment_frequency_enum" NOT NULL DEFAULT 'monthly', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_0577307a52d6623c2dd6bb6cf32" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_df90cda5fb889fb1ce0525a889" ON "hris"."employee_compensations" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0c84f58de4e8cfee47d8085ca3" ON "hris"."employee_compensations" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_44b778662d6784e71dda341237" ON "hris"."employee_compensations" ("employee_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e6a30ca12a29c3f39d58845ab3" ON "hris"."employee_compensations" ("employee_id", "effective_date") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "hris"."employee_deductions_type_enum" AS ENUM('fixed', 'percentage', 'recurring', 'variable')`,
    );
    await queryRunner.query(
      `CREATE TYPE "hris"."employee_deductions_frequency_enum" AS ENUM('one-time', 'monthly', 'quarterly', 'annually')`,
    );
    await queryRunner.query(
      `CREATE TABLE "hris"."employee_deductions" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "employee_id" integer NOT NULL, "name" character varying(100) NOT NULL, "type" "hris"."employee_deductions_type_enum" NOT NULL DEFAULT 'fixed', "amount" numeric(10,2), "percentage" numeric(5,2), "frequency" "hris"."employee_deductions_frequency_enum" NOT NULL DEFAULT 'monthly', "effective_date" date NOT NULL, "end_date" date, "description" character varying(255), "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_fbdf302204dc12579b88b67dadf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2196f583523aac625d52660c8b" ON "hris"."employee_deductions" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0edbc659fd564025cdb05902a7" ON "hris"."employee_deductions" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7ea5887bfe829965698f1f5b3c" ON "hris"."employee_deductions" ("employee_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5d7291466fbd3d04667e9e363a" ON "hris"."employee_deductions" ("employee_id", "effective_date") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "hris"."compensation_history" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "employee_id" integer NOT NULL, "field" character varying(50) NOT NULL, "old_value" text, "new_value" text, "change_reason" character varying(255), "changed_by" integer, "changed_at" TIMESTAMP NOT NULL DEFAULT NOW(), CONSTRAINT "PK_fe42d5d134e987e299e93610de9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9ab74e091da558cd068b510b80" ON "hris"."compensation_history" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3996649c46cbc985150e80e17a" ON "hris"."compensation_history" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cee1500517345e6fcf1ab13535" ON "hris"."compensation_history" ("employee_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5cd3c0d7164b909d73410e2815" ON "hris"."compensation_history" ("employee_id", "changed_at") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_5cd3c0d7164b909d73410e2815"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5cd3c0d7164b909d73410e2815" ON "hris"."compensation_history" ("employee_id", "changed_at") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."employee_compensations" ADD CONSTRAINT "FK_44b778662d6784e71dda341237f" FOREIGN KEY ("employee_id") REFERENCES "hris"."employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."employee_deductions" ADD CONSTRAINT "FK_7ea5887bfe829965698f1f5b3ca" FOREIGN KEY ("employee_id") REFERENCES "hris"."employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."compensation_history" ADD CONSTRAINT "FK_cee1500517345e6fcf1ab13535f" FOREIGN KEY ("employee_id") REFERENCES "hris"."employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hris"."compensation_history" DROP CONSTRAINT "FK_cee1500517345e6fcf1ab13535f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."employee_deductions" DROP CONSTRAINT "FK_7ea5887bfe829965698f1f5b3ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."employee_compensations" DROP CONSTRAINT "FK_44b778662d6784e71dda341237f"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_5cd3c0d7164b909d73410e2815"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5cd3c0d7164b909d73410e2815" ON "hris"."compensation_history" ("employee_id", "changed_at") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_5cd3c0d7164b909d73410e2815"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_cee1500517345e6fcf1ab13535"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_3996649c46cbc985150e80e17a"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_9ab74e091da558cd068b510b80"`,
    );
    await queryRunner.query(`DROP TABLE "hris"."compensation_history"`);
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_5d7291466fbd3d04667e9e363a"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_7ea5887bfe829965698f1f5b3c"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_0edbc659fd564025cdb05902a7"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_2196f583523aac625d52660c8b"`,
    );
    await queryRunner.query(`DROP TABLE "hris"."employee_deductions"`);
    await queryRunner.query(
      `DROP TYPE "hris"."employee_deductions_frequency_enum"`,
    );
    await queryRunner.query(`DROP TYPE "hris"."employee_deductions_type_enum"`);
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_e6a30ca12a29c3f39d58845ab3"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_44b778662d6784e71dda341237"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_0c84f58de4e8cfee47d8085ca3"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_df90cda5fb889fb1ce0525a889"`,
    );
    await queryRunner.query(`DROP TABLE "hris"."employee_compensations"`);
    await queryRunner.query(
      `DROP TYPE "hris"."employee_compensations_payment_frequency_enum"`,
    );
  }
}
