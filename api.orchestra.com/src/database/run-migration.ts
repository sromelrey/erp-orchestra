import { DataSource } from 'typeorm';
import * as path from 'path';

const dataSource = new DataSource({
  type: 'postgres',
  url: `${process.env.DATABASE_URL}` || '',
  entities: [__dirname + '/../entities/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
  ssl: false,
});

async function runMigration() {
  console.log('🚀 Running migration directly...');

  try {
    await dataSource.initialize();

    // Import and run the migration
    const migrationPath = path.join(
      __dirname,
      './migrations/1642857123-AddCommonEntityColumnsFixed.ts',
    );
    const migrationModule = await import(migrationPath);
    const migrationInstance = new migrationModule.default();

    await dataSource.transaction(async (manager) => {
      await migrationInstance.up(manager);
      console.log('✅ Migration completed successfully!');
    });
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

runMigration();
