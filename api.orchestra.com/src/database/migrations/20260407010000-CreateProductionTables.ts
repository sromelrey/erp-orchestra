import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductionTables20260407010000 implements MigrationInterface {
  name = 'CreateProductionTables20260407010000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create production_status enum
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_type
          WHERE typname = 'production_status'
          AND typnamespace = 'operations'::regnamespace
        ) THEN
          CREATE TYPE "operations"."production_status" AS ENUM (
            'PLANNED',
            'IN_PROGRESS',
            'COMPLETED',
            'CANCELLED'
          );
        END IF;
      END$$;
    `);

    // Create production_batches table
    await queryRunner.query(`
      CREATE TABLE "operations"."production_batches" (
        "id" SERIAL PRIMARY KEY,
        "created_by" integer,
        "updated_by" integer,
        "deleted_by" integer,
        "tenant_id" integer NOT NULL,
        "batch_no" varchar(50) NOT NULL UNIQUE,
        "bom_id" integer NOT NULL,
        "planned_quantity" numeric(15,6) NOT NULL,
        "actual_quantity" numeric(15,6),
        "status" "operations"."production_status" DEFAULT 'PLANNED',
        "start_date" timestamp,
        "end_date" timestamp,
        "notes" text,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" timestamp
      );
    `);

    // Create indexes for production_batches
    await queryRunner.query(`
      CREATE INDEX "idx_production_batches_tenant_id" ON "operations"."production_batches" ("tenant_id") WHERE deleted_at IS NULL;
      CREATE INDEX "idx_production_batches_bom_id" ON "operations"."production_batches" ("bom_id") WHERE deleted_at IS NULL;
      CREATE INDEX "idx_production_batches_status" ON "operations"."production_batches" ("status") WHERE deleted_at IS NULL;
      CREATE INDEX "idx_production_batches_batch_no" ON "operations"."production_batches" ("batch_no");
    `);

    // Create production_work_orders table
    await queryRunner.query(`
      CREATE TABLE "operations"."production_work_orders" (
        "id" SERIAL PRIMARY KEY,
        "created_by" integer,
        "updated_by" integer,
        "deleted_by" integer,
        "batch_id" integer NOT NULL,
        "step_name" varchar(100) NOT NULL,
        "status" "operations"."production_status" DEFAULT 'PLANNED',
        "started_at" timestamp,
        "finished_at" timestamp,
        "notes" text,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" timestamp
      );
    `);

    // Create indexes for production_work_orders
    await queryRunner.query(`
      CREATE INDEX "idx_production_work_orders_batch_id" ON "operations"."production_work_orders" ("batch_id") WHERE deleted_at IS NULL;
      CREATE INDEX "idx_production_work_orders_status" ON "operations"."production_work_orders" ("status") WHERE deleted_at IS NULL;
    `);

    // Create production_consumption table
    await queryRunner.query(`
      CREATE TABLE "operations"."production_consumption" (
        "id" SERIAL PRIMARY KEY,
        "created_by" integer,
        "updated_by" integer,
        "deleted_by" integer,
        "batch_id" integer NOT NULL,
        "item_id" integer NOT NULL,
        "planned_quantity" numeric(15,6) NOT NULL,
        "actual_quantity" numeric(15,6),
        "waste_quantity" numeric(15,6) DEFAULT 0,
        "tenant_id" integer NOT NULL,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" timestamp
      );
    `);

    // Create indexes for production_consumption
    await queryRunner.query(`
      CREATE INDEX "idx_production_consumption_batch_id" ON "operations"."production_consumption" ("batch_id") WHERE deleted_at IS NULL;
      CREATE INDEX "idx_production_consumption_item_id" ON "operations"."production_consumption" ("item_id") WHERE deleted_at IS NULL;
    `);

    // Add trigger for updated_at on production_batches
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION "operations"."update_production_batches_updated_at"()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER "production_batches_updated_at"
        BEFORE UPDATE ON "operations"."production_batches"
        FOR EACH ROW
        EXECUTE FUNCTION "operations"."update_production_batches_updated_at"();
    `);

    // Add trigger for updated_at on production_work_orders
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION "operations"."update_production_work_orders_updated_at"()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER "production_work_orders_updated_at"
        BEFORE UPDATE ON "operations"."production_work_orders"
        FOR EACH ROW
        EXECUTE FUNCTION "operations"."update_production_work_orders_updated_at"();
    `);

    // Add trigger for updated_at on production_consumption
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION "operations"."update_production_consumption_updated_at"()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER "production_consumption_updated_at"
        BEFORE UPDATE ON "operations"."production_consumption"
        FOR EACH ROW
        EXECUTE FUNCTION "operations"."update_production_consumption_updated_at"();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop triggers
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS "production_consumption_updated_at" ON "operations"."production_consumption";`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS "production_work_orders_updated_at" ON "operations"."production_work_orders";`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS "production_batches_updated_at" ON "operations"."production_batches";`,
    );

    // Drop functions
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS "operations"."update_production_consumption_updated_at";`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS "operations"."update_production_work_orders_updated_at";`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS "operations"."update_production_batches_updated_at";`,
    );

    // Drop indexes
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_production_consumption_item_id";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_production_consumption_batch_id";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_production_work_orders_status";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_production_work_orders_batch_id";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_production_batches_batch_no";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_production_batches_status";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_production_batches_bom_id";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_production_batches_tenant_id";`,
    );

    // Drop tables
    await queryRunner.query(
      `DROP TABLE "operations"."production_consumption";`,
    );
    await queryRunner.query(
      `DROP TABLE "operations"."production_work_orders";`,
    );
    await queryRunner.query(`DROP TABLE "operations"."production_batches";`);

    // Drop enum
    await queryRunner.query(
      `DROP TYPE IF EXISTS "operations"."production_status";`,
    );
  }
}
