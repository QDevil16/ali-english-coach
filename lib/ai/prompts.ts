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

Bugünkü tek dersi üret. 30-60 dk. Bölüm tipleri: warmup, listening, pattern, examples, comprehension, production, dialogue, correction, summary.
listening bölümlerinde "sentence" ve "slowText" ver. comprehension'da multiple_choice sorular ver.
JSON şeması:
{"title":"...","level":"A1","estimatedMinutes":35,"focus":["listening","speaking"],
 "sections":[{"type":"warmup","title":"...","content":"..."},
 {"type":"listening","sentence":"Where do you live?","slowText":"Where ... do ... you ... live?","questions":[{"type":"multiple_choice","question":"Bu ne demek?","options":["...","..."],"answer":"..."}]},
 {"type":"pattern","pattern":"Where do you ...?","explanationTr":"...","examples":["...","..."]}]}`;
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
