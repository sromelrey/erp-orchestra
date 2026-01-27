import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
dotenv.config();

const { DATABASE_URL, PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DATABASE } =
  process.env;

// Create a dedicated DataSource for seeders
export const SeederDataSource = new DataSource({
  type: 'postgres',
  url: DATABASE_URL,
  host: PG_HOST || 'localhost',
  port: parseInt(PG_PORT || '5432'),
  username: PG_USER || 'postgres',
  password: PG_PASSWORD || '',
  database: PG_DATABASE || 'orchestra',
  entities: [__dirname + '/../entities/**/*.entity.{ts,js}'],
  synchronize: false,
  ssl: false,
});

export interface Seeder {
  name: string;
  run: (dataSource: DataSource) => Promise<void>;
}
