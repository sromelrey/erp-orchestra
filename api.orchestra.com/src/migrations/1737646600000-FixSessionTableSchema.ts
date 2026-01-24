import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixSessionTableSchema1737646600000 implements MigrationInterface {
  name = 'FixSessionTableSchema1737646600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the incorrect table if it exists (e.g. if created by sync or previous mismatch)
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."session" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."sessions" CASCADE`); // In case plural still hangs around

    // Create the correct table for connect-typeorm
    await queryRunner.query(`
            CREATE TABLE "system"."session" (
                "id" VARCHAR(255) NOT NULL,
                "expiredAt" bigint NOT NULL,
                "json" text NOT NULL,
                "destroyedAt" TIMESTAMP,
                CONSTRAINT "PK_session_id" PRIMARY KEY ("id")
            )
        `);

    // Create index for expiration
    await queryRunner.query(`
            CREATE INDEX "IDX_session_expiredAt" ON "system"."session" ("expiredAt")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "system"."session"`);
  }
}
