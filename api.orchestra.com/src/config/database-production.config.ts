import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://neondb_owner:npg_DNyXM0H4ZAmz@ep-polished-math-ahy4du7r-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  entities: [__dirname + '/../entities/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false, // Keep sync disabled for production
  ssl: false,
});
