# Ali English Coach

Kişiye özel, yapay zekâ destekli İngilizce öğrenme platformu. Dinleme ve
konuşma ağırlıklı, kısa ve tekrar eden derslerle seviyene göre çalıştırır.

> Bu proje kişisel kullanım içindir. VPS deployment için hazırlanmaktadır ve
> mevcut `kiradefteripro` uygulamasına dokunmadan izole kurulur.

## Local çalıştırma

```bash
npm install
npm run dev   # http://localhost:3010
```

`.env.local.example` dosyasını `.env.local` olarak kopyalayıp değerleri doldur.
`OPENAI_API_KEY` boş bırakılırsa sistem mock AI modunda çalışır.

## Durum

- [x] Aşama 1 — Proje iskeleti
- [x] Aşama 2 — Supabase & Auth
- [x] Aşama 3 — Onboarding & seviye testi
- [ ] Aşama 4 — AI altyapısı
- [ ] Aşama 5 — Dashboard & müfredat
- [ ] Aşama 6 — Günlük ders sistemi
- [ ] Aşama 7 — Hatalarım / ilerleme / ayarlar
- [ ] Aşama 8 — Opsiyonel ses altyapısı
- [ ] Aşama 9 — VPS deployment
- [ ] Aşama 10 — Final kontrol

_(Detaylı kurulum, VPS deploy, PM2, Nginx, SSL, rollback bölümleri son aşamada tamamlanacak.)_
