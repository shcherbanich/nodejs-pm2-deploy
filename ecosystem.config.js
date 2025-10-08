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

const sshOpts = `StrictHostKeyChecking=no${SSH_KEY_PATH ? ` -i ${SSH_KEY_PATH}` : ''}`;

module.exports = {
  apps: [],
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: `origin/${DEPLOY_BRANCH}`,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH_MONO,
      ssh_options: sshOpts,
      'pre-setup': 'mkdir -p {{path}}/shared && mkdir -p {{path}}/shared/backend',
      'pre-deploy-local': `scp ${SSH_KEY_PATH ? `-i ${SSH_KEY_PATH}` : ''} .env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH_MONO}/shared/backend/.env`,
      'post-deploy': [
        'cd {{current_path}}/backend && ln -sf {{path}}/shared/backend/.env .env',
        'cd {{current_path}}/backend && npm ci && npm run build && pm2 startOrReload ecosystem.runtime.js --update-env',
        'cd {{current_path}}/frontend && npm ci && npm run build'
      ].join(' && ')
    }
  }
};
