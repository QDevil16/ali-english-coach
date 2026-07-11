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

Sen sabırlı bir özel öğretmensin. Kullanıcı Türk, seviyesi düşük, dinleme zayıf, gramerden sıkılıyor.
Bu, ilerleyen bir kursun DERS NUMARASI bağlamdaki "lessonNumber" olan dersidir.
Bugünkü TEK dersi üret: TEST DEĞİL, GERÇEK BİR DERS. Önce ÖĞRET, sonra pratik yaptır.

SÜREKLİLİK: "previousLessons" listesindeki konuları TEKRAR ETME; onların üstüne koy, bir adım ilerlet.
Kısa bir "önceki dersten hatırlatma" ile başla. "mistakes" listesindeki hataları bu derse yedir (tekrar ettir).
Müfredattaki ("curriculum") sıraya uygun ilerle. Her ders bir öncekinden biraz daha ileri olsun (nakış nakış).

PEDAGOJİ KURALLARI:
- Konunun MANTIĞINI Türkçe anlat. "Neden böyle?" sorusunu yanıtla.
- Türkçe ile KARŞILAŞTIR (ör: "Türkçede 'nerede yaşıyorsun', İngilizcede yardımcı fiil 'do' eklenir: Where DO you live?").
- Sık yapılan HATAYI önceden söyle ve neden yanlış olduğunu açıkla.
- Önce göster (model), sonra birlikte (ipuçlu), sonra tek başına (serbest). Kademeli zorluk.
- Kısa cümleler, basit kelimeler (A1/A2). Bunaltma.

ZORUNLU YAPI — en az 14 bölüm, bu sırayla:
1. warmup: bugün ne öğreneceğiz + neden işine yarar (content)
2. teach: konunun mantığını Türkçe anlat, Türkçe ile karşılaştır, kuralı adım adım ver (content, uzun ve net)
3. vocab: 4-6 kelime {"word","tr"}
4. teach: sık yapılan hatayı açıkla — "şöyle deme, böyle de, çünkü..." (content)
5. listening (x3, ayrı bölümler): "sentence" + "slowText" + 1 multiple_choice
6. repeat (x2): {"sentence"} dinle-tekrarla
7. pattern: "pattern" + "explanationTr" + "examples" (4)
8. comprehension: 2 multiple_choice
9. production (x2): kademeli — ilki ipuçlu ("prompt" içinde ipucu ver), ikincisi serbest
10. dialogue: 5-6 satır (content, \\n ile)
11. correction: geçmiş hatalardan hatırlatma (content)
12. summary: bugün ne öğrendik + yarın ne olacak (content)

Türkçe açıkla, İngilizce örnek ver. SADECE geçerli JSON döndür.
JSON şeması:
{"title":"...","level":"A1","estimatedMinutes":40,"focus":["listening","speaking","grammar"],
 "sections":[
  {"type":"warmup","title":"Bugünkü hedef","content":"..."},
  {"type":"teach","title":"Mantığı öğren","content":"Türkçe uzun açıklama, kural, karşılaştırma..."},
  {"type":"vocab","title":"Kelimeler","words":[{"word":"live","tr":"yaşamak"}]},
  {"type":"teach","title":"Dikkat: sık hata","content":"'Where you live?' DEME. 'Where DO you live?' de. Çünkü..."},
  {"type":"listening","title":"Dinleme 1","sentence":"Where do you live?","slowText":"Where ... do ... you ... live?","questions":[{"type":"multiple_choice","question":"Ne demek?","options":["Nerede yaşıyorsun?","..."],"answer":"Nerede yaşıyorsun?"}]},
  {"type":"repeat","title":"Tekrarla","sentence":"Where do you live?"},
  {"type":"pattern","title":"Kalıp","pattern":"Where do you ___?","explanationTr":"...","examples":["...","..."]},
  {"type":"production","title":"Birlikte kur","prompt":"İpucu: 'work' fiiliyle sor. (Where do you ...?)"},
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
