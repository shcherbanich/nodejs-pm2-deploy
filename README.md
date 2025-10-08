# Деплой Mesto — Docker + PM2 + Nginx

## Как найти сервер
IP адрес: 158.160.204.77
Frontend: https://front.nomorepartiessbs.ru
Backend: https://api.nomorepartiessbs.ru

# Деплой
pm2 deploy production setup
pm2 deploy production

# На сервере
## Конфиги nginx
sudo cp infra/mesto-frontend.conf /etc/nginx/sites-available/mesto-frontend.conf
sudo cp infra/mesto-backend.conf  /etc/nginx/sites-available/mesto-backend.conf
sudo ln -sf /etc/nginx/sites-available/mesto-frontend.conf /etc/nginx/sites-enabled/mesto-frontend.conf
sudo ln -sf /etc/nginx/sites-available/mesto-backend.conf  /etc/nginx/sites-enabled/mesto-backend.conf
sudo nginx -t && sudo systemctl reload nginx

## Сертификаты
sudo apt-get update
sudo apt-get install -y python3-certbot-nginx
sudo certbot --nginx -d front.nomorepartiessbs.ru -d api.nomorepartiessbs.ru \
--agree-tos -m filippf@bk.ru -n --redirect

# Проверка для ревью
curl -I https://front.nomorepartiessbs.ru
curl -I https://api.nomorepartiessbs.ru
pm2 ls && pm2 logs --lines 50
