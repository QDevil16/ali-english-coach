#!/usr/bin/env bash
# Nginx reverse proxy + SSL — SADECE ali-english-coach için. Mevcut siteleri değiştirmez.
# Kullanım:  sudo bash deployment/setup-nginx.sh english.example.com
set -e

DOMAIN="${1:-}"
if [ -z "$DOMAIN" ]; then
  echo "Kullanım: sudo bash deployment/setup-nginx.sh <domain>"
  exit 1
fi

APP_DIR="/var/www/ali-english-coach"
AVAIL="/etc/nginx/sites-available/ali-english-coach"
ENABLED="/etc/nginx/sites-enabled/ali-english-coach"

# 1) HTTP-only geçici config (certbot sertifikayı bundan sonra ekler)
cat > "$AVAIL" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    location /.well-known/acme-challenge/ { root /var/www/html; }

    location / {
        proxy_pass http://127.0.0.1:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINX

# 2) Etkinleştir + test + reload (mevcut siteler etkilenmez)
ln -sf "$AVAIL" "$ENABLED"
nginx -t
systemctl reload nginx
echo ">>> HTTP proxy hazır: http://$DOMAIN"

# 3) SSL (certbot yoksa kur), sertifika al ve config'i otomatik HTTPS'e çevir
if ! command -v certbot >/dev/null 2>&1; then
  apt-get update -qq && apt-get install -y certbot python3-certbot-nginx
fi
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos \
  -m "${CERTBOT_EMAIL:-admin@$DOMAIN}" --redirect

nginx -t && systemctl reload nginx
echo ">>> Hazır: https://$DOMAIN"
