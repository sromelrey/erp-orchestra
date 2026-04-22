import { DataSource } from 'typeorm';
import { Seeder } from './seeder.config';
import { hris_seeder } from './permissions-hris.seeder';
import { operations_seeder } from './permissions-operations.seeder';
import { inventory_seeder } from './permissions-inventory.seeder';
import { system_seeder } from './permissions-system.seeder';
import { production_seeder } from './permissions-production.seeder';
import { service_config_seeder } from './permissions-service-config.seeder';
import { addons_seeder } from './permissions-addons.seeder';

/**
 * Seeds the permissions table with standard system permissions.
 */
export const PermissionsSeeder: Seeder = {
  name: 'PermissionsSeeder',

  async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    try {
      const permissions = [
        ...hris_seeder,
        ...operations_seeder,
        ...inventory_seeder,
        ...system_seeder,
        ...production_seeder,
        ...service_config_seeder,
        ...addons_seeder,
      ];

      for (const perm of permissions) {
        const existing = await queryRunner.query(
          `SELECT id FROM "system"."permissions" WHERE slug = $1`,
          [perm.slug],
        );

        if (existing.length === 0) {
          // Check if permission exists with same module, action, resource but different slug
          const existingByModule = await queryRunner.query(
            `SELECT id, slug FROM "system"."permissions" WHERE module = $1 AND resource = $2 AND action = $3`,
            [perm.module, perm.resource, perm.action],
          );

          if (existingByModule.length === 0) {
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
            // Update the slug and name if they differ
            const existingPerm = existingByModule[0];
            if (existingPerm.slug !== perm.slug) {
              await queryRunner.query(
                `UPDATE "system"."permissions" SET slug = $1, name = $2, updated_at = NOW() WHERE id = $3`,
                [perm.slug, perm.name, existingPerm.id],
              );
              console.log(
                `  ✅ Updated permission slug: ${existingPerm.slug} -> ${perm.slug}`,
              );
            } else {
              console.log(
                `  ⏭️  Permission "${perm.slug}" already exists, skipping...`,
              );
            }
          }
        } else {
          console.log(
            `  ⏭️  Permission "${perm.slug}" already exists, skipping...`,
          );
        }
      }
    } finally {
      await queryRunner.release();
    }
  },
};
