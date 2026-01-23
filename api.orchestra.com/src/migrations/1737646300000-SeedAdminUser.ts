import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedAdminUser1737646300000 implements MigrationInterface {
  name = 'SeedAdminUser1737646300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Hash the admin password
    const password = 'password123';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert admin user
    await queryRunner.query(`
      INSERT INTO "system"."users" (
        "email", 
        "password_hash", 
        "first_name", 
        "last_name", 
        "is_system_admin", 
        "status",
        "created_at",
        "updated_at"
      ) VALUES (
        'admin@orchestra.com',
        '${passwordHash}',
        'System',
        'Administrator',
        true,
        'ACTIVE',
        now(),
        now()
      )
    `);

    // Create System Admin role
    await queryRunner.query(`
      INSERT INTO "system"."roles" (
        "name",
        "description",
        "is_system_role",
        "created_at",
        "updated_at"
      ) VALUES (
        'System Admin',
        'Full system administrator with all permissions',
        true,
        now(),
        now()
      )
    `);

    // Get the admin user and role IDs
    const adminUserResult = await queryRunner.query(`
      SELECT "id" FROM "system"."users" WHERE "email" = 'admin@orchestra.com'
    `);
    
    const adminRoleResult = await queryRunner.query(`
      SELECT "id" FROM "system"."roles" WHERE "name" = 'System Admin'
    `);

    const adminUserId = adminUserResult[0]?.id;
    const adminRoleId = adminRoleResult[0]?.id;

    if (adminUserId && adminRoleId) {
      // Assign admin role to admin user
      await queryRunner.query(`
        INSERT INTO "system"."user_roles" (
          "user_id",
          "role_id",
          "created_at",
          "updated_at"
        ) VALUES (
          ${adminUserId},
          ${adminRoleId},
          now(),
          now()
        )
      `);
    }

    // Create basic permissions
    const permissions = [
      { name: 'Manage Users', code: 'MANAGE_USERS', description: 'Create, read, update, delete users' },
      { name: 'Manage Roles', code: 'MANAGE_ROLES', description: 'Create, read, update, delete roles' },
      { name: 'Manage Permissions', code: 'MANAGE_PERMISSIONS', description: 'Create, read, update, delete permissions' },
      { name: 'Manage Companies', code: 'MANAGE_COMPANIES', description: 'Create, read, update, delete companies' },
      { name: 'System Admin', code: 'SYSTEM_ADMIN', description: 'Full system administration access' },
    ];

    for (const permission of permissions) {
      await queryRunner.query(`
        INSERT INTO "system"."permissions" (
          "name",
          "code",
          "description",
          "created_at",
          "updated_at"
        ) VALUES (
          '${permission.name}',
          '${permission.code}',
          '${permission.description}',
          now(),
          now()
        )
      `);
    }

    // Get all permission IDs
    const allPermissionsResult = await queryRunner.query(`
      SELECT "id" FROM "system"."permissions"
    `);

    // Assign all permissions to System Admin role
    for (const permission of allPermissionsResult) {
      await queryRunner.query(`
        INSERT INTO "system"."role_permissions" (
          "role_id",
          "permission_id",
          "created_at",
          "updated_at"
        ) VALUES (
          ${adminRoleId},
          ${permission.id},
          now(),
          now()
        )
      `);
    }

    console.log('✅ Admin user seeded successfully');
    console.log('📧 Email: admin@orchestra.com');
    console.log('🔑 Password: password123');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove admin user and related data
    await queryRunner.query(`DELETE FROM "system"."role_permissions" WHERE "role_id" IN (SELECT "id" FROM "system"."roles" WHERE "name" = 'System Admin')`);
    await queryRunner.query(`DELETE FROM "system"."user_roles" WHERE "user_id" IN (SELECT "id" FROM "system"."users" WHERE "email" = 'admin@orchestra.com')`);
    await queryRunner.query(`DELETE FROM "system"."permissions" WHERE "code" IN ('MANAGE_USERS', 'MANAGE_ROLES', 'MANAGE_PERMISSIONS', 'MANAGE_COMPANIES', 'SYSTEM_ADMIN')`);
    await queryRunner.query(`DELETE FROM "system"."roles" WHERE "name" = 'System Admin'`);
    await queryRunner.query(`DELETE FROM "system"."users" WHERE "email" = 'admin@orchestra.com'`);
    
    console.log('❌ Admin user and related data removed');
  }
}
