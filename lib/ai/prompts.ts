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

export function conversationSystem(level: string): string {
  return `Sen Ali'nin İngilizce konuşma partnerisin. Seviyesi ${level} (düşük).
Kurallar:
- ÇOK KISA konuş: 1, en fazla 2 basit cümle.
- Basit kelimeler kullan (A1/A2). Zor kelime yok.
- HER cevabında sonuna küçük bir soru ekle ki konuşma devam etsin.
- Gerekirse parantez içinde kısa Türkçe ipucu ver, ör: "Where do you live? (Nerede yaşıyorsun?)"
- Ali hata yaparsa nazikçe doğrusunu söyle, sonra devam et.
- Sadece konuşma partneri gibi yaz; liste, başlık, uzun açıklama yok.`;
}

export function analyzePlacementPrompt(input: unknown): string {
  return `Kullanıcı verisi:
${JSON.stringify(input)}

Bu veriye bakarak kısa bir değerlendirme yap.
JSON şeması:
{"aiSummary": "2-3 cümle Türkçe özet", "weakPoints": ["..."], "strengths": ["..."], "recommendation": "kısa öneri"}`;
}

export function curriculumPrompt(input: unknown, weeks: number): string {
  return `Kullanıcı profili:
${JSON.stringify(input)}

${weeks} haftalık kişisel müfredat üret. Dinleme ve konuşma ağırlıklı, kısa ve tekrar eden.
JSON şeması:
{"title": "...", "level": "A1", "durationWeeks": ${weeks},
 "weeks": [{"week":1,"goal":"...","mainTopic":"...","listeningGoal":"...","speakingGoal":"...","patterns":["..."],"reviewMistakes":["..."],"lessons":["ders başlığı", "..."]}]}`;
}

export function lessonPrompt(input: unknown): string {
  return `Bağlam (profil, hedef hafta, son hatalar):
${JSON.stringify(input)}

Bugünkü TEK dersi üret. 30-45 dakikalık, DOLU ve adım adım. Kullanıcı seviyesi düşük, dinleme zayıf.
ZORUNLU: en az 12 bölüm üret. Şu tipleri kullan (bu sırayla):
- warmup: bugünün hedefi (content)
- vocab: 4-6 yeni kelime, her biri {"word":"...","tr":"..."} (words dizisi)
- listening: EN AZ 3 AYRI listening bölümü, her birinde farklı kısa cümle ("sentence" + "slowText") + 1 multiple_choice anlama sorusu
- repeat: EN AZ 2 tekrar bölümü, {"sentence":"..."} — kullanıcı dinleyip tekrarlayacak
- pattern: 1-2 kalıp, "pattern" + "explanationTr" + "examples" (4 örnek)
- comprehension: 2-3 multiple_choice soru
- production: 1-2 yazılı cümle kurma (prompt)
- dialogue: 4-6 satırlık mini diyalog (content, satırlar \\n ile)
- correction: geçmiş hatalardan 1 hatırlatma (content) — hata yoksa genel ipucu
- summary: kısa özet (content)
Cümleler KISA ve basit (A1/A2). Türkçe açıklama kullan. Sadece geçerli JSON döndür.
JSON şeması:
{"title":"...","level":"A1","estimatedMinutes":35,"focus":["listening","speaking"],
 "sections":[
  {"type":"warmup","title":"Bugünkü hedef","content":"..."},
  {"type":"vocab","title":"Kelimeler","words":[{"word":"live","tr":"yaşamak"}]},
  {"type":"listening","title":"Dinleme 1","sentence":"Where do you live?","slowText":"Where ... do ... you ... live?","questions":[{"type":"multiple_choice","question":"Ne demek?","options":["Nerede yaşıyorsun?","..."],"answer":"Nerede yaşıyorsun?"}]},
  {"type":"repeat","title":"Tekrarla","sentence":"Where do you live?"},
  {"type":"pattern","title":"Kalıp","pattern":"Where do you ___?","explanationTr":"...","examples":["...","..."]},
  {"type":"production","title":"Cümle kur","prompt":"..."},
  {"type":"dialogue","title":"Mini diyalog","content":"A: ...\\nB: ..."},
  {"type":"summary","title":"Özet","content":"..."}
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
