import { DataSource } from 'typeorm';
import { Seeder } from './seeder.config';

/**
 * Seeds a default tenant to be used for development and testing.
 */
export const TenantsSeeder: Seeder = {
  name: 'TenantsSeeder',

  async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    try {
      // Get the 'Enterprise' plan ID
      const enterprisePlan = await queryRunner.query(
        `SELECT id FROM "system"."plans" WHERE name = $1`,
        ['Enterprise'],
      );

      if (enterprisePlan.length === 0) {
        console.log(
          '  ⚠️  Enterprise plan not found, skipping tenant seeding.',
        );
        return;
      }

      const planId = enterprisePlan[0].id;

      // Seed a default 'System' tenant
      const existingTenant = await queryRunner.query(
        `SELECT id FROM "system"."tenants" WHERE slug = $1`,
        ['system'],
      );

      if (existingTenant.length === 0) {
        await queryRunner.query(
          `INSERT INTO "system"."tenants" (
            "name", 
            "slug", 
            "status", 
            "plan_id", 
            "created_at", 
            "updated_at"
          ) VALUES ($1, $2, $3, $4, NOW(), NOW())`,
          ['System Tenant', 'system', 'active', planId],
        );
        console.log('  ✅ Created default tenant: system');
      } else {
        console.log(
          '  ⏭️  Default tenant "system" already exists, skipping...',
        );
      }
    } finally {
      await queryRunner.release();
    }
  },
};
