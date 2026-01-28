import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Seeder } from './seeder.config';

/**
 * Seeds the admin user, role, and permissions.
 * Idempotent - checks for existing data before inserting.
 *
 * Inserts into the following tables:
 * - system.users (User entity)
 * - system.roles (Role entity)
 * - system.user_roles (UserRole entity)
 * - system.permissions (Permission entity)
 * - system.role_permissions (RolePermission entity)
 */
export const AdminUserSeeder: Seeder = {
  name: 'AdminUserSeeder',

  async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    try {
      // ========================================
      // TASK 1: Seed Admin User
      // ========================================
      let adminUserId: number;
      const existingUser = await queryRunner.query(
        `SELECT id FROM "system"."users" WHERE email = $1`,
        ['admin@orchestra.com'],
      );

      if (existingUser.length > 0) {
        adminUserId = existingUser[0].id;
        console.log('  ⏭️  Admin user already exists, reusing...');
      } else {
        // Hash the admin password
        const password = 'password123';
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert admin user (matches User entity)
        const userResult = await queryRunner.query(
          `INSERT INTO "system"."users" (
            "email", 
            "password_hash", 
            "first_name", 
            "last_name", 
            "is_system_admin", 
            "status",
            "created_at",
            "updated_at"
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id`,
          [
            'admin@orchestra.com',
            passwordHash,
            'System',
            'Administrator',
            true,
            'ACTIVE',
          ],
        );
        adminUserId = userResult[0].id;
        console.log('  ✅ Created admin user');
      }

      // ========================================
      // TASK 2: Seed System Admin Role
      // ========================================
      const existingRole = await queryRunner.query(
        `SELECT id FROM "system"."roles" WHERE code = $1`,
        ['SYSTEM_ADMIN'],
      );

      let adminRoleId: number;

      if (existingRole.length > 0) {
        adminRoleId = existingRole[0].id;
        console.log('  ⏭️  System Admin role already exists, reusing...');
      } else {
        // Create System Admin role (matches Role entity)
        const roleResult = await queryRunner.query(
          `INSERT INTO "system"."roles" (
            "name",
            "code",
            "description",
            "is_system_role",
            "status",
            "created_at",
            "updated_at"
          ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id`,
          [
            'System Admin',
            'SYSTEM_ADMIN',
            'Full system administrator with all permissions',
            true,
            'ACTIVE',
          ],
        );
        adminRoleId = roleResult[0].id;
      }

      // ========================================
      // TASK 3: Assign User to Role (UserRole entity)
      // ========================================
      if (adminUserId && adminRoleId) {
        const existingUserRole = await queryRunner.query(
          `SELECT 1 FROM "system"."user_roles" WHERE user_id = $1 AND role_id = $2`,
          [adminUserId, adminRoleId],
        );

        if (existingUserRole.length === 0) {
          // Insert user-role assignment (matches UserRole entity)
          await queryRunner.query(
            `INSERT INTO "system"."user_roles" (
              "user_id",
              "role_id",
              "assigned_at",
              "created_at",
              "updated_at"
            ) VALUES ($1, $2, NOW(), NOW(), NOW())`,
            [adminUserId, adminRoleId],
          );
        }
      }

      // ========================================
      // TASK 4: Seed Permissions (Permission entity)
      // ========================================
      // Permission entity uses: module, resource, action, slug, name, description
      const permissions = [
        {
          module: 'system',
          resource: 'users',
          action: 'manage',
          slug: 'system:users:manage',
          name: 'Manage Users',
          description: 'Create, read, update, delete users',
        },
        {
          module: 'system',
          resource: 'roles',
          action: 'manage',
          slug: 'system:roles:manage',
          name: 'Manage Roles',
          description: 'Create, read, update, delete roles',
        },
        {
          module: 'system',
          resource: 'permissions',
          action: 'manage',
          slug: 'system:permissions:manage',
          name: 'Manage Permissions',
          description: 'Create, read, update, delete permissions',
        },
        {
          module: 'system',
          resource: 'tenants',
          action: 'manage',
          slug: 'system:tenants:manage',
          name: 'Manage Tenants',
          description: 'Create, read, update, delete tenants',
        },
        {
          module: 'system',
          resource: 'all',
          action: 'admin',
          slug: 'system:all:admin',
          name: 'System Admin',
          description: 'Full system administration access',
        },
      ];

      for (const perm of permissions) {
        // Check if permission exists by slug
        const existingPerm = await queryRunner.query(
          `SELECT id FROM "system"."permissions" WHERE slug = $1`,
          [perm.slug],
        );

        if (existingPerm.length === 0) {
          await queryRunner.query(
            `INSERT INTO "system"."permissions" (
              "module",
              "resource",
              "action",
              "slug",
              "name",
              "description",
              "created_at",
              "updated_at"
            ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
            [
              perm.module,
              perm.resource,
              perm.action,
              perm.slug,
              perm.name,
              perm.description,
            ],
          );
          console.log(`  ✅ Created permission: ${perm.slug}`);
        } else {
          console.log(
            `  ⏭️  Permission "${perm.slug}" already exists, skipping...`,
          );
        }
      }

      // ========================================
      // TASK 5: Assign Permissions to Role (RolePermission entity)
      // ========================================
      const allPermissions = await queryRunner.query(
        `SELECT id FROM "system"."permissions"`,
      );

      for (const permission of allPermissions) {
        const existingRolePerm = await queryRunner.query(
          `SELECT 1 FROM "system"."role_permissions" WHERE role_id = $1 AND permission_id = $2`,
          [adminRoleId, permission.id],
        );

        if (existingRolePerm.length === 0) {
          // Insert role-permission assignment (matches RolePermission entity)
          await queryRunner.query(
            `INSERT INTO "system"."role_permissions" (
              "role_id",
              "permission_id",
              "created_at",
              "updated_at"
            ) VALUES ($1, $2, NOW(), NOW())`,
            [adminRoleId, permission.id],
          );
        }
      }

      console.log('  ✅ Admin user seeded successfully');
      console.log('  📧 Email: admin@orchestra.com');
      console.log('  🔑 Password: password123');
    } finally {
      await queryRunner.release();
    }
  },
};
