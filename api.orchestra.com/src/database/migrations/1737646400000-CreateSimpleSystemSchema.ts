import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSimpleSystemSchema1737646400000 implements MigrationInterface {
  name = 'CreateSimpleSystemSchema1737646400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create system schema if it doesn't exist
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "system"`);

    // Create companies table
    await queryRunner.query(`
      CREATE TABLE "system"."companies" (
        "id" SERIAL NOT NULL,
        "created_by" integer,
        "updated_by" integer,
        "deleted_by" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "name" character varying(150) NOT NULL,
        CONSTRAINT "PK_companies" PRIMARY KEY ("id")
      )
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "system"."users" (
        "id" SERIAL NOT NULL,
        "created_by" integer,
        "updated_by" integer,
        "deleted_by" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "company_id" integer,
        "email" character varying(255) NOT NULL,
        "password_hash" character varying(255) NOT NULL,
        "first_name" character varying(100),
        "last_name" character varying(100),
        "avatar_url" character varying(255),
        "is_system_admin" boolean NOT NULL DEFAULT false,
        "status" character varying(20) NOT NULL DEFAULT 'ACTIVE',
        "last_login_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    // Create roles table
    await queryRunner.query(`
      CREATE TABLE "system"."roles" (
        "id" SERIAL NOT NULL,
        "created_by" integer,
        "updated_by" integer,
        "deleted_by" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "company_id" integer,
        "name" character varying(50) NOT NULL,
        "description" text,
        "is_system_role" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_roles" PRIMARY KEY ("id")
      )
    `);

    // Create permissions table
    await queryRunner.query(`
      CREATE TABLE "system"."permissions" (
        "id" SERIAL NOT NULL,
        "created_by" integer,
        "updated_by" integer,
        "deleted_by" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "name" character varying(100) NOT NULL,
        "code" character varying(50) NOT NULL,
        "description" text,
        CONSTRAINT "PK_permissions" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_permissions_code" UNIQUE ("code")
      )
    `);

    // Create user_roles junction table
    await queryRunner.query(`
      CREATE TABLE "system"."user_roles" (
        "id" SERIAL NOT NULL,
        "created_by" integer,
        "updated_by" integer,
        "deleted_by" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "user_id" integer NOT NULL,
        "role_id" integer NOT NULL,
        CONSTRAINT "PK_user_roles" PRIMARY KEY ("id")
      )
    `);

    // Create role_permissions junction table
    await queryRunner.query(`
      CREATE TABLE "system"."role_permissions" (
        "id" SERIAL NOT NULL,
        "created_by" integer,
        "updated_by" integer,
        "deleted_by" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "role_id" integer NOT NULL,
        "permission_id" integer NOT NULL,
        CONSTRAINT "PK_role_permissions" PRIMARY KEY ("id")
      )
    `);

    // Create sessions table
    await queryRunner.query(`
      CREATE TABLE "system"."sessions" (
        "id" SERIAL NOT NULL,
        "created_by" integer,
        "updated_by" integer,
        "deleted_by" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "user_id" integer NOT NULL,
        "session_id" character varying(255) NOT NULL,
        "ip_address" character varying(45),
        "user_agent" text,
        "expires_at" TIMESTAMP NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_sessions" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_sessions_session_id" UNIQUE ("session_id")
      )
    `);

    // Add basic foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "system"."users" ADD CONSTRAINT "FK_users_company" FOREIGN KEY ("company_id") REFERENCES "system"."companies"("id") ON DELETE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_roles" ADD CONSTRAINT "FK_user_roles_user" FOREIGN KEY ("user_id") REFERENCES "system"."users"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_roles" ADD CONSTRAINT "FK_user_roles_role" FOREIGN KEY ("role_id") REFERENCES "system"."roles"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."role_permissions" ADD CONSTRAINT "FK_role_permissions_role" FOREIGN KEY ("role_id") REFERENCES "system"."roles"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."role_permissions" ADD CONSTRAINT "FK_role_permissions_permission" FOREIGN KEY ("permission_id") REFERENCES "system"."permissions"("id") ON DELETE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order due to foreign key constraints
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."sessions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."role_permissions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."user_roles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."permissions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."roles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."users"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."companies"`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS "system"`);
  }
}
