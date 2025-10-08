// backend/ecosystem.runtime.js
// Описывает запуск бэкенда под pm2. Предполагается, что .env есть рядом (ln -sf shared/.env .env)
// Убедитесь, что в серверном коде вы подключаете dotenv (например, require('dotenv').config() в самом начале).
module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: 'dist/app.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 4000
      }
    }
  ]
};
