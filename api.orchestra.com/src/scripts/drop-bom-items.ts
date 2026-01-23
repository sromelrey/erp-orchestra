import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function dropBomItemsTable() {
  try {
    await dataSource.initialize();
    console.log('Connected to database');
    
    // Drop the table
    await dataSource.query('DROP TABLE IF EXISTS operations.bom_items CASCADE');
    console.log('✅ Dropped bom_items table');
    
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

dropBomItemsTable();
