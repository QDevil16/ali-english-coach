#!/usr/bin/env bash
# Tek komutluk kurulum + güncelleme. İlk seferde de sonraki güncellemelerde de çalışır.
# Kullanım:  bash <(curl -s https://raw.githubusercontent.com/QDevil16/ali-english-coach/main/deployment/setup.sh)
# veya klasör içindeyken:  bash deployment/setup.sh
set -e

APP_DIR="/var/www/ali-english-coach"
REPO="https://github.com/QDevil16/ali-english-coach.git"
BRANCH="main"

# 1) Yoksa klonla, varsa güncelle
if [ ! -d "$APP_DIR/.git" ]; then
  sudo mkdir -p "$APP_DIR"
  sudo chown -R "$USER":"$USER" "$APP_DIR"
  git clone -b "$BRANCH" "$REPO" "$APP_DIR"
fi
cd "$APP_DIR"
git fetch origin "$BRANCH" && git reset --hard "origin/$BRANCH"

# 2) .env.local yoksa örnekten oluştur ve DUR (gizli anahtarları doldurman gerek)
if [ ! -f .env.local ]; then
  cp .env.local.example .env.local
  echo ""
  echo ">>> .env.local oluşturuldu. Şimdi doldur:  nano $APP_DIR/.env.local"
  echo ">>> Doldurduktan sonra tekrar: bash deployment/setup.sh"
  exit 0
fi

# 3) Kur + build + başlat (sadece bu uygulama)
npm ci || npm install
npm run build
if pm2 describe ali-english-coach > /dev/null 2>&1; then
  pm2 restart ali-english-coach --update-env
else
  pm2 start deployment/ecosystem.config.js
fi
pm2 save
echo ">>> Hazır. http://127.0.0.1:3010"
