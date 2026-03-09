import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixLeaveRequestColumns1773045654536 implements MigrationInterface {
  name = 'FixLeaveRequestColumns1773045654536';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hris"."leave_requests" ADD "approved_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."leave_requests" ADD "comments" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hris"."leave_requests" DROP COLUMN "comments"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."leave_requests" DROP COLUMN "approved_at"`,
    );
  }
}
