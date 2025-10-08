const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.deploy') });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_REPO,
  DEPLOY_BRANCH = 'main',
  SSH_KEY_PATH,
  DEPLOY_PATH_MONO = '/var/www/mesto-app',
} = process.env;

module.exports = {
  apps: [],
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: `origin/${DEPLOY_BRANCH}`,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH_MONO,
      key: SSH_KEY_PATH,
      'pre-deploy': `scp .env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH_MONO}`,
      'post-deploy': [
        'cd {{current_path}} && npm ci && npm run build && pm2 startOrReload ecosystem.runtime.js --update-env',
      ].join(' && ')
    }
  }
};
