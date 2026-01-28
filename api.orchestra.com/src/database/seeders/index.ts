import { Seeder } from './seeder.config';
import { SystemModulesSeeder } from './system-modules.seeder';
import { AdminUserSeeder } from './admin-user.seeder';
import { PlansSeeder } from './plans.seeder';
import { StandardRolesSeeder } from './standard-roles.seeder';

/**
 * Export all seeders in execution order.
 * Add new seeders to this array.
 */
export const seeders: Seeder[] = [
  SystemModulesSeeder,
  PlansSeeder,
  StandardRolesSeeder,
  AdminUserSeeder,
  // Add more seeders here in order of execution
];
