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

        if (existingRole.length === 0) {
          await queryRunner.query(
            `INSERT INTO "system"."roles" (
              "name",
              "code",
              "description",
              "is_system_role",
              "status",
              "created_at",
              "updated_at"
            ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
            [
              role.name,
              role.code,
              role.description,
              role.isSystemRole,
              'ACTIVE',
            ],
          );
          console.log(`  ✅ Created role: ${role.name}`);
        } else {
          console.log(`  ⏭️  Role "${role.name}" already exists, skipping...`);
        }
      }
    } finally {
      await queryRunner.release();
    }
  },
};
