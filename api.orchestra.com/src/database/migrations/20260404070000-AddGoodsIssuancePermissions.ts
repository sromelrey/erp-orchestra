import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGoodsIssuancePermissions20260404070000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "system"."permissions" (module, resource, action, slug, name, is_active, created_at, updated_at) VALUES
      ('operations', 'goods-issuance', 'create', 'goods-issuance.create', 'Create Goods Issuance', true, NOW(), NOW()),
      ('operations', 'goods-issuance', 'view', 'goods-issuance.view', 'View Goods Issuance', true, NOW(), NOW()),
      ('operations', 'goods-issuance', 'update', 'goods-issuance.update', 'Update Goods Issuance', true, NOW(), NOW()),
      ('operations', 'goods-issuance', 'approve', 'goods-issuance.approve', 'Approve Goods Issuance', true, NOW(), NOW()),
      ('operations', 'goods-issuance', 'cancel', 'goods-issuance.cancel', 'Cancel Goods Issuance', true, NOW(), NOW()),
      ('operations', 'goods-issuance', 'delete', 'goods-issuance.delete', 'Delete Goods Issuance', true, NOW(), NOW());
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "system"."permissions" 
      WHERE slug IN (
        'goods-issuance.create',
        'goods-issuance.view',
        'goods-issuance.update',
        'goods-issuance.approve',
        'goods-issuance.cancel',
        'goods-issuance.delete'
      );
    `);
  }
}
