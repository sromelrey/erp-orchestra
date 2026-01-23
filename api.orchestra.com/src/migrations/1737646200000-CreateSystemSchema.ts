import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSystemSchema1737646200000 implements MigrationInterface {
  name = 'CreateSystemSchema1737646200000';

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
        CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id")
      )
    `);

    // Create indexes for companies
    await queryRunner.query(
      `CREATE INDEX "IDX_ca4df9b8772f1c1a02f3a56055" ON "system"."companies" ("created_by")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b559ae26b6f801536d28109453" ON "system"."companies" ("created_at")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_c6789e13af843fad28865984b5" ON "system"."companies" ("name") WHERE deleted_at IS NULL`,
    );

    // Create plans table
    await queryRunner.query(`
      CREATE TABLE "system"."plans" (
        "id" SERIAL NOT NULL,
        "created_by" integer,
        "updated_by" integer,
        "deleted_by" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "name" character varying(50) NOT NULL,
        "monthlyPrice" numeric(12,2) NOT NULL DEFAULT '0',
        "max_users" integer NOT NULL DEFAULT '5',
        CONSTRAINT "UQ_253d25dae4c94ee913bc5ec4850" UNIQUE ("name"),
        CONSTRAINT "PK_3720521a81c7c24fe9b7202ba61" PRIMARY KEY ("id")
      )
    `);

    // Create indexes for plans
    await queryRunner.query(
      `CREATE INDEX "IDX_7c5f6f43e87905766afe5590b5" ON "system"."plans" ("created_by")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_53619d9547e06c47ded0fe4398" ON "system"."plans" ("created_at")`,
    );

    // Create modules table
    await queryRunner.query(`
      CREATE TABLE "system"."modules" (
        "id" SERIAL NOT NULL,
        "created_by" integer,
        "updated_by" integer,
        "deleted_by" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "name" character varying(50) NOT NULL,
        "code" character varying(20) NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        CONSTRAINT "UQ_8cd1abde4b70e59644c98668c06" UNIQUE ("name"),
        CONSTRAINT "UQ_25b42b11ac8b697cdb2eddcef1a" UNIQUE ("code"),
        CONSTRAINT "PK_7dbefd488bd96c5bf31f0ce0c95" PRIMARY KEY ("id")
      )
    `);

    // Create indexes for modules
    await queryRunner.query(
      `CREATE INDEX "IDX_a1b8ab9cfd9c4d019a2729dd07" ON "system"."modules" ("created_by")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ddfe513651086b094687837eed" ON "system"."modules" ("created_at")`,
    );

    // Create tenants table
    await queryRunner.query(`
      CREATE TABLE "system"."tenants" (
        "id" SERIAL NOT NULL,
        "created_by" integer,
        "updated_by" integer,
        "deleted_by" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "plan_id" integer,
        "name" character varying(100) NOT NULL,
        "slug" character varying(50) NOT NULL,
        "domain" character varying(255),
        "is_active" boolean NOT NULL DEFAULT true,
        CONSTRAINT "UQ_097154b18fc5e679733c37b115" UNIQUE ("slug"),
        CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id")
      )
    `);

    // Create indexes for tenants
    await queryRunner.query(
      `CREATE INDEX "IDX_362ad28591b5e679733c37b115" ON "system"."tenants" ("created_by")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1dba291f7611c0f2388055c40b" ON "system"."tenants" ("created_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2310ecc5cb8be427097154b18f" ON "system"."tenants" ("slug")`,
    );

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
        CONSTRAINT "PK_cace4a159ff9f0712e5f36222fa" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_97672ac8f789a421b799b628da" UNIQUE ("email")
      )
    `);

    // Create indexes for users
    await queryRunner.query(
      `CREATE INDEX "IDX_e12875dfb3b1d92d7dd745b5f9" ON "system"."users" ("company_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_97672ac8f789a421b799b628da" ON "system"."users" ("email") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7e5b9c8b8f8b8f8b8f8b8f8b8f8b" ON "system"."users" ("company_id") WHERE deleted_at IS NULL`,
    );

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
        CONSTRAINT "UQ_roles_name" UNIQUE ("name"),
        CONSTRAINT "PK_roles" PRIMARY KEY ("id")
      )
    `);

    // Create indexes for roles
    await queryRunner.query(
      `CREATE INDEX "IDX_roles_company_id" ON "system"."roles" ("company_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_roles_name_active" ON "system"."roles" ("name") WHERE deleted_at IS NULL`,
    );

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
        "module_id" integer,
        CONSTRAINT "UQ_permissions_code" UNIQUE ("code"),
        CONSTRAINT "PK_permissions" PRIMARY KEY ("id")
      )
    `);

    // Create indexes for permissions
    await queryRunner.query(
      `CREATE INDEX "IDX_permissions_module_id" ON "system"."permissions" ("module_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_permissions_code_active" ON "system"."permissions" ("code") WHERE deleted_at IS NULL`,
    );

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
        "assigned_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "expires_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id")
      )
    `);

    // Create indexes for user_roles
    await queryRunner.query(
      `CREATE INDEX "IDX_87b8888186ca9769c960e926870" ON "system"."user_roles" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b23c65e50a758245a33ee35fda1" ON "system"."user_roles" ("role_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_87b8888186ca9769c960e926870" ON "system"."user_roles" ("user_id", "role_id") WHERE deleted_at IS NULL`,
    );

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
        CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id")
      )
    `);

    // Create indexes for role_permissions
    await queryRunner.query(
      `CREATE INDEX "IDX_178199805b901ccd220ab7740ec" ON "system"."role_permissions" ("role_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_17022daf3f885f7d35423e9971e" ON "system"."role_permissions" ("permission_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_7953b8be5ad582c83dd350539d" ON "system"."role_permissions" ("role_id", "permission_id") WHERE deleted_at IS NULL`,
    );

    // Create menus table
    await queryRunner.query(`
      CREATE TABLE "system"."menus" (
        "id" SERIAL NOT NULL,
        "created_by" integer,
        "updated_by" integer,
        "deleted_by" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "parent_id" integer,
        "module_id" integer,
        "permission_id" integer,
        "name" character varying(100) NOT NULL,
        "icon" character varying(50),
        "route" character varying(255),
        "sort_order" integer,
        "is_visible" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_menus" PRIMARY KEY ("id")
      )
    `);

    // Create indexes for menus
    await queryRunner.query(
      `CREATE INDEX "IDX_menus_module_id" ON "system"."menus" ("module_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_menus_parent_id" ON "system"."menus" ("parent_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_menus_permission_id" ON "system"."menus" ("permission_id")`,
    );

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
        CONSTRAINT "UQ_sessions_session_id" UNIQUE ("session_id"),
        CONSTRAINT "PK_sessions" PRIMARY KEY ("id")
      )
    `);

    // Create indexes for sessions
    await queryRunner.query(
      `CREATE INDEX "IDX_sessions_user_id" ON "system"."sessions" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_sessions_expires_at" ON "system"."sessions" ("expires_at")`,
    );

    // Create plan_modules junction table
    await queryRunner.query(`
      CREATE TABLE "system"."plan_modules" (
        "plan_id" integer NOT NULL,
        "module_id" integer NOT NULL,
        CONSTRAINT "PK_c31e49744a1a3e2949ffa18535f" PRIMARY KEY ("plan_id", "module_id")
      )
    `);

    // Create indexes for plan_modules
    await queryRunner.query(
      `CREATE INDEX "IDX_d643038a968dcd54f57206e4c0" ON "system"."plan_modules" ("plan_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order due to foreign key constraints
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."plan_modules"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."sessions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."menus"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."role_permissions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."user_roles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."permissions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."roles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."users"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."tenants"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."modules"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."plans"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "system"."companies"`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS "system"`);
  }
}
