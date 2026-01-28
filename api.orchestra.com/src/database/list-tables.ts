import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const run = async () => {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await dataSource.initialize();
    const schemas = await dataSource.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
    `);
    console.log('Available schemas:', JSON.stringify(schemas, null, 2));

    const tables = await dataSource.query(`
      SELECT schemaname, tablename 
      FROM pg_tables 
      WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
    `);
    console.log('All tables:', JSON.stringify(tables, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await dataSource.destroy();
  }
};

run();
