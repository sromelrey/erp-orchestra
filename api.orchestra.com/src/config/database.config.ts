import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

console.log(
  'Database URL configured:',
  databaseUrl.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'),
);

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false, // Don't auto-sync in production
  ssl: false, // Disable SSL for local development
});
