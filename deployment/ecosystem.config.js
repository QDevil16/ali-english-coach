// PM2 config — SADECE bu uygulama için. Mevcut processlere dokunmaz.
// Başlat:   pm2 start deployment/ecosystem.config.js
// Yeniden:  pm2 restart ali-english-coach   (asla "pm2 restart all" kullanma)
module.exports = {
  apps: [
    {
      name: "ali-english-coach",
      cwd: "/var/www/ali-english-coach",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: "3010",
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "400M",
    },
  ],
};
