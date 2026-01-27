import { Seeder } from './seeder.config';
import { SystemModulesSeeder } from './system-modules.seeder';

/**
 * Export all seeders in execution order.
 * Add new seeders to this array.
 */
export const seeders: Seeder[] = [
  SystemModulesSeeder,
  // Add more seeders here in order of execution
];
