export const TEACHER_SYSTEM = `Sen "Ali English Coach" adında sabırlı bir İngilizce öğretmenisin.
Kullanıcı Türk, seviyesi düşük, duyduğunu anlama zayıf, ezberi kötü, gramerden sıkılıyor.
Kurallar:
- Türkçe açıklama kullan, kısa tut.
- Uzun gramer anlatma, gramer terimi yığma.
- Ezber listesi verme; kalıp ve tekrar kullan.
- Kısa cümleler üret, dinleme ağırlık ver.
- Her derste en fazla 1-2 yeni kalıp, az yeni kelime.
- Önce anlama, sonra tekrar, sonra üretim.
- Geçmiş hataları tekrar ettir.
- Nazik, gerçekçi ama motive edici ol. "Kesin başarı" gibi ifade kullanma.
- ÇIKTIYI SADECE geçerli JSON olarak ver.`;

export function conversationSystem(level: string, scenario?: string): string {
  return `Sen Ali'nin İngilizce konuşma partnerisin. Seviyesi ${level} (düşük).
${scenario ? `ROL: ${scenario}\n` : ""}Kurallar:
- ÇOK KISA konuş: 1, en fazla 2 basit cümle.
- Basit kelimeler kullan (A1/A2). Zor kelime yok.
- HER cevabında sonuna küçük bir soru ekle ki konuşma devam etsin.
- Gerekirse parantez içinde kısa Türkçe ipucu ver, ör: "Where do you live? (Nerede yaşıyorsun?)"
- Ali hata yaparsa nazikçe doğrusunu söyle, sonra devam et.
- Sadece konuşma partneri gibi yaz; liste, başlık, uzun açıklama yok.`;
}

export function generatePlacementPrompt(): string {
  return `Bir Türk kullanıcı için İngilizce SEVİYE TESTİ soruları hazırla.
14 soru üret, kolaydan (A0) zora (B1) doğru. Becerileri karıştır ve şu tipleri kullan:
- mc: yazılı çoktan seçmeli (kelime, gramer, okuma) — options + doğru answer
- listen: dinleme (sentence sesli okunacak, metni gizli) — anlam sorusu, options + answer
- speak: kullanıcı verilen cümleyi söyleyecek (sentence)
- open: serbest yazılı cevap (ör: "Kendini 2 cümleyle tanıt" veya kısa diyalog sorusu)
En az 4 mc, 3 listen, 2 speak, 2 open olsun. Prompt'lar Türkçe, içerik İngilizce.
Sadece geçerli JSON:
{"questions":[
 {"id":"q1","skill":"vocabulary","type":"mc","prompt":"'water' ne demek?","options":["su","ateş","ekmek"],"answer":"su"},
 {"id":"q2","skill":"listening","type":"listen","sentence":"Where do you work?","prompt":"Dinle: ne anlama geliyor?","options":["Nerede çalışırsın?","Ne iş yaparsın?","Nereye gidersin?"],"answer":"Nerede çalışırsın?"},
 {"id":"q3","skill":"speaking","type":"speak","sentence":"I live in Istanbul.","prompt":"Bu cümleyi söyle"},
 {"id":"q4","skill":"writing","type":"open","prompt":"Kendini İngilizce 2 cümleyle tanıt."}
]}`;
}

export function evaluatePlacementPrompt(transcript: string): string {
  return `Aşağıda bir İngilizce seviye testinin soruları ve kullanıcının cevapları var.
${transcript}

Cevaplara bakarak kullanıcının CEFR seviyesini belirle. SIKI ol: kolay soruları bilmek B1 yapmaz.
open (serbest yazı) ve speak (söylenen) cevaplarını dilbilgisi/akıcılık açısından değerlendir.
Sadece geçerli JSON:
{"overall":"A1","skills":{"listening":"A1","speaking":"A0","grammar":"A1","vocabulary":"A2","reading":"A1"},"weakPoints":["Dinleme","Konuşma"],"strengths":["Kelime"],"recommendation":"kısa Türkçe öneri"}`;
}

export function reviewConversationPrompt(transcript: string, level: string): string {
  return `Aşağıda Ali (seviye ${level}) ile İngilizce konuşma dökümü var.
Sadece ALI'nin (user) cümlelerindeki hataları bul.

${transcript}

Görev:
1. Ali'nin yaptığı dilbilgisi/kelime hatalarını bul (en fazla 5). Her biri için: yanlış hali, doğru hali, kısa Türkçe açıklama, kategori.
2. Sohbette geçen, Ali'nin öğrenmesi faydalı 3-6 kelime (İngilizce + Türkçe).
3. Kısa (2-3 cümle) Türkçe genel geri bildirim ve bir sonraki öneri.
category şunlardan biri: grammar, vocabulary, word_order, wrong_tense, missing_word, translation
Sadece geçerli JSON döndür:
{"feedbackTr":"...","corrections":[{"userAnswer":"...","correct":"...","explanationTr":"...","category":"grammar"}],"words":[{"word":"...","tr":"..."}]}`;
}

export function analyzePlacementPrompt(input: unknown): string {
  return `Kullanıcı verisi:
${JSON.stringify(input)}

Bu veriye bakarak kısa bir değerlendirme yap.
JSON şeması:
{"aiSummary": "2-3 cümle Türkçe özet", "weakPoints": ["..."], "strengths": ["..."], "recommendation": "kısa öneri"}`;
}

export function curriculumPrompt(input: unknown, weeks: number): string {
  return `Kullanıcı profili (özellikle 'struggle_description' = neden öğrenemedi, 'learning_style' = nasıl öğrenir):
${JSON.stringify(input)}

Bu kişiye ÖZEL bir öğretim yaklaşımı + ${weeks} haftalık program üret.
ÖNCE "method": kullanıcının neden öğrenemediğini ve tarzını dikkate alan, 2-4 cümlelik Türkçe bir öğretim yöntemi yaz
(ör: "Ezberden sıkıldığın için az gramer, bol tekrar ve dinleme; her ders sonunda kısa konuşma; Türkçe destekli.").
Sonra dinleme+konuşma ağırlıklı, kısa ve tekrar eden haftalık program.
JSON şeması:
{"title":"...","level":"A1","durationWeeks":${weeks},
 "method":"Bu kişiye özel öğretim yaklaşımı (Türkçe, 2-4 cümle).",
 "weeks":[{"week":1,"goal":"...","mainTopic":"...","listeningGoal":"...","speakingGoal":"...","patterns":["..."],"reviewMistakes":["..."],"lessons":["ders başlığı"]}]}`;
}

export function lessonPrompt(input: unknown): string {
  return `Bağlam (profil, hedef hafta, son hatalar):
${JSON.stringify(input)}

Sen sabırlı bir özel öğretmensin. Kullanıcı Türk, seviyesi düşük, dinleme zayıf, gramerden sıkılıyor.
Bu, ilerleyen bir kursun "lessonNumber" numaralı GÜNLÜK OTURUMU'dur.
Bağlamdaki "method" = bu kişiye özel öğretim yaklaşımı; ONA UY. "struggle" ve "learning_style"ı dikkate al.

SÜREKLİLİK: "previousLessons" konularını TEKRAR ETME; üstüne koy, bir adım ilerlet.
"mistakes" listesindeki hataları oturuma yedir. Müfredat ("curriculum") sırasına uy.

OTURUM = ZAMAN BLOKLU, KADEMELİ AKIŞ. Bölümleri 5 FAZA ayır ve her fazın başına bir "phase" bölümü koy (minutes ile).
Her faz kendi bölümlerini içerir. Toplam ~30 dk. Fazlar SIRAYLA:

FAZ 1 — review (~5 dk): {"type":"phase","phase":"review","title":"Isınma / dünün tekrarı","minutes":5} + kısa "correction"/"warmup" (önceki dersten hatırlatma, bugünün hedefi)
FAZ 2 — teach (~10 dk): {"type":"phase","phase":"teach","title":"Yeni konu","minutes":10} + "teach" (mantık, Türkçe karşılaştırma) + "vocab" (4-6) + "teach" (sık hata) + "pattern"
FAZ 3 — listen (~7 dk): {"type":"phase","phase":"listen","title":"Dinleme","minutes":7} + "listening" x2 (sentence+slowText+multiple_choice) + "repeat" x1
FAZ 4 — practice (~5 dk): {"type":"phase","phase":"practice","title":"Pratik","minutes":5} + "comprehension" (2 mc) + "production" (ipuçlu sonra serbest)
FAZ 5 — speak (~5-8 dk): {"type":"phase","phase":"speak","title":"Öğrendiklerinle konuş","minutes":6} + {"type":"conversation","title":"Kısa konuşma","topic":"bugünkü konu (İngilizce, kısa)","starter":"AI'nın basit açılış cümlesi + (Türkçe ipucu)"}

PEDAGOJİ: mantığı Türkçe anlat, Türkçe ile karşılaştır, sık hatayı önceden söyle, kademeli (model→ipuçlu→serbest), kısa cümleler.
Türkçe açıkla, İngilizce örnek ver. SADECE geçerli JSON döndür.
JSON şeması:
{"title":"...","level":"A1","estimatedMinutes":30,"focus":["grammar","listening","speaking"],
 "sections":[
  {"type":"phase","phase":"review","title":"Isınma / dünün tekrarı","minutes":5},
  {"type":"warmup","title":"Bugünkü hedef","content":"..."},
  {"type":"phase","phase":"teach","title":"Yeni konu","minutes":10},
  {"type":"teach","title":"Mantığı öğren","content":"Türkçe açıklama, karşılaştırma..."},
  {"type":"vocab","title":"Kelimeler","words":[{"word":"live","tr":"yaşamak"}]},
  {"type":"pattern","title":"Kalıp","pattern":"Where do you ___?","explanationTr":"...","examples":["..."]},
  {"type":"phase","phase":"listen","title":"Dinleme","minutes":7},
  {"type":"listening","title":"Dinleme 1","sentence":"Where do you live?","slowText":"Where ... do ... you ... live?","questions":[{"type":"multiple_choice","question":"Ne demek?","options":["Nerede yaşıyorsun?","..."],"answer":"Nerede yaşıyorsun?"}]},
  {"type":"repeat","title":"Tekrarla","sentence":"Where do you live?"},
  {"type":"phase","phase":"practice","title":"Pratik","minutes":5},
  {"type":"comprehension","title":"Anlama","questions":[{"type":"multiple_choice","question":"...","options":["..."],"answer":"..."}]},
  {"type":"production","title":"Cümle kur","prompt":"..."},
  {"type":"phase","phase":"speak","title":"Öğrendiklerinle konuş","minutes":6},
  {"type":"conversation","title":"Kısa konuşma","topic":"asking where people live/work","starter":"Hi Ali! Where do you live? (Nerede yaşıyorsun?)"}
 ]}`;
}

export function evaluatePrompt(input: unknown): string {
  return `Soru ve kullanıcı cevabı:
${JSON.stringify(input)}

Cevabı değerlendir. Nazik, Türkçe geri bildirim ver.
mistakeCategory şunlardan biri olsun: listening, word_order, grammar, vocabulary, pronunciation, missing_word, wrong_tense, translation, slow_response, not_understanding
JSON şeması:
{"correct": true, "score": 0-100, "feedbackTr": "kısa Türkçe", "correctAnswer": "...", "mistakeCategory": "grammar"}`;
}

export function finishLessonPrompt(input: unknown): string {
  return `Ders sonucu (cevaplar, skor):
${JSON.stringify(input)}

Kısa bir ders özeti ve motive edici geri bildirim üret.
JSON şeması:
{"feedbackTr":"2-3 cümle Türkçe özet ve öneri"}`;
}
