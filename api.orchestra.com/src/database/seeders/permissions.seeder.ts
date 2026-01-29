import { DataSource } from 'typeorm';
import { Seeder } from './seeder.config';

/**
 * Seeds the permissions table with standard system permissions.
 */
export const PermissionsSeeder: Seeder = {
  name: 'PermissionsSeeder',

  async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    try {
      const permissions = [
        // HRIS - Employee
        {
          module: 'hris',
          resource: 'employee',
          action: 'view',
          slug: 'hris.employee.view',
          name: 'View Employees',
        },
        {
          module: 'hris',
          resource: 'employee',
          action: 'create',
          slug: 'hris.employee.create',
          name: 'Create Employees',
        },
        {
          module: 'hris',
          resource: 'employee',
          action: 'update',
          slug: 'hris.employee.update',
          name: 'Update Employees',
        },
        {
          module: 'hris',
          resource: 'employee',
          action: 'delete',
          slug: 'hris.employee.delete',
          name: 'Delete Employees',
        },
        // HRIS - Leave Request
        {
          module: 'hris',
          resource: 'leave_request',
          action: 'view',
          slug: 'hris.leave_request.view',
          name: 'View Leave Requests',
        },
        {
          module: 'hris',
          resource: 'leave_request',
          action: 'create',
          slug: 'hris.leave_request.create',
          name: 'Create Leave Requests',
        },
        {
          module: 'hris',
          resource: 'leave_request',
          action: 'approve',
          slug: 'hris.leave_request.approve',
          name: 'Approve Leave Requests',
        },
        // System - Role
        {
          module: 'system',
          resource: 'role',
          action: 'view',
          slug: 'system.role.view',
          name: 'View Roles',
        },
        {
          module: 'system',
          resource: 'role',
          action: 'manage',
          slug: 'system.role.manage',
          name: 'Manage Roles',
        },
        // System - User
        {
          module: 'system',
          resource: 'user',
          action: 'view',
          slug: 'system.user.view',
          name: 'View Users',
        },
        {
          module: 'system',
          resource: 'user',
          action: 'manage',
          slug: 'system.user.manage',
          name: 'Manage Users',
        },
        // System - Permission
        {
          module: 'system',
          resource: 'permission',
          action: 'view',
          slug: 'system.permission.view',
          name: 'View Permissions',
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
    } finally {
      await queryRunner.release();
    }
  },
};
