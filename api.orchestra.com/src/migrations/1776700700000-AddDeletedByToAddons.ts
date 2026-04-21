import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedByToAddons1649999999999 implements MigrationInterface {
  name = 'AddDeletedByToAddons1649999999999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "addons" ADD "deleted_by" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "addons" DROP COLUMN "deleted_by"`);
  }
}
