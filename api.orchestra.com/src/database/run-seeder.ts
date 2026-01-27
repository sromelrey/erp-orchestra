import 'tsconfig-paths/register';
import { SeederDataSource } from './seeders/seeder.config';
import { seeders } from './seeders';

/**
 * Run all seeders in order.
 * Usage: npm run seed
 */
async function runSeeders() {
  console.log('🌱 Starting database seeding...\n');

  try {
    await SeederDataSource.initialize();
    console.log('✅ Database connection established\n');

    for (const seeder of seeders) {
      console.log(`📦 Running: ${seeder.name}`);
      await seeder.run(SeederDataSource);
      console.log(`✅ Completed: ${seeder.name}\n`);
    }

    console.log('🎉 All seeders completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await SeederDataSource.destroy();
  }
}

runSeeders();
