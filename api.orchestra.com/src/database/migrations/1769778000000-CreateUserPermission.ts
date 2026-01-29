import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserPermission1769778000000 implements MigrationInterface {
  name = 'CreateUserPermission1769778000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "system"."user_permissions" (
        "id" SERIAL PRIMARY KEY,
        "created_by" integer,
        "updated_by" integer,
        "deleted_by" integer,
        "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" timestamp with time zone,
        "user_id" integer NOT NULL,
        "permission_id" integer NOT NULL,
        "type" varchar(10) NOT NULL DEFAULT 'GRANT',
        "granted_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
        "expires_at" timestamp with time zone,
        CONSTRAINT "fk_user_permissions_user" FOREIGN KEY ("user_id") REFERENCES "system"."users"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_user_permissions_permission" FOREIGN KEY ("permission_id") REFERENCES "system"."permissions"("id") ON DELETE CASCADE
      )
    `);

    // Create unique index
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "idx_user_permissions_user_permission" 
      ON "system"."user_permissions" ("user_id", "permission_id") 
      WHERE "deleted_at" IS NULL
    `);

    // Create individual indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_user_permissions_user_id" 
      ON "system"."user_permissions" ("user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_user_permissions_permission_id" 
      ON "system"."user_permissions" ("permission_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."user_permissions"`);
  }
}
