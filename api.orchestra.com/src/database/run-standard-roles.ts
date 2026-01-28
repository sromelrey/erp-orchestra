import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { StandardRolesSeeder } from './seeders/standard-roles.seeder';

config(); // Load .env

const run = async () => {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [__dirname + '/../entities/**/*.entity{.ts,.js}'],
    synchronize: false,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('Connecting to database...');
    await dataSource.initialize();

    console.log('Running StandardRolesSeeder...');
    await StandardRolesSeeder.run(dataSource);

    console.log('Done!');
  } catch (error) {
    console.error('Error running seeder:', error);
  } finally {
    await dataSource.destroy();
  }
};

run();
