import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmployees1773027712695 implements MigrationInterface {
  name = 'AddEmployees1773027712695';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "hris"."employees_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'BANNED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "hris"."employees" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "tenant_id" integer NOT NULL, "user_id" integer, "department_id" integer, "designation_id" integer, "branch_id" integer, "manager_id" integer, "employee_code" character varying(50), "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "email" character varying(255), "phone" character varying(50), "hire_date" date, "emergency_contact" character varying(255), "status" "hris"."employees_status_enum" NOT NULL DEFAULT 'ACTIVE', CONSTRAINT "REL_2d83c53c3e553a48dadb9722e3" UNIQUE ("user_id"), CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_43d76ca7eecf9373241e2e890f" ON "hris"."employees" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e1f508d74b2f061e0248c2769c" ON "hris"."employees" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_588d18aeef0504067e40c68278" ON "hris"."employees" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ec612532286551b8690c65ae8c" ON "hris"."employees" ("user_id") WHERE user_id IS NOT NULL AND deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_678a3540f843823784b0fe4a4f" ON "hris"."employees" ("department_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2de5d6e4fb3345f18bc467017f" ON "hris"."employees" ("designation_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_457a39c666de2686596e502eb8" ON "hris"."employees" ("branch_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bcdf921072a19dd2758a628c5c" ON "hris"."employees" ("manager_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_c1866769d58475e10353468fd3" ON "hris"."employees" ("tenant_id", "employee_code") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."employees" ADD CONSTRAINT "FK_588d18aeef0504067e40c682788" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."employees" ADD CONSTRAINT "FK_2d83c53c3e553a48dadb9722e38" FOREIGN KEY ("user_id") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."employees" ADD CONSTRAINT "FK_678a3540f843823784b0fe4a4f2" FOREIGN KEY ("department_id") REFERENCES "hris"."departments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."employees" ADD CONSTRAINT "FK_2de5d6e4fb3345f18bc467017f0" FOREIGN KEY ("designation_id") REFERENCES "hris"."designations"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."employees" ADD CONSTRAINT "FK_457a39c666de2686596e502eb8c" FOREIGN KEY ("branch_id") REFERENCES "hris"."branches"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."employees" ADD CONSTRAINT "FK_bcdf921072a19dd2758a628c5c0" FOREIGN KEY ("manager_id") REFERENCES "hris"."employees"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hris"."employees" DROP CONSTRAINT "FK_bcdf921072a19dd2758a628c5c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."employees" DROP CONSTRAINT "FK_457a39c666de2686596e502eb8c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."employees" DROP CONSTRAINT "FK_2de5d6e4fb3345f18bc467017f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."employees" DROP CONSTRAINT "FK_678a3540f843823784b0fe4a4f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."employees" DROP CONSTRAINT "FK_2d83c53c3e553a48dadb9722e38"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."employees" DROP CONSTRAINT "FK_588d18aeef0504067e40c682788"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_c1866769d58475e10353468fd3"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_bcdf921072a19dd2758a628c5c"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_457a39c666de2686596e502eb8"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_2de5d6e4fb3345f18bc467017f"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_678a3540f843823784b0fe4a4f"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_ec612532286551b8690c65ae8c"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_588d18aeef0504067e40c68278"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_e1f508d74b2f061e0248c2769c"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_43d76ca7eecf9373241e2e890f"`,
    );
    await queryRunner.query(`DROP TABLE "hris"."employees"`);
    await queryRunner.query(`DROP TYPE "hris"."employees_status_enum"`);
  }
}
