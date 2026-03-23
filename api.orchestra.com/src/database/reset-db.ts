import 'tsconfig-paths/register';
import { SeederDataSource } from './seeders/seeder.config';
import { seeders } from './seeders';

/**
 * Reset database: Truncate all tables and re-run seeders.
 * Usage: npm run db:reset
 *        npm run db:reset -- <schema>   (e.g., operations, hris, system)
 *
 * WARNING: This will DELETE ALL DATA in the database!
 */
async function resetDatabase() {
  const argSchema = process.argv[2]?.trim();

  console.log('🔄 Starting database reset...\n');
  if (argSchema) {
    console.log(`ℹ️  Target schema: ${argSchema}\n`);
  } else {
    console.log('ℹ️  Target: ALL configured schemas\n');
  }
  console.log('⚠️  WARNING: This will DELETE DATA in the target scope!\n');

  try {
    await SeederDataSource.initialize();
    console.log('✅ Database connection established\n');

    const queryRunner = SeederDataSource.createQueryRunner();

    // List of schemas to truncate (default)
    const allSchemas = [
      'system',
      'management',
      'hris',
      'finance',
      'operations',
    ];

    // If an arg is provided, restrict to that schema; otherwise, use all
    const schemas = argSchema ? [argSchema] : allSchemas;

    console.log(
      '🗑️  Truncating all tables in schemas:',
      schemas.join(', '),
      '...\n',
    );

    for (const schema of schemas) {
      const tables = await queryRunner.query(
        `
        SELECT tablename FROM pg_tables 
        WHERE schemaname = $1
      `,
        [schema],
      );

      for (const table of tables) {
        const tableName = table.tablename;
        try {
          await queryRunner.query(
            `TRUNCATE TABLE "${schema}"."${tableName}" RESTART IDENTITY CASCADE`,
          );
          console.log(`  ✅ Truncated: ${schema}.${tableName}`);
        } catch (error) {
          console.log(
            `  ⚠️  Could not truncate ${schema}.${tableName}: ${(error as Error).message}`,
          );
        }
      }
    }

    await queryRunner.release();

    console.log('\n✅ All tables truncated!\n');

    // Re-run all seeders
    console.log('🌱 Re-running seeders...\n');

    for (const seeder of seeders) {
      console.log(`📦 Running: ${seeder.name}`);
      await seeder.run(SeederDataSource);
      console.log(`✅ Completed: ${seeder.name}\n`);
    }

    console.log('🎉 Database reset completed successfully!');
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  } finally {
    await SeederDataSource.destroy();
  }
}

resetDatabase();
