import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSystemModuleEntity1769507268619 implements MigrationInterface {
  name = 'UpdateSystemModuleEntity1769507268619';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "system"."modules_type_enum" AS ENUM('MODULE', 'SUB_MODULE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."modules" ADD "type" "system"."modules_type_enum" NOT NULL DEFAULT 'MODULE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."modules" ADD "parent_id" integer`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_e8253e305f83f9d9cc134cd4b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" ALTER COLUMN "module" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" ALTER COLUMN "resource" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" ALTER COLUMN "action" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" ALTER COLUMN "slug" DROP DEFAULT`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_1afbd0213089610355c3021e37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."roles" ALTER COLUMN "name" TYPE character varying(100)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e8253e305f83f9d9cc134cd4b3" ON "system"."permissions" ("module", "resource", "action") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1afbd0213089610355c3021e37" ON "system"."roles" ("tenant_id", "name") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."modules" ADD CONSTRAINT "FK_a1bd9c21d7179d0b411dbaf9a55" FOREIGN KEY ("parent_id") REFERENCES "system"."modules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "system"."modules" DROP CONSTRAINT "FK_a1bd9c21d7179d0b411dbaf9a55"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_1afbd0213089610355c3021e37"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_e8253e305f83f9d9cc134cd4b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."roles" ALTER COLUMN "name" TYPE character varying(50)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1afbd0213089610355c3021e37" ON "system"."roles" ("name", "tenant_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" ALTER COLUMN "slug" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" ALTER COLUMN "action" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" ALTER COLUMN "resource" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" ALTER COLUMN "module" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e8253e305f83f9d9cc134cd4b3" ON "system"."permissions" ("action", "module", "resource") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."modules" DROP COLUMN "parent_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."modules" DROP COLUMN "type"`,
    );
    await queryRunner.query(`DROP TYPE "system"."modules_type_enum"`);
  }
}
