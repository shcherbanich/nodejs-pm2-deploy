/* eslint-disable */
require('dotenv').config({ path: '.env.example.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_REPO,
  DEPLOY_BRANCH = 'main',
  DEPLOY_PATH_BACKEND,
  SSH_KEY_PATH,
} = process.env;

module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production'
      },
      autorestart: true,
      max_restarts: 10,
      restart_delay: 4000
    }
  ],
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: `origin/${DEPLOY_BRANCH}`,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH_BACKEND,
      ssh_options: `StrictHostKeyChecking=no${SSH_KEY_PATH ? ` -i ${SSH_KEY_PATH}` : ''}`,
      'pre-setup': 'mkdir -p {{path}}/shared',
      'pre-deploy-local': `scp ${SSH_KEY_PATH ? `-i ${SSH_KEY_PATH} ` : ''}.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH_BACKEND}/shared/.env || true`,
      'post-deploy': [
        'ln -sf {{path}}/shared/.env.example .env.example',
        'npm ci',
        'if npm run | grep -q "build"; then npm run build; fi',
        'pm2 describe mesto-backend > /dev/null && pm2 reload mesto-backend --update-env || pm2 start npm --name mesto-backend -- run start'
      ].join(' && ')
    }
  }
};
