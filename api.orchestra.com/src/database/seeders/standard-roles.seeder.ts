import { DataSource } from 'typeorm';
import { Seeder } from './seeder.config';

export const StandardRolesSeeder: Seeder = {
  name: 'StandardRolesSeeder',

  async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    try {
      const roles = [
        {
          name: 'Tenant Admin',
          code: 'ADMIN',
          description: 'Administrator for a specific tenant',
          isSystemRole: true,
        },
      ];

      for (const role of roles) {
        const existingRole = await queryRunner.query(
          `SELECT id FROM "system"."roles" WHERE code = $1`,
          [role.code],
        );

        let roleId: number;

        if (existingRole.length === 0) {
          const insertResult = await queryRunner.query(
            `INSERT INTO "system"."roles" (
              "name",
              "code",
              "description",
              "is_system_role",
              "status",
              "created_at",
              "updated_at"
            ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
            RETURNING id`,
            [
              role.name,
              role.code,
              role.description,
              role.isSystemRole,
              'ACTIVE',
            ],
          );
          roleId = insertResult[0].id;
          console.log(`  ✅ Created role: ${role.name}`);
        } else {
          roleId = existingRole[0].id;
          console.log(`  ⏭️  Role "${role.name}" already exists, reusing...`);
        }

        // Assign all permissions to ADMIN role
        if (role.code === 'ADMIN') {
          const permissions = await queryRunner.query(
            `SELECT id, slug FROM "system"."permissions" WHERE deleted_at IS NULL`,
          );

          let assignedCount = 0;
          for (const perm of permissions) {
            const existing = await queryRunner.query(
              `SELECT id FROM "system"."role_permissions" 
               WHERE role_id = $1 AND permission_id = $2`,
              [roleId, perm.id],
            );

            if (existing.length === 0) {
              await queryRunner.query(
                `INSERT INTO "system"."role_permissions" (
                  "role_id",
                  "permission_id",
                  "created_at",
                  "updated_at"
                ) VALUES ($1, $2, NOW(), NOW())`,
                [roleId, perm.id],
              );
              assignedCount++;
            }
          }

          if (assignedCount > 0) {
            console.log(
              `  ✅ Assigned ${assignedCount} permissions to ADMIN role`,
            );
          } else {
            console.log(`  ⏭️  ADMIN role already has all permissions`);
          }
        }
      }
    } finally {
      await queryRunner.release();
    }
  },
};
