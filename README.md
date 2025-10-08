# Деплой Mesto — Docker + PM2 + Nginx

## Как найти сервер

**IP адрес:** 158.160.204.77

**Frontend:** https://front.nomorepartiessbs.ru

**Backend:** https://api.nomorepartiessbs.ru

# Деплой

## Подготовка
```shell
cp .env.example .env
cp .env.deploy.example .env.deploy
# после копирования заполните .env и .env.deploy реальными данными
```

## Процесс деплоя
```shell
pm2 deploy production setup # только первый раз
pm2 deploy production
```

# На сервере
## Конфиги nginx
```shell
sudo cp infra/mesto-frontend.conf /etc/nginx/sites-available/mesto-frontend.conf
sudo cp infra/mesto-backend.conf  /etc/nginx/sites-available/mesto-backend.conf
sudo ln -sf /etc/nginx/sites-available/mesto-frontend.conf /etc/nginx/sites-enabled/mesto-frontend.conf
sudo ln -sf /etc/nginx/sites-available/mesto-backend.conf  /etc/nginx/sites-enabled/mesto-backend.conf
sudo nginx -t && sudo systemctl reload nginx
```

## Сертификаты
```shell
sudo apt-get update
sudo apt-get install -y python3-certbot-nginx
sudo certbot --nginx -d front.nomorepartiessbs.ru -d api.nomorepartiessbs.ru \
--agree-tos -m filippf@bk.ru -n --redirect
```

# Проверка для ревью
```shell
curl -I https://front.nomorepartiessbs.ru
curl -I https://api.nomorepartiessbs.ru
pm2 ls && pm2 logs --lines 50
```
