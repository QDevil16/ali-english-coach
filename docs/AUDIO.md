# Ses Altyapısı ve Maliyet Notları

Sistem ekonomik çalışacak şekilde tasarlandı. Her şeyi pahalı canlı ses
modeliyle yapma.

## Varsayılan (ücretsiz)
- **Dinleme:** Tarayıcı `SpeechSynthesis` (maliyet yok).
- **Konuşma algılama:** Önce tarayıcı `SpeechRecognition` (maliyet yok).

## Opsiyonel sunucu route'ları
Env değişkeni yoksa hepsi `mode: "disabled"` döner, sistem bozulmaz.

| Route | Env | Ne zaman |
|-------|-----|----------|
| `POST /api/audio/transcribe` | `OPENAI_TRANSCRIBE_MODEL` | Tarayıcı tanıma yetersizse yedek |
| `POST /api/audio/tts` | `OPENAI_TTS_MODEL` | Daha doğal ses gerekiyorsa |
| `POST /api/realtime/session` | `OPENAI_REALTIME_MODEL` | Kısa canlı diyalog (opsiyonel) |

## Maliyet dostu kullanım
- Ders/müfredat/hata analizi/özet: düşük maliyetli **text** model.
- Dinlemeyi mümkün olduğunca tarayıcı sesiyle yap.
- Canlı sesli diyalog: günde **5–15 dk** ile sınırla.
- Kalan süre: dinleme, tekrar, yazılı cevap, alıştırma, hata düzeltme.
- Model isimlerini koda gömme; `.env.local`'den oku.

> Canlı realtime ses MVP'de tam çalışmak zorunda değildir; mimari hazırdır,
> tam entegrasyon sonraki sürümde eklenebilir.
