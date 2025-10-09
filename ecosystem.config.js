const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.deploy') });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_REPO,
  DEPLOY_REF = 'origin/master',
  SSH_KEY_PATH,
  DEPLOY_PATH_MONO = '/var/www/mesto-app',
} = process.env;

module.exports = {
  apps: [],
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
        'pm2 startOrReload ecosystem.runtime.js --update-env',
        "cd frontend && npm ci && npm i && npm run build",
      ].join(' && ')
    }
  }
};
