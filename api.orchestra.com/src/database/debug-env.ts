import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('=== DEBUG: Environment Variables ===');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('All env vars with DB:', Object.keys(process.env).filter(key => key.toLowerCase().includes('db')));

// Test URL parsing
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  try {
    const url = new URL(dbUrl);
    console.log('Parsed URL:');
    console.log('  Protocol:', url.protocol);
    console.log('  Username:', url.username);
    console.log('  Hostname:', url.hostname);
    console.log('  Port:', url.port);
    console.log('  Database:', url.pathname.substring(1));
  } catch (error) {
    console.error('Failed to parse URL:', error);
  }
} else {
  console.error('DATABASE_URL is missing!');
}
