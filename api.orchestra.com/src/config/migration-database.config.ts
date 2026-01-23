import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import 'tsconfig-paths/register';

// Check for .env.local first, then .env
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
dotenv.config(); // Fallback to .env

const { DATABASE_URL, PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DATABASE } =
  process.env;

export const MigrationDataSource = new DataSource({
  type: 'postgres',
  url: DATABASE_URL,
  host: PG_HOST || 'localhost',
  port: parseInt(PG_PORT || '5432'),
  username: PG_USER || 'postgres',
  password: PG_PASSWORD || '',
  database: PG_DATABASE || 'orchestra',
  entities: [__dirname + '/../entities/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
  ssl: false, // Disable SSL for migration
});
