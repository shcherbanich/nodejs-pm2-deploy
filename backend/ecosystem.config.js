/* eslint-disable */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.deploy') });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_REPO,
  DEPLOY_BRANCH = 'main',
  DEPLOY_PATH_BACKEND,
  SSH_KEY_PATH
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
      path: DEPLOY_PATH_BACKEND,
      ssh_options: sshOpts,
      'pre-setup': 'mkdir -p {{path}}/shared',
      'pre-deploy-local': `scp ${SSH_KEY_PATH ? `-i ${SSH_KEY_PATH}` : ''} ./backend/.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH_BACKEND}/shared/.env`,
      'post-deploy': [
        'ln -sf {{path}}/shared/.env .env',
        'npm ci',
        'npm run build',
        'pm2 startOrReload ecosystem.runtime.js --update-env'
      ].join(' && ')
    }
  }
};
