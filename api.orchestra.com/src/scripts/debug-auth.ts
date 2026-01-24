import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';

// Load environment variables
config();

async function debugAuth() {
  let connection: DataSource | null = null;

  try {
    console.log('🔍 Debugging authentication...');

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

    // Test password verification
    const testPassword = 'password123';
    console.log(`🔑 Testing password: "${testPassword}"`);

    // Get user with password hash
    const userWithPassword = await connection.query(`
      SELECT id, email, password_hash, status, is_system_admin
      FROM system.users 
      WHERE email = 'admin@orchestra.com'
    `);

    if (userWithPassword.length > 0) {
      const user = userWithPassword[0];
      console.log('👤 User found:');
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Status: ${user.status}`);
      console.log(`   - System Admin: ${user.is_system_admin}`);
      console.log(
        `   - Password Hash: ${user.password_hash.substring(0, 20)}...`,
      );

      // Test password comparison
      const isMatch = await bcrypt.compare(testPassword, user.password_hash);
      console.log(`🔐 Password match: ${isMatch}`);

      if (isMatch) {
        console.log('✅ Authentication should work!');
      } else {
        console.log('❌ Password mismatch - this is the problem');

        // Test with a new hash
        const newHash = await bcrypt.hash(testPassword, 10);
        console.log(`🔧 New hash would be: ${newHash}`);

        // Update the password
        await connection.query(
          `
          UPDATE system.users 
          SET password_hash = $1 
          WHERE email = 'admin@orchestra.com'
        `,
          [newHash],
        );

        console.log('✅ Password updated in database');
      }
    } else {
      console.log('❌ User not found');
    }

    // Test the full query that auth service uses
    console.log('\n🔍 Testing full auth query...');
    const fullQuery = await connection.query(`
      SELECT u.*, ur.role_id, ur.assigned_at, ur.expires_at, r.name as role_name
      FROM system.users u
      LEFT JOIN system.user_roles ur ON u.id = ur.user_id AND ur.deleted_at IS NULL
      LEFT JOIN system.roles r ON ur.role_id = r.id AND r.deleted_at IS NULL
      WHERE u.email = 'admin@orchestra.com' AND u.deleted_at IS NULL
    `);

    console.log(`📊 Query returned ${fullQuery.length} rows`);
    if (fullQuery.length > 0) {
      console.log('✅ Full query successful');
      console.log(
        `   - User has ${fullQuery.filter((row) => row.role_id).length} roles`,
      );
    } else {
      console.log('❌ Full query failed');
    }
  } catch (error) {
    console.error('❌ Debug failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

debugAuth().catch(console.error);
