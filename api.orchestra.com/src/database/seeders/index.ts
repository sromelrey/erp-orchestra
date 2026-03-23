import { Seeder } from './seeder.config';
import { SystemModulesSeeder } from './system-modules.seeder';
import { AdminUserSeeder } from './admin-user.seeder';
import { PlansSeeder } from './plans.seeder';
import { TenantsSeeder } from './tenants.seeder';
import { StandardRolesSeeder } from './standard-roles.seeder';
import { PermissionsSeeder } from './permissions.seeder';
import { UnitsOfMeasureSeeder } from './units-of-measure.seeder';
import { MaterialsSeeder } from './materials.seeder';
import { BomSeeder } from './bom.seeder';

/**
 * Export all seeders in execution order.
 * Add new seeders to this array.
 */
export const seeders: Seeder[] = [
  SystemModulesSeeder,
  PlansSeeder,
  TenantsSeeder,
  PermissionsSeeder,
  StandardRolesSeeder,
  AdminUserSeeder,
  // * Operations Module Seeders
  // UnitsOfMeasureSeeder,
  // MaterialsSeeder,
  // BomSeeder,
];
