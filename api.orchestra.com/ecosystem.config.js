const path = require('path');

module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'node',
      args: 'dist/main.js',
      cwd: path.resolve(__dirname),
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        HOST: '0.0.0.0',
      },
    },
  ],
};
