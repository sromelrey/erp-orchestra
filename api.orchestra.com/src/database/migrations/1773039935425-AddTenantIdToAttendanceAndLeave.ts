import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTenantIdToAttendanceAndLeave1773039935425 implements MigrationInterface {
  name = 'AddTenantIdToAttendanceAndLeave1773039935425';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hris"."time_events" ADD "tenant_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."leave_types" ADD "tenant_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."leave_requests" ADD "tenant_id" integer`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ecf323293c3e69ce2addfc875d" ON "hris"."time_events" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eb555086a7c9271e5206b1889c" ON "hris"."leave_types" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4c0727a131644d680e44c3d2aa" ON "hris"."leave_requests" ("tenant_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_4c0727a131644d680e44c3d2aa"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_eb555086a7c9271e5206b1889c"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_ecf323293c3e69ce2addfc875d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."leave_requests" DROP COLUMN "tenant_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."leave_types" DROP COLUMN "tenant_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."time_events" DROP COLUMN "tenant_id"`,
    );
  }
}
