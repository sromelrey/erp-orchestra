import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMissingColumnsToGoodsReceiptItems1735923100000 implements MigrationInterface {
  name = 'AddMissingColumnsToGoodsReceiptItems1735923100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if columns exist before adding them
    const table = await queryRunner.getTable('operations.goods_receipt_items');

    if (table && !table.findColumnByName('created_by')) {
      await queryRunner.query(
        `ALTER TABLE "operations"."goods_receipt_items" ADD COLUMN "created_by" INT`,
      );
    }

    if (table && !table.findColumnByName('updated_by')) {
      await queryRunner.query(
        `ALTER TABLE "operations"."goods_receipt_items" ADD COLUMN "updated_by" INT`,
      );
    }

    if (table && !table.findColumnByName('deleted_by')) {
      await queryRunner.query(
        `ALTER TABLE "operations"."goods_receipt_items" ADD COLUMN "deleted_by" INT`,
      );
    }

    if (table && !table.findColumnByName('deleted_at')) {
      await queryRunner.query(
        `ALTER TABLE "operations"."goods_receipt_items" ADD COLUMN "deleted_at" TIMESTAMP WITHOUT TIME ZONE`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop columns if they exist
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
