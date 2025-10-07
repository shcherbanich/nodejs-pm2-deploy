/* eslint-disable */
require('dotenv').config({ path: '.env.example.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_REPO,
  DEPLOY_BRANCH = 'main',
  DEPLOY_PATH_FRONTEND,
  SSH_KEY_PATH,
} = process.env;

module.exports = {
  apps: [], // фронтенд статику обслуживает nginx, поэтому процесс не запускаем
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: `origin/${DEPLOY_BRANCH}`,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH_FRONTEND,
      ssh_options: `StrictHostKeyChecking=no${SSH_KEY_PATH ? ` -i ${SSH_KEY_PATH}` : ''}`,
      'pre-setup': 'mkdir -p {{path}}/shared',
      'pre-deploy-local': `if [ -f .env.production ]; then scp ${SSH_KEY_PATH ? `-i ${SSH_KEY_PATH} ` : ''}.env.production ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH_FRONTEND}/shared/.env.production; fi`,
      'post-deploy': [
        'ln -sf {{path}}/shared/.env.example.production .env.example.production || true',
        'npm ci',
        'npm run build'
      ].join(' && ')
    }
  }
};
