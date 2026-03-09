import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLeaveTypeConstraints1773046000000 implements MigrationInterface {
  name = 'AddLeaveTypeConstraints1773046000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hris"."leave_types" ADD "min_days_advance" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."leave_types" ADD "allow_past_dates" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."leave_types" ADD "allow_same_day" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hris"."leave_types" DROP COLUMN "allow_same_day"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."leave_types" DROP COLUMN "allow_past_dates"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."leave_types" DROP COLUMN "min_days_advance"`,
    );
  }
}
