import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

async function fixUserRoles() {
  let connection: DataSource | null = null;

  try {
    console.log('🔧 Fixing user_roles table...');

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

    // Add missing columns
    await connection.query(`
      ALTER TABLE "system"."user_roles" 
      ADD COLUMN IF NOT EXISTS "assigned_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "expires_at" TIMESTAMP WITH TIME ZONE
    `);

    console.log(
      '✅ Added assigned_at and expires_at columns to user_roles table',
    );

    // Verify columns were added
    const columns = await connection.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'system' AND table_name = 'user_roles'
      ORDER BY ordinal_position
    `);

    console.log('📋 user_roles table columns:');
    columns.forEach((col: any) => {
      console.log(`   - ${col.column_name}: ${col.data_type}`);
    });
  } catch (error) {
    console.error('❌ Fix failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

fixUserRoles().catch(console.error);
