import { execSync } from 'child_process';

console.log('🧹 Cleaning environment...');

// Clear all environment variables using PowerShell (Windows compatible)
try {
  if (process.platform === 'win32') {
    execSync('powershell -Command "$env:DATABASE_URL=\'" -Value \'\'"', { stdio: 'inherit' });
    execSync('powershell -Command "$env:DB_HOST=\'localhost\'" -Value \'localhost\'"', { stdio: 'inherit' });
    execSync('powershell -Command "$env:DB_PORT=\'5432\'" -Value \'5432\'"', { stdio: 'inherit' });
    execSync('powershell -Command "$env:DB_USERNAME=\'postgres\'" -Value \'postgres\'"', { stdio: 'inherit' });
    execSync('powershell -Command "$env:DB_PASSWORD=\'password\'" -Value \'password\'"', { stdio: 'inherit' });
    execSync('powershell -Command "$env:DB_NAME=\'erp_orchestra\'" -Value \'erp_orchestra\'"', { stdio: 'inherit' });
  } else {
    execSync('export DATABASE_URL=""', { stdio: 'inherit' });
    execSync('export DB_HOST=localhost', { stdio: 'inherit' });
    execSync('export DB_PORT=5432', { stdio: 'inherit' });
    execSync('export DB_USERNAME=postgres', { stdio: 'inherit' });
    execSync('export DB_PASSWORD=password', { stdio: 'inherit' });
    execSync('export DB_NAME=erp_orchestra', { stdio: 'inherit' });
  }

  console.log('✅ Environment cleaned');
  console.log('🚀 Now run: npm run migration:add-columns');
