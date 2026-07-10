#!/usr/bin/env bash
# Ali English Coach — VPS deploy/güncelleme scripti.
# İLK KURULUMDAN SONRA çalıştırılır. kiradefteripro'ya DOKUNMAZ.
# Kullanım: cd /var/www/ali-english-coach && bash deployment/deploy.sh
set -e

APP_DIR="/var/www/ali-english-coach"
BRANCH="${1:-main}"

cd "$APP_DIR"

echo "==> Güncel kod çekiliyor ($BRANCH)"
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

echo "==> Bağımlılıklar"
npm ci || npm install

echo "==> Build"
npm run build

echo "==> PM2 (sadece bu uygulama)"
if pm2 describe ali-english-coach > /dev/null 2>&1; then
  pm2 restart ali-english-coach --update-env
else
  pm2 start deployment/ecosystem.config.js
fi
pm2 save

echo "==> Bitti."
