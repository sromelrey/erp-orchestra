import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

async function cleanDatabase() {
  let connection: DataSource | null = null;

  try {
    console.log('🧹 Cleaning existing database schema...');

    // Create connection
    connection = new DataSource({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      logging: true,
    });

    await connection.initialize();
    console.log('✅ Database connected');

    // Drop all tables and schemas completely
    console.log('🗑️  Dropping all tables and indexes...');

    // Drop all tables in public schema
    await connection.query(`
      DROP SCHEMA IF EXISTS "public" CASCADE;
      CREATE SCHEMA "public";
    `);

    // Drop system schema if it exists
    await connection.query(`DROP SCHEMA IF EXISTS "system" CASCADE`);

    console.log('✅ Dropped all schemas and tables');
  } catch (error) {
    console.error('❌ Clean failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

cleanDatabase().catch(console.error);
