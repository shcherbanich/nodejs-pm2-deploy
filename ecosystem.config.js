const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.deploy') });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_REPO,
  DEPLOY_REF = 'origin/master',
  SSH_KEY_PATH,
  REACT_APP_API_BASE,
  DEPLOY_PATH_MONO = '/var/www/mesto-app',
} = process.env;

module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: 'backend/dist/app.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },
  ],
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH_MONO,
      key: SSH_KEY_PATH,
      'pre-deploy-local': `scp -i ${SSH_KEY_PATH} .env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH_MONO}`,
      'post-deploy': [
        'cd backend && npm ci && npm run build',
        'cd ../ && pm2 startOrReload ecosystem.config.js --env production',
        `cd frontend && REACT_APP_API_BASE="${REACT_APP_API_BASE}" && npm ci && npm i && npm run build`,
      ].join(' && ')
    }
  }
};
