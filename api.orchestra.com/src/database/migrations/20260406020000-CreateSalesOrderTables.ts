import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSalesOrderTables20260406020000 implements MigrationInterface {
  name = 'CreateSalesOrderTables20260406020000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create sales_order_status enum
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_type
          WHERE typname = 'sales_order_status'
          AND typnamespace = 'operations'::regnamespace
        ) THEN
          CREATE TYPE "operations"."sales_order_status" AS ENUM (
            'DRAFT',
            'CONFIRMED',
            'SHIPPED',
            'DELIVERED',
            'CANCELLED'
          );
        END IF;
      END$$;
    `);

    // Create sales_orders table
    await queryRunner.query(`
      CREATE TABLE "operations"."sales_orders" (
        "id" SERIAL PRIMARY KEY,
        "created_by" integer,
        "updated_by" integer,
        "deleted_by" integer,
        "tenant_id" integer NOT NULL,
        "order_no" varchar(50) NOT NULL UNIQUE,
        "customer_id" integer NOT NULL,
        "customer_name" varchar(255) NOT NULL,
        "order_date" date NOT NULL,
        "delivery_date" date,
        "status" "operations"."sales_order_status" DEFAULT 'DRAFT',
        "total_amount" numeric(12,2) DEFAULT 0,
        "discount_amount" numeric(12,2) DEFAULT 0,
        "tax_amount" numeric(12,2) DEFAULT 0,
        "final_amount" numeric(12,2) DEFAULT 0,
        "notes" text,
        "approved_by" integer,
        "approved_at" timestamp,
        "shipped_at" timestamp,
        "shipped_by" integer,
        "delivered_at" timestamp,
        "delivered_by" integer,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" timestamp
      );
    `);

    // Create indexes for sales_orders
    await queryRunner.query(`
      CREATE INDEX "idx_sales_orders_tenant_id" ON "operations"."sales_orders" ("tenant_id") WHERE deleted_at IS NULL;
      CREATE INDEX "idx_sales_orders_customer_id" ON "operations"."sales_orders" ("customer_id") WHERE deleted_at IS NULL;
      CREATE INDEX "idx_sales_orders_status" ON "operations"."sales_orders" ("status") WHERE deleted_at IS NULL;
      CREATE INDEX "idx_sales_orders_order_date" ON "operations"."sales_orders" ("order_date") WHERE deleted_at IS NULL;
      CREATE INDEX "idx_sales_orders_order_no" ON "operations"."sales_orders" ("order_no");
    `);

    // Create sales_order_items table
    await queryRunner.query(`
      CREATE TABLE "operations"."sales_order_items" (
        "id" SERIAL PRIMARY KEY,
        "created_by" integer,
        "updated_by" integer,
        "deleted_by" integer,
        "sales_order_id" integer NOT NULL,
        "item_id" integer NOT NULL,
        "item_code" varchar(50) NOT NULL,
        "item_name" varchar(255) NOT NULL,
        "quantity" numeric(15,6) NOT NULL,
        "unit_of_measure_id" integer NOT NULL,
        "unit_of_measure_code" varchar(20) NOT NULL,
        "unit_price" numeric(10,2) NOT NULL,
        "discount_percent" numeric(5,2) DEFAULT 0,
        "discount_amount" numeric(12,2) DEFAULT 0,
        "tax_percent" numeric(5,2) DEFAULT 0,
        "tax_amount" numeric(12,2) DEFAULT 0,
        "line_total" numeric(12,2) NOT NULL,
        "delivered_quantity" numeric(15,6) DEFAULT 0,
        "allocated_quantity" numeric(15,6) DEFAULT 0,
        "warehouse_id" integer NOT NULL,
        "warehouse_name" varchar(255) NOT NULL,
        "location_id" integer NOT NULL,
        "location_name" varchar(255) NOT NULL,
        "notes" text,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" timestamp
      );
    `);

    // Create indexes for sales_order_items
    await queryRunner.query(`
      CREATE INDEX "idx_sales_order_items_sales_order_id" ON "operations"."sales_order_items" ("sales_order_id") WHERE deleted_at IS NULL;
      CREATE INDEX "idx_sales_order_items_item_id" ON "operations"."sales_order_items" ("item_id") WHERE deleted_at IS NULL;
    `);

    // Foreign key constraints will be added when referenced tables are created
    // Skipping tenant_id, customer_id, approved_by, shipped_by, delivered_by FKs for now

    // Add trigger for updated_at
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION "operations"."update_sales_orders_updated_at"()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER "sales_orders_updated_at"
        BEFORE UPDATE ON "operations"."sales_orders"
        FOR EACH ROW
        EXECUTE FUNCTION "operations"."update_sales_orders_updated_at"();
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION "operations"."update_sales_order_items_updated_at"()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER "sales_order_items_updated_at"
        BEFORE UPDATE ON "operations"."sales_order_items"
        FOR EACH ROW
        EXECUTE FUNCTION "operations"."update_sales_order_items_updated_at"();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop triggers
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS "sales_order_items_updated_at" ON "operations"."sales_order_items";`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS "sales_orders_updated_at" ON "operations"."sales_orders";`,
    );

    // Drop functions
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS "operations"."update_sales_order_items_updated_at";`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS "operations"."update_sales_orders_updated_at";`,
    );

    // Drop foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" DROP CONSTRAINT "fk_sales_order_items_unit_of_measure_id";`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" DROP CONSTRAINT "fk_sales_order_items_item_id";`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_order_items" DROP CONSTRAINT "fk_sales_order_items_sales_order_id";`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" DROP CONSTRAINT "fk_sales_orders_delivered_by";`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" DROP CONSTRAINT "fk_sales_orders_shipped_by";`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" DROP CONSTRAINT "fk_sales_orders_approved_by";`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."sales_orders" DROP CONSTRAINT "fk_sales_orders_tenant_id";`,
    );

    // Drop indexes
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_sales_order_items_item_id";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_sales_order_items_sales_order_id";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_sales_orders_order_no";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_sales_orders_order_date";`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_sales_orders_status";`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_sales_orders_customer_id";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_sales_orders_tenant_id";`,
    );

    // Drop tables
    await queryRunner.query(`DROP TABLE "operations"."sales_order_items";`);
    await queryRunner.query(`DROP TABLE "operations"."sales_orders";`);

    // Drop enum
    await queryRunner.query(
      `DROP TYPE IF EXISTS "operations"."sales_order_status";`,
    );
  }
}
