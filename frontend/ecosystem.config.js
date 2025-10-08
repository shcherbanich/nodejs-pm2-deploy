/* eslint-disable */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.deploy') });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_REPO,
  DEPLOY_BRANCH = 'main',
  DEPLOY_PATH_FRONTEND,
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
      path: DEPLOY_PATH_FRONTEND,
      ssh_options: sshOpts,
      'pre-setup': 'mkdir -p {{path}}/shared',
      'post-deploy': [
        'npm ci',
        'npm run build'
      ].join(' && ')
    }
  }
};
