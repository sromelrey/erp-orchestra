import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { UserRole } from '../entities/system/user-role.entity';

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

    // Check total user_roles
    const count = await dataSource.getRepository(UserRole).count();
    console.log(`Total UserRole records: ${count}`);

    // Check latest user_role
    const latest = await dataSource.getRepository(UserRole).find({
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['user', 'role'],
    });
    console.log('Latest 5 UserRoles:', JSON.stringify(latest, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await dataSource.destroy();
  }
};

run();
