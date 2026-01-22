import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

console.log('🧹 Cleaning environment...');

// Clear all environment variables
if (process.platform === 'win32') {
  execSync('set DATABASE_URL=', { shell: 'cmd.exe' });
  execSync('set DB_HOST=localhost', { shell: 'cmd.exe' });
  execSync('set DB_PORT=5432', { shell: 'cmd.exe' });
  execSync('set DB_USERNAME=postgres', { shell: 'cmd.exe' });
  execSync('set DB_PASSWORD=password', { shell: 'cmd.exe' });
  execSync('set DB_NAME=erp_orchestra', { shell: 'cmd.exe' });
} else {
  execSync('export DATABASE_URL=""', { shell: 'bash' });
  execSync('export DB_HOST=localhost', { shell: 'bash' });
  execSync('export DB_PORT=5432', { shell: 'bash' });
  execSync('export DB_USERNAME=postgres', { shell: 'bash' });
  execSync('export DB_PASSWORD=password', { shell: 'bash' });
  execSync('export DB_NAME=erp_orchestra', { shell: 'bash' });
}

console.log('✅ Environment cleaned');
console.log('🚀 Now run: npm run migration:add-columns');
