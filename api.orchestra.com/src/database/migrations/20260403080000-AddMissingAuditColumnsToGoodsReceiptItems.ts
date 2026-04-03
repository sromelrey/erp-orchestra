import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMissingAuditColumnsToGoodsReceiptItems20260403080000 implements MigrationInterface {
  name = 'AddMissingAuditColumnsToGoodsReceiptItems20260403080000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add missing audit columns to goods_receipt_items table
    await queryRunner.query(
      `ALTER TABLE "operations"."goods_receipt_items" ADD COLUMN IF NOT EXISTS "created_by" INT`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."goods_receipt_items" ADD COLUMN IF NOT EXISTS "updated_by" INT`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."goods_receipt_items" ADD COLUMN IF NOT EXISTS "deleted_by" INT`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."goods_receipt_items" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP WITHOUT TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the columns
    await queryRunner.query(
      `ALTER TABLE "operations"."goods_receipt_items" DROP COLUMN IF EXISTS "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."goods_receipt_items" DROP COLUMN IF EXISTS "deleted_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."goods_receipt_items" DROP COLUMN IF EXISTS "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."goods_receipt_items" DROP COLUMN IF EXISTS "created_by"`,
    );
  }
}
