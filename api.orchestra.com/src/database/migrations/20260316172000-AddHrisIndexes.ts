import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHrisIndexes20260316172000 implements MigrationInterface {
  name = 'AddHrisIndexes20260316172000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_hris_employee_tenant_status" ON "hris"."employees" ("tenant_id", "status") WHERE deleted_at IS NULL`,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_hris_employee_tenant_department" ON "hris"."employees" ("tenant_id", "department_id") WHERE deleted_at IS NULL`,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_hris_employee_tenant_manager" ON "hris"."employees" ("tenant_id", "manager_id") WHERE deleted_at IS NULL`,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_hris_leave_type_tenant_name" ON "hris"."leave_types" ("tenant_id", "name") WHERE deleted_at IS NULL`,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_hris_payslip_tenant_pay_period" ON "hris"."payslips" ("tenant_id", "pay_period_id")`,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_hris_payslip_tenant_employee" ON "hris"."payslips" ("tenant_id", "employee_id")`,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_hris_payslip_tenant_status" ON "hris"."payslips" ("tenant_id", "status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_hris_payslip_tenant_status"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_hris_payslip_tenant_employee"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_hris_payslip_tenant_pay_period"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "UQ_hris_leave_type_tenant_name"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_hris_employee_tenant_manager"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_hris_employee_tenant_department"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_hris_employee_tenant_status"`,
    );
  }
}
