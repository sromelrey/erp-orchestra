import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Role } from '../entities/system/role.entity';

config();

const run = async () => {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [__dirname + '/../entities/**/*.entity{.ts,.js}'],
    synchronize: false,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await dataSource.initialize();

    const roles = await dataSource.getRepository(Role).find();
    console.log('All Roles:', JSON.stringify(roles, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await dataSource.destroy();
  }
};

run();
