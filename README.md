# Деплой Mesto — Docker + PM2 + Nginx

## Как найти сервер
IP адрес: 51.250.35.82
Frontend: https://front.nomorepartiessbs.ru
Backend: https://api.nomorepartiessbs.ru

Что делают PM2-конфиги
backend/ecosystem.config.js

Подтягивает .env.deploy.

pre-setup: создаёт shared/ на сервере.

pre-deploy-local: копирует локальный backend/.env на сервер → {{path}}/shared/.env.

post-deploy: линк shared/.env → .env, затем npm ci && npm run build и pm2 startOrReload ecosystem.runtime.js.

backend/ecosystem.runtime.js

Запускает dist/app.js под pm2 (кластер, автоперезапуск).

NODE_ENV=production, порт 4000.

После /crash-test pm2 поднимет процесс автоматически.

frontend/ecosystem.config.js

Подтягивает .env.deploy.

Клонирование, npm ci, npm run build.

Процесс не запускается: фронт отдаёт Nginx как статику.

4) Команды деплоя

На локальной машине (с установленным pm2 и доступом по SSH-ключу к серверу и к GitHub по git@):

# Бэкенд
cd backend
pm2 deploy ecosystem.config.js production setup
pm2 deploy ecosystem.config.js production

# Фронтенд
cd ../frontend
pm2 deploy ecosystem.config.js production setup
pm2 deploy ecosystem.config.js production

Nginx + HTTPS на сервере

# скопируйте конфиги (или сгенерируйте на сервере по образцу)
sudo cp infra/mesto-frontend.conf /etc/nginx/sites-available/mesto-frontend.conf
sudo cp infra/mesto-backend.conf  /etc/nginx/sites-available/mesto-backend.conf
sudo ln -sf /etc/nginx/sites-available/mesto-frontend.conf /etc/nginx/sites-enabled/mesto-frontend.conf
sudo ln -sf /etc/nginx/sites-available/mesto-backend.conf  /etc/nginx/sites-enabled/mesto-backend.conf
sudo nginx -t && sudo systemctl reload nginx

# сертификаты
sudo certbot --nginx \
-d front.nomorepartiessbs.ru \
-d api.nomorepartiessbs.ru \
--agree-tos -m filippf@bk.ru -n --redirect


Проверка для ревью
curl -I https://front.nomorepartiessbs.ru
curl -I https://api.nomorepartiessbs.ru
pm2 ls && pm2 logs --lines 50
