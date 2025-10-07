# Деплой Mesto — Docker + PM2 + Nginx

## Как найти сервер
IP адрес: 203.0.113.10
Frontend: https://front.nomorepartiessbs.ru
Backend: https://api.nomorepartiessbs.ru

## Быстрый старт на сервере
```bash
# 1) Установите зависимости (Ubuntu)
sudo apt update && sudo apt install -y docker.io docker-compose-plugin nginx certbot python3-certbot-nginx

# 2) Клонируйте репозиторий и перейдите в него
git clone <URL_ВАШЕГО_РЕПО> && cd <ИМЯ_ПАПКИ_РЕПО>

# 3) Создайте файлы окружения
cp .env.example .env

# 4) Соберите и запустите контейнеры
sudo docker compose build
sudo docker compose up -d

# 5) Настройте хостовый nginx и ssl (пример конфигов в infra/nginx/*)
sudo ln -s /etc/nginx/sites-available/mesto-frontend.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/mesto-backend.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d front.nomorepartiessbs.ru -d api.nomorepartiessbs.ru --agree-tos -m <твой_email> -n --redirect
```
