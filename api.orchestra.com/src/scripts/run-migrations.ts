import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

async function runMigrations() {
  let connection: DataSource | null = null;

  try {
    console.log('🚀 Starting migrations...');

    // Create connection using migration config
    connection = new DataSource({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      migrations: ['src/migrations/1737646300000-SeedAdminUser.ts'],
      logging: true,
    });

    await connection.initialize();
    console.log('✅ Database connected');

    // Run migrations
    const pendingMigrations = await connection.runMigrations();

    if (pendingMigrations.length > 0) {
      console.log(
        `✅ Successfully ran ${pendingMigrations.length} migrations:`,
      );
      pendingMigrations.forEach((migration) => {
        console.log(`   - ${migration.name}`);
      });
    } else {
      console.log('ℹ️  No pending migrations to run');
    }

    // Verify admin user was created
    const adminUser = await connection.query(`
      SELECT id, email, first_name, last_name, is_system_admin, status 
      FROM system.users 
      WHERE email = 'admin@orchestra.com'
    `);

    if (adminUser.length > 0) {
      console.log('✅ Admin user verified:');
      console.log(`   - Email: ${adminUser[0].email}`);
      console.log(
        `   - Name: ${adminUser[0].first_name} ${adminUser[0].last_name}`,
      );
      console.log(`   - System Admin: ${adminUser[0].is_system_admin}`);
      console.log(`   - Status: ${adminUser[0].status}`);
    } else {
      console.log('❌ Admin user not found');
    }

    // Verify tables were created
    const tables = await connection.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'system' 
      ORDER BY table_name
    `);

    console.log(`✅ Created ${tables.length} tables in system schema:`);
    tables.forEach((table) => {
      console.log(`   - ${table.table_name}`);
    });
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

runMigrations().catch(console.error);
