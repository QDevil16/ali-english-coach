# Ali English Coach

Kişiye özel, yapay zekâ destekli İngilizce öğrenme platformu. Dinleme ve
konuşma ağırlıklı, kısa ve tekrar eden derslerle seviyene göre çalıştırır.

> Kişisel kullanım içindir. VPS'e, mevcut `kiradefteripro` uygulamasına
> **dokunmadan** izole kurulacak şekilde hazırlanmıştır.

> Durum: Aşama 1–10 tamamlandı. MVP çalışır durumda.

## 1. Proje özeti
Kullanıcı kayıt olur, kendini tanıtır (onboarding), seviye testi çözer,
sistem seviyesini belirler, AI kişisel müfredat ve günlük ders üretir.
Kullanıcı derslerde dinler ve cevaplar; hataları kaydedilir ve sonraki
dersler bu verilere göre şekillenir.

## 2. Özellikler
- **Sıfırdan İngilizce kursu:** Modül 0 (selamlaşma, tanışma, sayılar, aile, yiyecek, saat…) → Modül 1–2 (gramer/zamanlar) → Modül 3 (B1). Kural → örnek → pratik. AI'sız da çalışır.
- Seviye testi: sesli dinleme + mikrofonla konuşma + zorlu ayrıştırıcı sorular; sıkı seviye eşikleri
- Düzenlenebilir öğrenme profili (hedef, zorluk, tarz) → müfredat/dersler buna göre
- Kişisel AI müfredatı + **ilerleyen** günlük dersler (önceki dersleri/hataları dikkate alır)
- Öğreten ders akışı: 💡 mantık anlatımı, kelime, dinle-tekrarla (mikrofon), kalıp, kademeli pratik, diyalog
- **Spaced repetition** tekrar sistemi + **kelime defteri** + rozet/seri
- Konuşma pratiği: **canlı OpenAI Realtime** ses + ücretsiz tarayıcı sesli mod
- Dürüst değerlendirme (telaffuz/cümle) — yanlışı övmez, doğrusunu gösterir
- `OPENAI_API_KEY` yoksa **mock modda** çalışır (bozulmaz); kurs/temeller her hâlükârda tam

## 3. Teknolojiler
Next.js (App Router) · TypeScript · Tailwind · Supabase (Auth + PostgreSQL +
RLS) · OpenAI (env'den model) · Browser SpeechSynthesis · VPS + Nginx + PM2

## 4. Supabase kurulumu
1. supabase.com'da yeni proje aç.
2. **Project Settings → API**'den al: `Project URL`, `anon public key`,
   `service_role key`.
3. **Authentication → URL Configuration**: Site URL = `https://english.example.com`,
   Redirect URLs listesine `https://english.example.com/auth/callback` ekle.

## 5. SQL schema çalıştırma
Supabase → **SQL Editor** → `supabase/schema.sql` içeriğini yapıştır → Run.
Bu; tabloları, RLS politikalarını, otomatik profil trigger'ını ve indexleri
kurar.

> Daha önce kurduysan (kelime defteri tablosu için): `supabase/migration-vocabulary.sql`
> dosyasını bir kez çalıştır.

## 6. .env.local oluşturma
`.env.local.example` dosyasını kopyala:
```bash
cp .env.local.example .env.local
```
Doldur:
```
OPENAI_API_KEY=            # boşsa mock mod
OPENAI_TEXT_MODEL=gpt-4o-mini
OPENAI_TRANSCRIBE_MODEL=   # opsiyonel
OPENAI_TTS_MODEL=          # opsiyonel
OPENAI_REALTIME_MODEL=     # opsiyonel
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
PORT=3010
NEXT_PUBLIC_APP_URL=https://english.example.com
```

## 7. Local çalıştırma
```bash
npm install
npm run dev     # http://localhost:3010
npm run build   # üretim derlemesi kontrolü
```

## 8. VPS deploy
> Sunucuda **Node.js 18+**, **npm**, **PM2** (`npm i -g pm2`) kurulu olmalı.

```bash
cd /var/www
sudo mkdir -p ali-english-coach
sudo chown -R $USER:$USER /var/www/ali-english-coach
cd /var/www/ali-english-coach

# kodu buraya al (git clone <repo> . veya rsync)
# .env.local dosyasını oluştur (bkz. bölüm 6)

npm install
npm run build

pm2 start deployment/ecosystem.config.js
pm2 save
```

## 9. kiradefteripro'yu bozmadan kurulum
Bu uygulama tamamen izoledir. **Kesin kurallar:**
- `kiradefteripro` klasörüne / veritabanına / `.env` dosyalarına **dokunma**.
- Mevcut Nginx config'lerini ve PM2 processlerini **değiştirme**.
- Mevcut portları kullanma → bu uygulama **3010** kullanır.
- Ayrı klasör: `/var/www/ali-english-coach`
- Ayrı PM2 adı: `ali-english-coach`
- Ayrı Nginx server block: `/etc/nginx/sites-available/ali-english-coach`
- **ASLA `pm2 restart all` çalıştırma.** Sadece: `pm2 restart ali-english-coach`
- Nginx reload öncesi **her zaman** `sudo nginx -t` çalıştır.

## 10. PM2 kullanımı
```bash
pm2 start deployment/ecosystem.config.js   # ilk başlatma
pm2 restart ali-english-coach              # sadece bu uygulama
pm2 logs ali-english-coach                 # logları izle
pm2 status                                 # durum
pm2 save                                    # açılışta otomatik başlatma
```

## 11. Nginx reverse proxy
```bash
sudo cp deployment/nginx-ali-english-coach.conf \
        /etc/nginx/sites-available/ali-english-coach
sudo ln -s /etc/nginx/sites-available/ali-english-coach \
           /etc/nginx/sites-enabled/
sudo nginx -t          # ZORUNLU test
sudo systemctl reload nginx
```
`server_name`'i kendi domainine göre düzenle (`english.example.com`).

## 12. SSL kurulumu
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d english.example.com
```
Certbot sertifikaları oluşturur ve config'i günceller. Otomatik yenileme
`certbot.timer` ile gelir.

## 13. Güncelleme
```bash
cd /var/www/ali-english-coach
git pull
npm install
npm run build
pm2 restart ali-english-coach
```

## 14. Rollback
```bash
cd /var/www/ali-english-coach
git log --oneline -5            # önceki commit'i bul
git checkout <önceki_commit>
npm install && npm run build
pm2 restart ali-english-coach
```
Sorun Nginx'te ise: `sudo rm /etc/nginx/sites-enabled/ali-english-coach &&
sudo nginx -t && sudo systemctl reload nginx` (diğer siteler etkilenmez).

## 15. Sık hatalar
- **500 / boş sayfa:** `.env.local` eksik → değişkenleri kontrol et,
  `pm2 restart ali-english-coach`.
- **Auth çalışmıyor / e-posta linki hata:** Supabase Redirect URL'ye
  `/auth/callback` eklenmemiş.
- **RLS hatası ("permission denied"):** `schema.sql` çalıştırılmamış veya
  RLS politikaları eksik.
- **Ders/müfredat üretilmiyor:** `OPENAI_API_KEY` yanlışsa sistem mock'a
  düşer; DB yazımı için Supabase key'leri doğru olmalı.
- **Dinle çalışmıyor:** Tarayıcı SpeechSynthesis; ilk seste kullanıcı
  etkileşimi gerekir, mobilde sekme sesi açık olmalı.
- **Port çakışması:** 3010 başka process'te ise `pm2 status` ile kontrol et
  (kiradefteripro portunu kullanma).
