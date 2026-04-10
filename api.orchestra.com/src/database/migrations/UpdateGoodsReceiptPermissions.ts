import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGoodsReceiptPermissions1743950400000 implements MigrationInterface {
  name = 'UpdateGoodsReceiptPermissions1743950400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update existing goods-receipt permissions to have the correct slug format
    const updates = [
      {
        oldSlug: 'goods-receipt.create',
        newSlug: 'operations.goods-receipt.create',
      },
      {
        oldSlug: 'goods-receipt.view',
        newSlug: 'operations.goods-receipt.view',
      },
      {
        oldSlug: 'goods-receipt.update',
        newSlug: 'operations.goods-receipt.update',
      },
      {
        oldSlug: 'goods-receipt.approve',
        newSlug: 'operations.goods-receipt.confirm',
      }, // Changed approve to confirm
      {
        oldSlug: 'goods-receipt.cancel',
        newSlug: 'operations.goods-receipt.cancel',
      },
      {
        oldSlug: 'goods-receipt.delete',
        newSlug: 'operations.goods-receipt.delete',
      },
    ];

    for (const { oldSlug, newSlug } of updates) {
      await queryRunner.query(
        `UPDATE "system"."permissions" SET slug = $1 WHERE slug = $2`,
        [newSlug, oldSlug],
      );
      console.log(`  ✅ Updated permission slug: ${oldSlug} -> ${newSlug}`);
    }

    // Also update the name for the approve -> confirm change
    await queryRunner.query(
      `UPDATE "system"."permissions" SET name = 'Confirm Goods Receipt' WHERE slug = 'operations.goods-receipt.confirm'`,
    );

    // Update the action for the approve -> confirm change
    await queryRunner.query(
      `UPDATE "system"."permissions" SET action = 'confirm' WHERE slug = 'operations.goods-receipt.confirm'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert the changes
    const updates = [
      {
        newSlug: 'goods-receipt.create',
        oldSlug: 'operations.goods-receipt.create',
      },
      {
        newSlug: 'goods-receipt.view',
        oldSlug: 'operations.goods-receipt.view',
      },
      {
        newSlug: 'goods-receipt.update',
        oldSlug: 'operations.goods-receipt.update',
      },
      {
        newSlug: 'goods-receipt.approve',
        oldSlug: 'operations.goods-receipt.confirm',
      },
      {
        newSlug: 'goods-receipt.cancel',
        oldSlug: 'operations.goods-receipt.cancel',
      },
      {
        newSlug: 'goods-receipt.delete',
        oldSlug: 'operations.goods-receipt.delete',
      },
    ];

    for (const { newSlug, oldSlug } of updates) {
      await queryRunner.query(
        `UPDATE "system"."permissions" SET slug = $1 WHERE slug = $2`,
        [newSlug, oldSlug],
      );
    }

    // Revert the name and action for the confirm -> approve change
    await queryRunner.query(
      `UPDATE "system"."permissions" SET name = 'Approve Goods Receipt', action = 'approve' WHERE slug = 'goods-receipt.approve'`,
    );
  }
}
