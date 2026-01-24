import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

async function checkAdminUser() {
  let connection: DataSource | null = null;

  try {
    console.log('🔍 Checking admin user...');

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

    // Check if admin user exists
    const adminUser = await connection.query(`
      SELECT id, email, first_name, last_name, is_system_admin, status, created_at
      FROM system.users 
      WHERE email = 'admin@orchestra.com'
    `);

    if (adminUser.length > 0) {
      console.log('✅ Admin user found:');
      console.log(`   - ID: ${adminUser[0].id}`);
      console.log(`   - Email: ${adminUser[0].email}`);
      console.log(
        `   - Name: ${adminUser[0].first_name} ${adminUser[0].last_name}`,
      );
      console.log(`   - System Admin: ${adminUser[0].is_system_admin}`);
      console.log(`   - Status: ${adminUser[0].status}`);
      console.log(`   - Created: ${adminUser[0].created_at}`);
    } else {
      console.log('❌ Admin user not found');
    }

    // Check user roles
    const userRoles = await connection.query(
      `
      SELECT ur.user_id, ur.role_id, ur.assigned_at, r.name as role_name
      FROM system.user_roles ur
      JOIN system.roles r ON ur.role_id = r.id
      WHERE ur.user_id = $1
    `,
      adminUser.length > 0 ? [adminUser[0].id] : [0],
    );

    if (userRoles.length > 0) {
      console.log('✅ User roles found:');
      userRoles.forEach((role: any) => {
        console.log(
          `   - Role: ${role.role_name} (assigned: ${role.assigned_at})`,
        );
      });
    } else {
      console.log('❌ No user roles found');
    }

    // Check all users
    const allUsers = await connection.query(`
      SELECT id, email, status, is_system_admin
      FROM system.users
      ORDER BY created_at DESC
      LIMIT 5
    `);

    console.log(`📋 Total users found: ${allUsers.length}`);
    allUsers.forEach((user: any) => {
      console.log(
        `   - ${user.email} (${user.status}, admin: ${user.is_system_admin})`,
      );
    });
  } catch (error) {
    console.error('❌ Check failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

checkAdminUser().catch(console.error);
