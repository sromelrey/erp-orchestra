import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMaterialsImportExportManagePermissions20260321140000 implements MigrationInterface {
  name = 'AddMaterialsImportExportManagePermissions20260321140000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const permissions = [
      {
        module: 'operations',
        resource: 'materials',
        action: 'manage',
        slug: 'operations.materials.manage',
        name: 'Manage Materials',
      },
      {
        module: 'operations',
        resource: 'materials',
        action: 'import',
        slug: 'operations.materials.import',
        name: 'Import Materials',
      },
      {
        module: 'operations',
        resource: 'materials',
        action: 'export',
        slug: 'operations.materials.export',
        name: 'Export Materials',
      },
    ];

    for (const perm of permissions) {
      const existing = await queryRunner.query(
        `SELECT id FROM "system"."permissions" WHERE slug = $1`,
        [perm.slug],
      );

      if (existing.length === 0) {
        await queryRunner.query(
          `INSERT INTO "system"."permissions" (
            "module",
            "resource",
            "action",
            "slug",
            "name",
            "is_active",
            "created_at",
            "updated_at"
          ) VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())`,
          [perm.module, perm.resource, perm.action, perm.slug, perm.name],
        );
        console.log(`  ✅ Created permission: ${perm.slug}`);
      } else {
        console.log(
          `  ⏭️  Permission "${perm.slug}" already exists, skipping...`,
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const slugs = [
      'operations.materials.manage',
      'operations.materials.import',
      'operations.materials.export',
    ];

    for (const slug of slugs) {
      await queryRunner.query(
        `DELETE FROM "system"."permissions" WHERE slug = $1`,
        [slug],
      );
    }
  }
}
