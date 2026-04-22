import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAddonsPermissions20260421080000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "system"."permissions" (module, resource, action, slug, name, is_active, created_at, updated_at) VALUES
      ('service-config', 'addons', 'create', 'addons.create', 'Create Add-ons', true, NOW(), NOW()),
      ('service-config', 'addons', 'view', 'addons.view', 'View Add-ons', true, NOW(), NOW()),
      ('service-config', 'addons', 'update', 'addons.update', 'Update Add-ons', true, NOW(), NOW()),
      ('service-config', 'addons', 'delete', 'addons.delete', 'Delete Add-ons', true, NOW(), NOW()),
      ('service-config', 'addon-rules', 'view', 'addons.rules.view', 'View Inclusion Rules', true, NOW(), NOW()),
      ('service-config', 'addon-rules', 'manage', 'addons.rules.manage', 'Manage Inclusion Rules', true, NOW(), NOW())
      ON CONFLICT (slug) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "system"."permissions" 
      WHERE slug IN (
        'addons.create',
        'addons.view',
        'addons.update',
        'addons.delete',
        'addons.rules.view',
        'addons.rules.manage'
      );
    `);
  }
}
