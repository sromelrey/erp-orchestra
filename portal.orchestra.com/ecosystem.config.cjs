const path = require('path');

module.exports = {
  apps: [
    {
      name: "frontend",
      script: "node",
      args: "node_modules/next/dist/bin/next start",
      cwd: path.resolve(__dirname),
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        HOST: "0.0.0.0"
      }
    }
  ]
};