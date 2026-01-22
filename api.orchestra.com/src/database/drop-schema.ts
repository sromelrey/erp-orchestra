import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

console.log(
  'Database URL configured:',
  databaseUrl.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'),
);

const dataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  entities: [__dirname + '/../entities/**/*.entity.{ts,js}'],
  synchronize: false, // Important: False so we don't try to sync broken schema before dropping
  ssl: databaseUrl.includes('neon.tech') ? false : true, // Disable SSL for Neon in this script
});

async function dropSchema() {
  console.log('🗑️  Dropping database schema...');
  try {
    await dataSource.initialize();

    // Drop all tables
    await dataSource.query('DROP SCHEMA public CASCADE');
    await dataSource.query('CREATE SCHEMA public');

    // Re-sync schema (create tables)
    const syncDataSource = new DataSource({
      ...dataSource.options,
      synchronize: true,
    });
    await syncDataSource.initialize();
    await syncDataSource.synchronize();
    await syncDataSource.destroy();

    console.log('✅ Schema dropped and re-synchronized successfully');
  } catch (error) {
    console.error('❌ Failed to drop schema:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

dropSchema();
