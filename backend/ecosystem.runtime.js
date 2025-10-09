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
        PORT: process.env.PORT || 4000,
      },
    },
  ],
};
