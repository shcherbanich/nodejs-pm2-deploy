module.exports = {
  apps: [
    {
      name: "mesto-backend",
      script: "dist/app.js",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 4000,
        JWT_SECRET: process.env.JWT_SECRET,
        DB_ADDRESS: process.env.DB_ADDRESS,
        CORS_ORIGIN: process.env.CORS_ORIGIN,
      },
    },
  ],
};
