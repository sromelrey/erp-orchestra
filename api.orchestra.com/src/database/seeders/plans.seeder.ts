import { DataSource } from 'typeorm';
import { Seeder } from './seeder.config';

/**
 * Seeds the subscription plans and links them to modules.
 * Idempotent - checks for existing data before inserting.
 */
export const PlansSeeder: Seeder = {
  name: 'PlansSeeder',

  async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    try {
      // ========================================
      // TASK 1: Seed Plans
      // ========================================
      const plans = [
        { name: 'Starter', monthlyPrice: 49, maxUsers: 5 },
        { name: 'Professional', monthlyPrice: 199, maxUsers: 25 },
        { name: 'Enterprise', monthlyPrice: 499, maxUsers: -1 }, // -1 = unlimited
      ];

      for (const plan of plans) {
        // Idempotent: check if exists by name
        const exists = await queryRunner.query(
          `SELECT id FROM "system"."plans" WHERE name = $1`,
          [plan.name],
        );

        if (exists.length === 0) {
          await queryRunner.query(
            `INSERT INTO "system"."plans" ("name", "monthlyPrice", "max_users", "created_at", "updated_at")
             VALUES ($1, $2, $3, NOW(), NOW())`,
            [plan.name, plan.monthlyPrice, plan.maxUsers],
          );
          console.log(`  ✅ Created plan: ${plan.name}`);
        } else {
          console.log(`  ⏭️  Plan "${plan.name}" already exists, skipping...`);
        }
      }

      // ========================================
      // TASK 2: Link Plans to Modules
      // ========================================

      // Get Enterprise plan ID
      const enterprisePlan = await queryRunner.query(
        `SELECT id FROM "system"."plans" WHERE name = $1`,
        ['Enterprise'],
      );

      if (enterprisePlan.length > 0) {
        const enterprisePlanId = enterprisePlan[0].id;

        // Get all module IDs
        const allModules = await queryRunner.query(
          `SELECT id FROM "system"."modules"`,
        );

        // Link Enterprise plan to all modules
        for (const module of allModules) {
          const linkExists = await queryRunner.query(
            `SELECT 1 FROM "system"."plan_modules" WHERE plan_id = $1 AND module_id = $2`,
            [enterprisePlanId, module.id],
          );

          if (linkExists.length === 0) {
            await queryRunner.query(
              `INSERT INTO "system"."plan_modules" ("plan_id", "module_id")
               VALUES ($1, $2)`,
              [enterprisePlanId, module.id],
            );
          }
        }
        console.log(
          `  ✅ Enterprise plan linked to ${allModules.length} modules`,
        );
      }

      // Get Starter plan ID
      const starterPlan = await queryRunner.query(
        `SELECT id FROM "system"."plans" WHERE name = $1`,
        ['Starter'],
      );

      if (starterPlan.length > 0) {
        const starterPlanId = starterPlan[0].id;

        // Starter plan only gets Inventory (parent) and Material Master (sub-module)
        const starterModules = await queryRunner.query(
          `SELECT id FROM "system"."modules" WHERE code IN ($1, $2)`,
          ['INV', 'INV_MM'],
        );

        for (const module of starterModules) {
          const linkExists = await queryRunner.query(
            `SELECT 1 FROM "system"."plan_modules" WHERE plan_id = $1 AND module_id = $2`,
            [starterPlanId, module.id],
          );

          if (linkExists.length === 0) {
            await queryRunner.query(
              `INSERT INTO "system"."plan_modules" ("plan_id", "module_id")
               VALUES ($1, $2)`,
              [starterPlanId, module.id],
            );
          }
        }
        console.log(
          `  ✅ Starter plan linked to ${starterModules.length} modules`,
        );
      }
    } finally {
      await queryRunner.release();
    }
  },
};
