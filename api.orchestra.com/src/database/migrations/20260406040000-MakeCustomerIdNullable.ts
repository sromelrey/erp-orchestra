import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeCustomerIdNullable20260406040000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Make customer_id nullable in sales_orders table
    await queryRunner.query(`
      ALTER TABLE "operations"."sales_orders"
      ALTER COLUMN "customer_id" DROP NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Make customer_id not null in sales_orders table
    await queryRunner.query(`
      ALTER TABLE "operations"."sales_orders"
      ALTER COLUMN "customer_id" SET NOT NULL;
    `);
  }
}
