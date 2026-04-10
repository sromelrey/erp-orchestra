import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteOldGoodsReceiptPermissions1743950500000 implements MigrationInterface {
  name = 'DeleteOldGoodsReceiptPermissions1743950500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, check if the new permissions exist and get their IDs
    const newPermissions = await queryRunner.query(`
      SELECT slug, id FROM "system"."permissions" 
      WHERE slug LIKE 'operations.goods-receipt.%'
    `);

    const newPermissionMap = new Map(
      newPermissions.map((p: any) => [p.slug, p.id]),
    );

    // Update role_permissions to reference the new permissions
    const mappings = [
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
      },
      {
        oldSlug: 'goods-receipt.cancel',
        newSlug: 'operations.goods-receipt.cancel',
      },
      {
        oldSlug: 'goods-receipt.delete',
        newSlug: 'operations.goods-receipt.delete',
      },
    ];

    for (const { oldSlug, newSlug } of mappings) {
      const newPermissionId = newPermissionMap.get(newSlug);
      if (newPermissionId) {
        await queryRunner.query(
          `
          UPDATE "system"."role_permissions" 
          SET permission_id = $1
          WHERE permission_id IN (
            SELECT id FROM "system"."permissions" WHERE slug = $2
          )
        `,
          [newPermissionId, oldSlug],
        );
      }
    }

    // Now delete the old permissions
    await queryRunner.query(
      `DELETE FROM "system"."permissions" WHERE slug IN (
        'goods-receipt.create',
        'goods-receipt.view', 
        'goods-receipt.update',
        'goods-receipt.approve',
        'goods-receipt.cancel',
        'goods-receipt.delete'
      )`,
    );

    console.log(
      '  ✅ Deleted old goods-receipt permissions and updated role references',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('  ⚠️  Down migration not implemented for this migration');
  }
}
