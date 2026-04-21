import 'tsconfig-paths/register';
import { SeederDataSource } from './seeders/seeder.config';

/**
 * Reset Addons and Service Config modules: Truncate tables and reset identity sequences.
 * Usage: npm run db:reset:addons
 *
 * WARNING: This will DELETE ALL DATA in addons and service_config tables!
 */
async function resetAddonsAndServiceConfig() {
  console.log('🔄 Starting addons and service config reset...\n');
  console.log(
    '⚠️  WARNING: This will DELETE DATA in addons and service_config tables!\n',
  );

  try {
    await SeederDataSource.initialize();
    console.log('✅ Database connection established\n');

    const queryRunner = SeederDataSource.createQueryRunner();

    // Tables to reset in public schema (addons)
    const publicTables = [
      'addons',
      'addon_inclusion_rules',
      'sales_order_item_addons',
    ];

    // Tables to reset in service_config schema
    const serviceConfigTables = [
      'service_types',
      'service_options',
      'service_conditions',
      'service_configurations',
    ];

    console.log('🗑️  Truncating public schema tables...\n');
    for (const tableName of publicTables) {
      try {
        await queryRunner.query(
          `TRUNCATE TABLE "public"."${tableName}" RESTART IDENTITY CASCADE`,
        );
        console.log(`  ✅ Truncated: public.${tableName}`);
      } catch (error) {
        console.log(
          `  ⚠️  Could not truncate public.${tableName}: ${(error as Error).message}`,
        );
      }
    }

    console.log('\n🗑️  Truncating service_config schema tables...\n');
    for (const tableName of serviceConfigTables) {
      try {
        await queryRunner.query(
          `TRUNCATE TABLE "service_config"."${tableName}" RESTART IDENTITY CASCADE`,
        );
        console.log(`  ✅ Truncated: service_config.${tableName}`);
      } catch (error) {
        console.log(
          `  ⚠️  Could not truncate service_config.${tableName}: ${(error as Error).message}`,
        );
      }
    }

    await queryRunner.release();

    console.log('\n✅ All addons and service_config tables truncated!');
    console.log('🎉 Reset completed successfully!');
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  } finally {
    await SeederDataSource.destroy();
  }
}

resetAddonsAndServiceConfig();
