import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateServiceConfigSchema1776607670495 implements MigrationInterface {
  name = 'CreateServiceConfigSchema1776607670495';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create service_config schema
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "service_config"`);

    // Create service_types table
    await queryRunner.query(`
            CREATE TABLE "service_config"."service_types" (
                "id" SERIAL NOT NULL,
                "tenant_id" integer NOT NULL,
                "code" character varying(64) NOT NULL,
                "name" character varying(255) NOT NULL,
                "description" text,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_by" integer,
                "updated_by" integer,
                "deleted_by" integer,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_service_types" PRIMARY KEY ("id")
            )
        `);

    // Create indexes for service_types
    await queryRunner.query(`
            CREATE INDEX "IDX_service_types_tenant" ON "service_config"."service_types" ("tenant_id")
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_service_types_tenant_code" ON "service_config"."service_types" ("tenant_id", "code") 
            WHERE "deleted_at" IS NULL
        `);

    // Create service_options table
    await queryRunner.query(`
            CREATE TABLE "service_config"."service_options" (
                "id" SERIAL NOT NULL,
                "tenant_id" integer NOT NULL,
                "code" character varying(64) NOT NULL,
                "name" character varying(255) NOT NULL,
                "description" text,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_by" integer,
                "updated_by" integer,
                "deleted_by" integer,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_service_options" PRIMARY KEY ("id")
            )
        `);

    // Create indexes for service_options
    await queryRunner.query(`
            CREATE INDEX "IDX_service_options_tenant" ON "service_config"."service_options" ("tenant_id")
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_service_options_tenant_code" ON "service_config"."service_options" ("tenant_id", "code") 
            WHERE "deleted_at" IS NULL
        `);

    // Create service_conditions table
    await queryRunner.query(`
            CREATE TABLE "service_config"."service_conditions" (
                "id" SERIAL NOT NULL,
                "tenant_id" integer NOT NULL,
                "code" character varying(64) NOT NULL,
                "name" character varying(255) NOT NULL,
                "values" jsonb NOT NULL DEFAULT '[]',
                "is_active" boolean NOT NULL DEFAULT true,
                "created_by" integer,
                "updated_by" integer,
                "deleted_by" integer,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_service_conditions" PRIMARY KEY ("id")
            )
        `);

    // Create indexes for service_conditions
    await queryRunner.query(`
            CREATE INDEX "IDX_service_conditions_tenant" ON "service_config"."service_conditions" ("tenant_id")
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_service_conditions_tenant_code" ON "service_config"."service_conditions" ("tenant_id", "code") 
            WHERE "deleted_at" IS NULL
        `);

    // Create service_configurations table
    await queryRunner.query(`
            CREATE TABLE "service_config"."service_configurations" (
                "id" SERIAL NOT NULL,
                "tenant_id" integer NOT NULL,
                "service_type_id" integer NOT NULL,
                "service_option_id" integer NOT NULL,
                "condition_key" character varying(64),
                "condition_value" character varying(255),
                "bom_id" integer,
                "price" numeric(18,2) NOT NULL DEFAULT '0.00',
                "is_active" boolean NOT NULL DEFAULT true,
                "created_by" integer,
                "updated_by" integer,
                "deleted_by" integer,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_service_configurations" PRIMARY KEY ("id")
            )
        `);

    // Create indexes for service_configurations
    await queryRunner.query(`
            CREATE INDEX "IDX_service_configurations_tenant" ON "service_config"."service_configurations" ("tenant_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_service_configurations_service_type" ON "service_config"."service_configurations" ("service_type_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_service_configurations_service_option" ON "service_config"."service_configurations" ("service_option_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_service_configurations_bom" ON "service_config"."service_configurations" ("bom_id")
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_service_configurations_lookup" ON "service_config"."service_configurations" 
            ("tenant_id", "service_type_id", "service_option_id", "condition_key", "condition_value") 
            WHERE "deleted_at" IS NULL
        `);

    // Add foreign key constraints
    await queryRunner.query(`
            ALTER TABLE "service_config"."service_configurations" 
            ADD CONSTRAINT "FK_service_configurations_service_type" 
            FOREIGN KEY ("service_type_id") REFERENCES "service_config"."service_types"("id") ON DELETE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "service_config"."service_configurations" 
            ADD CONSTRAINT "FK_service_configurations_service_option" 
            FOREIGN KEY ("service_option_id") REFERENCES "service_config"."service_options"("id") ON DELETE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "service_config"."service_configurations" 
            ADD CONSTRAINT "FK_service_configurations_bom" 
            FOREIGN KEY ("bom_id") REFERENCES "operations"."boms"("id") ON DELETE SET NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints first
    await queryRunner.query(`
            ALTER TABLE "service_config"."service_configurations" 
            DROP CONSTRAINT "FK_service_configurations_service_type"
        `);
    await queryRunner.query(`
            ALTER TABLE "service_config"."service_configurations" 
            DROP CONSTRAINT "FK_service_configurations_service_option"
        `);
    await queryRunner.query(`
            ALTER TABLE "service_config"."service_configurations" 
            DROP CONSTRAINT "FK_service_configurations_bom"
        `);

    // Drop tables
    await queryRunner.query(
      `DROP TABLE IF EXISTS "service_config"."service_configurations"`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "service_config"."service_conditions"`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "service_config"."service_options"`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "service_config"."service_types"`,
    );

    // Drop schema
    await queryRunner.query(`DROP SCHEMA IF EXISTS "service_config"`);
  }
}
