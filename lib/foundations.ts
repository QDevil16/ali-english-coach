import type { LessonContent } from "@/lib/types";

export type Foundation = {
  slug: string;
  title: string;
  level: string;
  summary: string;
  content: LessonContent;
};

// Kuralları Türkçe anlatan, sıralı temel gramer dersleri (A1–A2).
export const FOUNDATIONS: Foundation[] = [
  {
    slug: "to-be",
    title: "am / is / are (olmak)",
    level: "A1",
    summary: "İngilizcenin en temel yapı taşı: 'olmak' fiili.",
    content: {
      title: "am / is / are — 'olmak' fiili",
      level: "A1",
      estimatedMinutes: 20,
      focus: ["grammar", "sentence"],
      sections: [
        { type: "warmup", title: "Hedef", content: "Bugün İngilizcenin en temel fiilini öğreniyoruz: 'to be' (olmak). Her cümlede karşına çıkar." },
        { type: "teach", title: "Mantık", content: "Türkçede 'Ben öğretmenim' dersin; 'im' eki 'olmak' anlamı verir. İngilizcede bu ek yerine ayrı bir kelime kullanılır: am / is / are.\n\n• I → am\n• He / She / It → is\n• You / We / They → are\n\nYani: I am a teacher = Ben öğretmenim." },
        { type: "teach", title: "Kural tablosu", content: "I am (I'm)\nYou are (You're)\nHe is (He's)\nShe is (She's)\nIt is (It's)\nWe are (We're)\nThey are (They're)\n\nOlumsuz: am not / is not (isn't) / are not (aren't)\nSoru: Are you...? Is he...?" },
        { type: "examples", title: "Örnekler", examples: ["I am happy.", "She is a doctor.", "They are at home.", "You are my friend.", "It is cold today."] },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "She ___ a teacher.", options: ["am", "is", "are"], answer: "is" },
          { type: "multiple_choice", question: "They ___ at school.", options: ["is", "am", "are"], answer: "are" },
          { type: "multiple_choice", question: "'I am tired.' ne demek?", options: ["Yorgunum.", "Yorgun değilim.", "Yoruldum mu?"], answer: "Yorgunum." },
        ] },
        { type: "production", title: "Sen kur", prompt: "Kendini tanıt: 'I am ...' ile bir cümle yaz." },
        { type: "summary", title: "Özet", content: "am/is/are = olmak. I→am, he/she/it→is, you/we/they→are. Bu yapı her yerde karşına çıkacak, iyi oturt." },
      ],
    },
  },
  {
    slug: "present-simple",
    title: "Geniş Zaman (Present Simple)",
    level: "A1",
    summary: "Her gün yaptığın, alışkanlık ve genel gerçekler.",
    content: {
      title: "Present Simple — Geniş Zaman",
      level: "A1",
      estimatedMinutes: 25,
      focus: ["grammar"],
      sections: [
        { type: "warmup", title: "Hedef", content: "Her gün yaptığın şeyleri, alışkanlıkları ve genel gerçekleri anlatmayı öğreniyoruz." },
        { type: "teach", title: "Mantık", content: "Alışkanlık ve rutin için kullanılır: 'Her gün çalışırım.'\n\nFiil olduğu gibi kalır. AMA he/she/it için fiile -s eklenir:\n• I work → He works\n• I go → She goes\n• I play → It plays" },
        { type: "teach", title: "Kural: soru ve olumsuz", content: "Soru ve olumsuzda yardımcı fiil 'do/does' gelir:\n• Olumlu: I work. / She works.\n• Olumsuz: I don't work. / She doesn't work.\n• Soru: Do you work? / Does she work?\n\nDİKKAT: does kullanınca fiildeki -s düşer: 'Does she work?' (works değil)." },
        { type: "examples", title: "Örnekler", examples: ["I drink coffee every morning.", "He works in a bank.", "We don't watch TV.", "Do you like music?", "She goes to school by bus."] },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "He ___ football every day.", options: ["play", "plays", "playing"], answer: "plays" },
          { type: "multiple_choice", question: "___ you like tea?", options: ["Do", "Does", "Are"], answer: "Do" },
          { type: "multiple_choice", question: "Olumsuzu: 'She works.'", options: ["She don't work.", "She doesn't work.", "She doesn't works."], answer: "She doesn't work." },
        ] },
        { type: "production", title: "Sen kur", prompt: "Günlük bir alışkanlığını yaz: 'I ... every day.'" },
        { type: "summary", title: "Özet", content: "Geniş zaman = rutin/alışkanlık. he/she/it → fiile -s. Soru/olumsuz → do/does. Bu en çok kullanılan zamandır." },
      ],
    },
  },
  {
    slug: "present-continuous",
    title: "Şimdiki Zaman (Present Continuous)",
    level: "A1",
    summary: "Tam şu anda olan hareketler.",
    content: {
      title: "Present Continuous — Şu an oluyor",
      level: "A1",
      estimatedMinutes: 20,
      focus: ["grammar"],
      sections: [
        { type: "warmup", title: "Hedef", content: "Tam şu anda gerçekleşen hareketleri anlatmayı öğreniyoruz: 'Şu an yemek yiyorum.'" },
        { type: "teach", title: "Mantık", content: "Yapı: am/is/are + fiil-ing\n\n• I am eating (yiyorum)\n• She is running (koşuyor)\n• They are playing (oynuyorlar)\n\nTürkçedeki '-yor' eki gibi düşün. 'to be' (am/is/are) + fiilin -ing hali." },
        { type: "teach", title: "Fark: geniş zaman mı, şimdiki mi?", content: "• I work every day. (rutin → geniş zaman)\n• I am working now. (şu an → şimdiki zaman)\n\nAnahtar kelimeler: now, right now, at the moment → şimdiki zaman." },
        { type: "examples", title: "Örnekler", examples: ["I am reading a book.", "She is cooking dinner.", "We are watching a film.", "They are not sleeping.", "What are you doing?"] },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "I ___ TV now.", options: ["watch", "am watching", "watches"], answer: "am watching" },
          { type: "multiple_choice", question: "'She is sleeping.' ne demek?", options: ["Uyur.", "Uyuyor.", "Uyudu."], answer: "Uyuyor." },
        ] },
        { type: "production", title: "Sen kur", prompt: "Şu an ne yapıyorsun? 'I am ...ing' ile yaz." },
        { type: "summary", title: "Özet", content: "Şimdiki zaman = am/is/are + fiil-ing. 'Şu an' olan işler için. Geniş zamanla karıştırma." },
      ],
    },
  },
  {
    slug: "past-simple",
    title: "Geçmiş Zaman (Past Simple)",
    level: "A2",
    summary: "Dün, geçen hafta — bitmiş geçmiş olaylar.",
    content: {
      title: "Past Simple — Geçmiş Zaman",
      level: "A2",
      estimatedMinutes: 25,
      focus: ["grammar"],
      sections: [
        { type: "warmup", title: "Hedef", content: "Geçmişte bitmiş olayları anlatmayı öğreniyoruz: 'Dün sinemaya gittim.'" },
        { type: "teach", title: "Mantık: was/were", content: "'olmak' fiilinin geçmişi:\n• I / He / She / It → was\n• You / We / They → were\n\nÖrnek: I was tired. (Yorgundum.) They were happy. (Mutlulardı.)" },
        { type: "teach", title: "Kural: -ed ve düzensiz fiiller", content: "Normal fiillere -ed eklenir:\n• work → worked, play → played, watch → watched\n\nAMA bazı fiiller düzensizdir (ezberlenir):\n• go → went, eat → ate, see → saw, have → had, come → came\n\nSoru/olumsuz: yardımcı fiil 'did' gelir, ana fiil düz kalır:\n• Did you go? / I didn't go. (went değil!)" },
        { type: "examples", title: "Örnekler", examples: ["I watched a film yesterday.", "She went to Ankara last week.", "We were at home.", "Did you eat breakfast?", "He didn't call me."] },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "I ___ to school yesterday.", options: ["go", "went", "goed"], answer: "went" },
          { type: "multiple_choice", question: "They ___ happy last night.", options: ["was", "were", "are"], answer: "were" },
          { type: "multiple_choice", question: "Doğru soru:", options: ["Did you went?", "Did you go?", "Do you went?"], answer: "Did you go?" },
        ] },
        { type: "production", title: "Sen kur", prompt: "Dün ne yaptın? Geçmiş zamanda bir cümle yaz." },
        { type: "summary", title: "Özet", content: "Geçmiş: was/were + fiillere -ed (düzensizler ezber). Soru/olumsuz → did, fiil düz kalır." },
      ],
    },
  },
  {
    slug: "future",
    title: "Gelecek Zaman (will / going to)",
    level: "A2",
    summary: "Yarın, gelecek — plan ve tahminler.",
    content: {
      title: "Future — Gelecek Zaman",
      level: "A2",
      estimatedMinutes: 20,
      focus: ["grammar"],
      sections: [
        { type: "warmup", title: "Hedef", content: "Gelecekten bahsetmeyi öğreniyoruz: plan, karar ve tahminler." },
        { type: "teach", title: "will", content: "will + fiil (düz hali). Anlık kararlar ve tahminler için:\n• I will help you. (Yardım edeceğim.)\n• It will rain. (Yağmur yağacak.)\n\nKısaltma: I'll, he'll... Olumsuz: won't (will not)." },
        { type: "teach", title: "going to", content: "am/is/are + going to + fiil. Önceden yapılmış planlar için:\n• I am going to visit my family. (Ailemi ziyaret edeceğim - planlı.)\n\nİkisi de gelecek; 'will' daha çok anlık karar/tahmin, 'going to' daha çok plan." },
        { type: "examples", title: "Örnekler", examples: ["I will call you later.", "She is going to study tonight.", "We won't be late.", "Are you going to travel?", "It will be sunny tomorrow."] },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "I ___ help you. (anlık karar)", options: ["will", "am going", "did"], answer: "will" },
          { type: "multiple_choice", question: "'won't' ne demek?", options: ["will not", "want", "went"], answer: "will not" },
        ] },
        { type: "production", title: "Sen kur", prompt: "Yarın için bir plan yaz: 'I am going to ...' veya 'I will ...'" },
        { type: "summary", title: "Özet", content: "Gelecek: will (anlık karar/tahmin) veya going to (plan). İkisi de + fiilin düz hali." },
      ],
    },
  },
  {
    slug: "sentence-structure",
    title: "Cümle Yapısı (SVO)",
    level: "A2",
    summary: "İngilizce cümlenin sırası neden Türkçeden farklı.",
    content: {
      title: "Cümle Yapısı — Özne + Fiil + Nesne",
      level: "A2",
      estimatedMinutes: 20,
      focus: ["grammar", "sentence"],
      sections: [
        { type: "warmup", title: "Hedef", content: "İngilizce cümlenin sırasını öğreniyoruz. Bu, Türkçe düşünmeyi bırakmanın anahtarı." },
        { type: "teach", title: "Mantık: sıra", content: "Türkçe: Özne + Nesne + Fiil → 'Ben kahve içerim.'\nİngilizce: Özne + Fiil + Nesne → 'I drink coffee.'\n\nİngilizcede FİİL ORTADA. Türkçedeki gibi fiili sona atarsan yanlış olur.\n'I coffee drink' YANLIŞ → 'I drink coffee' DOĞRU." },
        { type: "teach", title: "Zaman ve yer", content: "Zaman ve yer genelde SONA gelir:\n• I go to school every day. (fiil+yer+zaman)\n• She works in Istanbul.\n\nSıra: Kim + ne yapar + neyi + nerede + ne zaman." },
        { type: "examples", title: "Örnekler", examples: ["I eat breakfast at home.", "He plays football on Sundays.", "We watch films every night.", "They study English at school."] },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "Doğru sıralama:", options: ["I English study.", "I study English.", "Study I English."], answer: "I study English." },
          { type: "multiple_choice", question: "Doğru cümle:", options: ["She coffee drinks.", "She drinks coffee.", "Drinks she coffee."], answer: "She drinks coffee." },
        ] },
        { type: "production", title: "Sen kur", prompt: "SVO sırasıyla bir cümle yaz (Özne + Fiil + Nesne)." },
        { type: "summary", title: "Özet", content: "İngilizce: Özne + Fiil + Nesne. Fiil ortada. Türkçe gibi sona atma. Zaman/yer sona gelir." },
      ],
    },
  },
  {
    slug: "questions",
    title: "Soru Kurma (do/does/did, Wh-)",
    level: "A2",
    summary: "Doğru soru cümlesi kurmanın kuralları.",
    content: {
      title: "Soru Kurma",
      level: "A2",
      estimatedMinutes: 20,
      focus: ["grammar"],
      sections: [
        { type: "warmup", title: "Hedef", content: "Doğru soru cümlesi kurmayı öğreniyoruz — İngilizcenin en çok hata yapılan konusu." },
        { type: "teach", title: "Mantık: yardımcı fiil", content: "İngilizcede soru kurarken yardımcı fiil eklenir:\n• Geniş zaman: do / does\n• Geçmiş: did\n• 'to be' ile: am/is/are başa gelir\n\nWhere DO you live? (do olmadan olmaz)\nIs she a doctor? (is başa geldi)" },
        { type: "teach", title: "Wh- soru kelimeleri", content: "What (ne), Where (nerede), When (ne zaman), Who (kim), Why (neden), How (nasıl).\n\nYapı: Wh- + yardımcı fiil + özne + fiil?\n• What do you want?\n• Where does he work?\n• When did you come?" },
        { type: "examples", title: "Örnekler", examples: ["Where do you live?", "What is your name?", "When did you arrive?", "How does it work?", "Why are you sad?"] },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "___ do you live?", options: ["What", "Where", "Who"], answer: "Where" },
          { type: "multiple_choice", question: "Doğru soru:", options: ["Where you work?", "Where do you work?", "Where work you?"], answer: "Where do you work?" },
          { type: "multiple_choice", question: "Geçmiş soru: ___ you go?", options: ["Do", "Did", "Does"], answer: "Did" },
        ] },
        { type: "production", title: "Sen kur", prompt: "Bir Wh- sorusu yaz (Where/What/When ile)." },
        { type: "summary", title: "Özet", content: "Soru = yardımcı fiil (do/does/did) veya am/is/are + özne + fiil. Wh- kelimesi başa gelir. 'do' unutma!" },
      ],
    },
  },
  {
    slug: "there-is-are",
    title: "There is / There are (var)",
    level: "A2",
    summary: "Bir şeyin var olduğunu söylemek.",
    content: {
      title: "There is / There are — 'var'",
      level: "A2",
      estimatedMinutes: 15,
      focus: ["grammar"],
      sections: [
        { type: "warmup", title: "Hedef", content: "Bir şeyin var olduğunu söylemeyi öğreniyoruz: 'Masada bir kitap var.'" },
        { type: "teach", title: "Mantık", content: "'var' demek için 'there is / there are' kullanılır:\n• There is a book. (tekil → is)\n• There are two books. (çoğul → are)\n\nOlumsuz: There isn't / There aren't\nSoru: Is there...? Are there...?" },
        { type: "examples", title: "Örnekler", examples: ["There is a cat in the garden.", "There are many people here.", "There isn't any milk.", "Is there a bank near here?"] },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "There ___ three chairs.", options: ["is", "are", "am"], answer: "are" },
          { type: "multiple_choice", question: "'There is a problem.' ne demek?", options: ["Bir sorun var.", "Sorun yok.", "Sorun neydi?"], answer: "Bir sorun var." },
        ] },
        { type: "production", title: "Sen kur", prompt: "Odanı anlat: 'There is / There are ...' ile bir cümle yaz." },
        { type: "summary", title: "Özet", content: "There is (tekil) / There are (çoğul) = var. Olumsuz isn't/aren't, soru Is/Are there?" },
      ],
    },
  },
];

// Sıfırdan başlangıç dersleri (hiç bilmeyen biri için) — Modül 0.
FOUNDATIONS.push(
  {
    slug: "greetings",
    title: "Selamlaşma",
    level: "A0",
    summary: "Merhaba demek, hâl hatır sormak, vedalaşmak.",
    content: {
      title: "Selamlaşma — Hello!",
      level: "A0",
      estimatedMinutes: 15,
      focus: ["listening", "speaking"],
      sections: [
        { type: "warmup", title: "Hedef", content: "İlk adım: İngilizce selam vermeyi ve hâl hatır sormayı öğreniyoruz. En çok kullanacağın kelimeler bunlar." },
        { type: "teach", title: "Temel selamlar", content: "• Hello / Hi = Merhaba\n• Good morning = Günaydın\n• Good afternoon = İyi günler (öğleden sonra)\n• Good evening = İyi akşamlar\n• Goodbye / Bye = Hoşça kal\n\nGün içinde en çok 'Hi' ve 'Hello' kullanılır." },
        { type: "teach", title: "Hâl hatır sorma", content: "• How are you? = Nasılsın?\n• I'm fine, thanks. = İyiyim, teşekkürler.\n• And you? = Ya sen?\n\nKlasik diyalog:\nA: Hi! How are you?\nB: I'm fine, thanks. And you?\nA: I'm good." },
        { type: "repeat", title: "Tekrarla", sentence: "Hello, how are you?" },
        { type: "repeat", title: "Tekrarla", sentence: "I'm fine, thank you." },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "'How are you?' ne demek?", options: ["Nasılsın?", "Adın ne?", "Nerelisin?"], answer: "Nasılsın?" },
          { type: "multiple_choice", question: "'Good morning' ne zaman denir?", options: ["Sabah", "Akşam", "Gece"], answer: "Sabah" },
        ] },
        { type: "summary", title: "Özet", content: "Hi/Hello = merhaba, How are you? = nasılsın, I'm fine = iyiyim, Bye = hoşça kal. Her gün kullan." },
      ],
    },
  },
  {
    slug: "introduce",
    title: "Kendini Tanıtma",
    level: "A0",
    summary: "İsmini, nereli olduğunu söylemek.",
    content: {
      title: "Kendini Tanıtma",
      level: "A0",
      estimatedMinutes: 15,
      focus: ["speaking"],
      sections: [
        { type: "warmup", title: "Hedef", content: "Adını ve nereli olduğunu söylemeyi öğreniyoruz." },
        { type: "teach", title: "Kalıplar", content: "• My name is Ali. = Benim adım Ali.\n• I am Ali. = Ben Ali'yim.\n• I am from Turkey. = Türkiye'liyim.\n• Nice to meet you. = Tanıştığıma memnun oldum.\n\n'What is your name?' = Adın ne? sorusuna 'My name is ...' diye cevap verirsin." },
        { type: "repeat", title: "Tekrarla", sentence: "My name is Ali." },
        { type: "repeat", title: "Tekrarla", sentence: "I am from Turkey." },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "'What is your name?' ne demek?", options: ["Adın ne?", "Nerelisin?", "Nasılsın?"], answer: "Adın ne?" },
          { type: "multiple_choice", question: "'I am from Turkey.' ne demek?", options: ["Türkiye'liyim.", "Türkiye'ye gidiyorum.", "Türkiye'yi seviyorum."], answer: "Türkiye'liyim." },
        ] },
        { type: "production", title: "Sen kur", prompt: "Kendini tanıt: 'My name is ...' ve 'I am from ...'" },
        { type: "summary", title: "Özet", content: "My name is ... = adım ..., I am from ... = ...'liyim, Nice to meet you = memnun oldum." },
      ],
    },
  },
  {
    slug: "numbers",
    title: "Sayılar (1–20)",
    level: "A0",
    summary: "Saymak ve yaşını söylemek.",
    content: {
      title: "Sayılar 1–20",
      level: "A0",
      estimatedMinutes: 15,
      focus: ["vocabulary", "listening"],
      sections: [
        { type: "warmup", title: "Hedef", content: "1'den 20'ye kadar saymayı ve yaşını söylemeyi öğreniyoruz." },
        { type: "vocab", title: "1–10", words: [
          { word: "one", tr: "bir" }, { word: "two", tr: "iki" }, { word: "three", tr: "üç" }, { word: "four", tr: "dört" }, { word: "five", tr: "beş" },
          { word: "six", tr: "altı" }, { word: "seven", tr: "yedi" }, { word: "eight", tr: "sekiz" }, { word: "nine", tr: "dokuz" }, { word: "ten", tr: "on" },
        ] },
        { type: "teach", title: "11–20", content: "eleven (11), twelve (12), thirteen (13), fourteen (14), fifteen (15), sixteen (16), seventeen (17), eighteen (18), nineteen (19), twenty (20).\n\n13-19 arası genelde '-teen' ile biter." },
        { type: "teach", title: "Yaş", content: "• How old are you? = Kaç yaşındasın?\n• I am twenty years old. = Yirmi yaşındayım." },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "'seven' kaç?", options: ["6", "7", "8"], answer: "7" },
          { type: "multiple_choice", question: "'How old are you?' ne demek?", options: ["Kaç yaşındasın?", "Nasılsın?", "Nerelisin?"], answer: "Kaç yaşındasın?" },
        ] },
        { type: "summary", title: "Özet", content: "1–20'yi öğrendik. How old are you? = kaç yaşındasın, I am ... years old = ... yaşındayım." },
      ],
    },
  },
  {
    slug: "colors-things",
    title: "Renkler ve Nesneler",
    level: "A0",
    summary: "'This is a ...' ile nesneleri adlandırmak.",
    content: {
      title: "Renkler ve Nesneler",
      level: "A0",
      estimatedMinutes: 15,
      focus: ["vocabulary"],
      sections: [
        { type: "warmup", title: "Hedef", content: "Renkleri ve günlük nesneleri, 'This is a ...' kalıbıyla öğreniyoruz." },
        { type: "vocab", title: "Renkler", words: [
          { word: "red", tr: "kırmızı" }, { word: "blue", tr: "mavi" }, { word: "green", tr: "yeşil" }, { word: "yellow", tr: "sarı" }, { word: "black", tr: "siyah" }, { word: "white", tr: "beyaz" },
        ] },
        { type: "vocab", title: "Nesneler", words: [
          { word: "book", tr: "kitap" }, { word: "table", tr: "masa" }, { word: "pen", tr: "kalem" }, { word: "door", tr: "kapı" }, { word: "car", tr: "araba" },
        ] },
        { type: "teach", title: "Kalıp", content: "• This is a book. = Bu bir kitap.\n• It is red. = O kırmızı.\n• This is a red car. = Bu kırmızı bir araba.\n\nRenk, ismin ÖNÜNE gelir: a red car (kırmızı araba)." },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "'blue' ne demek?", options: ["mavi", "yeşil", "sarı"], answer: "mavi" },
          { type: "multiple_choice", question: "'This is a book.' ne demek?", options: ["Bu bir kitap.", "Kitap nerede?", "Bir kitabım var."], answer: "Bu bir kitap." },
        ] },
        { type: "production", title: "Sen kur", prompt: "Yanındaki bir nesneyi anlat: 'This is a ...'" },
        { type: "summary", title: "Özet", content: "Renkler + nesneler öğrendik. This is a ... = bu bir ..., renk ismin önüne gelir (a red car)." },
      ],
    },
  },
  {
    slug: "days-months",
    title: "Günler ve Aylar",
    level: "A0",
    summary: "Haftanın günleri, aylar, bugün.",
    content: {
      title: "Günler ve Aylar",
      level: "A0",
      estimatedMinutes: 15,
      focus: ["vocabulary"],
      sections: [
        { type: "warmup", title: "Hedef", content: "Haftanın günlerini ve ayları öğreniyoruz." },
        { type: "teach", title: "Günler", content: "Monday (Pazartesi), Tuesday (Salı), Wednesday (Çarşamba), Thursday (Perşembe), Friday (Cuma), Saturday (Cumartesi), Sunday (Pazar).\n\n• Today is Monday. = Bugün Pazartesi.\n• What day is it today? = Bugün günlerden ne?" },
        { type: "teach", title: "Aylar", content: "January, February, March, April, May, June, July, August, September, October, November, December.\n\nİngilizcede günler ve aylar her zaman BÜYÜK harfle yazılır." },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "'Friday' hangi gün?", options: ["Cuma", "Salı", "Pazar"], answer: "Cuma" },
          { type: "multiple_choice", question: "Günler nasıl yazılır?", options: ["Büyük harfle", "Küçük harfle", "Fark etmez"], answer: "Büyük harfle" },
        ] },
        { type: "summary", title: "Özet", content: "Günler ve aylar öğrendik, hepsi büyük harfle yazılır. Today is ... = bugün ..." },
      ],
    },
  },
  {
    slug: "have-like",
    title: "I have / I like",
    level: "A0",
    summary: "Neyin olduğunu ve neyi sevdiğini söylemek.",
    content: {
      title: "I have / I like",
      level: "A0",
      estimatedMinutes: 15,
      focus: ["grammar", "speaking"],
      sections: [
        { type: "warmup", title: "Hedef", content: "Neyin olduğunu (have) ve neyi sevdiğini (like) söylemeyi öğreniyoruz." },
        { type: "teach", title: "have = sahip olmak", content: "• I have a car. = Bir arabam var.\n• I have a brother. = Bir erkek kardeşim var.\n\nhe/she için 'has':\n• She has a cat. = Bir kedisi var." },
        { type: "teach", title: "like = sevmek", content: "• I like coffee. = Kahve severim.\n• I don't like tea. = Çay sevmem.\n• Do you like music? = Müzik sever misin?\n\nhe/she için 'likes': She likes tea." },
        { type: "repeat", title: "Tekrarla", sentence: "I have a car." },
        { type: "repeat", title: "Tekrarla", sentence: "I like coffee." },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "'I have a dog.' ne demek?", options: ["Bir köpeğim var.", "Köpek severim.", "Köpek istiyorum."], answer: "Bir köpeğim var." },
          { type: "multiple_choice", question: "She ___ a cat.", options: ["have", "has", "having"], answer: "has" },
        ] },
        { type: "production", title: "Sen kur", prompt: "Neyi seversin? 'I like ...' ile yaz." },
        { type: "summary", title: "Özet", content: "have = sahip olmak (he/she → has), like = sevmek (he/she → likes)." },
      ],
    },
  },
  {
    slug: "polite",
    title: "Kibar İfadeler",
    level: "A0",
    summary: "Lütfen, teşekkür, özür, izin isteme.",
    content: {
      title: "Kibar İfadeler",
      level: "A0",
      estimatedMinutes: 12,
      focus: ["speaking"],
      sections: [
        { type: "warmup", title: "Hedef", content: "Günlük hayatta çok işine yarayacak kibar ifadeleri öğreniyoruz." },
        { type: "teach", title: "Kalıplar", content: "• Please = Lütfen\n• Thank you / Thanks = Teşekkürler\n• You're welcome = Rica ederim\n• Sorry = Özür dilerim / Pardon\n• Excuse me = Affedersiniz (dikkat çekmek için)\n• Can you help me? = Bana yardım eder misin?" },
        { type: "repeat", title: "Tekrarla", sentence: "Can you help me, please?" },
        { type: "repeat", title: "Tekrarla", sentence: "Thank you very much." },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "'Excuse me' ne için kullanılır?", options: ["Dikkat çekmek/affedersiniz", "Teşekkür", "Veda"], answer: "Dikkat çekmek/affedersiniz" },
          { type: "multiple_choice", question: "'You're welcome' ne demek?", options: ["Rica ederim", "Hoş geldin", "Teşekkürler"], answer: "Rica ederim" },
        ] },
        { type: "summary", title: "Özet", content: "Please, thank you, sorry, excuse me — kibar konuşmanın temeli. Her gün kullan." },
      ],
    },
  },
);

// Ek içerik: Modül 0/1 genişletme + Modül 3 (B1).
FOUNDATIONS.push(
  {
    slug: "family",
    title: "Aile ve İnsanlar",
    level: "A0",
    summary: "Aile üyeleri ve insanları anlatmak.",
    content: {
      title: "Aile ve İnsanlar",
      level: "A0",
      estimatedMinutes: 15,
      focus: ["vocabulary"],
      sections: [
        { type: "warmup", title: "Hedef", content: "Aile üyelerini ve insanları anlatmayı öğreniyoruz." },
        { type: "vocab", title: "Aile", words: [
          { word: "mother", tr: "anne" }, { word: "father", tr: "baba" }, { word: "brother", tr: "erkek kardeş" }, { word: "sister", tr: "kız kardeş" }, { word: "son", tr: "oğul" }, { word: "daughter", tr: "kız evlat" }, { word: "wife", tr: "eş (kadın)" }, { word: "husband", tr: "eş (erkek)" },
        ] },
        { type: "teach", title: "Kalıp", content: "• This is my mother. = Bu benim annem.\n• I have two brothers. = İki erkek kardeşim var.\n• Her name is Ayşe. = Onun (kadın) adı Ayşe.\n\n'my' = benim, 'his' = onun (erkek), 'her' = onun (kadın)." },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "'sister' ne demek?", options: ["kız kardeş", "erkek kardeş", "anne"], answer: "kız kardeş" },
          { type: "multiple_choice", question: "'This is my father.' ne demek?", options: ["Bu benim babam.", "Baban nerede?", "Bir babam var."], answer: "Bu benim babam." },
        ] },
        { type: "production", title: "Sen kur", prompt: "Aileni tanıt: 'I have ...' veya 'This is my ...'" },
        { type: "summary", title: "Özet", content: "Aile kelimeleri + my/his/her. This is my ... = bu benim ..." },
      ],
    },
  },
  {
    slug: "food",
    title: "Yiyecek ve İçecek",
    level: "A0",
    summary: "Yemek isimleri ve 'I want / I'd like'.",
    content: {
      title: "Yiyecek ve İçecek",
      level: "A0",
      estimatedMinutes: 15,
      focus: ["vocabulary", "speaking"],
      sections: [
        { type: "warmup", title: "Hedef", content: "Yiyecek-içecek isimlerini ve sipariş kalıplarını öğreniyoruz." },
        { type: "vocab", title: "Kelimeler", words: [
          { word: "water", tr: "su" }, { word: "bread", tr: "ekmek" }, { word: "coffee", tr: "kahve" }, { word: "tea", tr: "çay" }, { word: "milk", tr: "süt" }, { word: "apple", tr: "elma" }, { word: "chicken", tr: "tavuk" }, { word: "rice", tr: "pilav/pirinç" },
        ] },
        { type: "teach", title: "Sipariş kalıbı", content: "• I want water. = Su istiyorum.\n• I'd like a coffee, please. = Bir kahve istiyorum, lütfen. (kibar)\n• Can I have some bread? = Biraz ekmek alabilir miyim?\n\n'I'd like' = 'I want'in kibar hali." },
        { type: "repeat", title: "Tekrarla", sentence: "I'd like a coffee, please." },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "'water' ne demek?", options: ["su", "ekmek", "süt"], answer: "su" },
          { type: "multiple_choice", question: "Kibar sipariş:", options: ["Give me coffee.", "I'd like a coffee, please.", "Coffee!"], answer: "I'd like a coffee, please." },
        ] },
        { type: "production", title: "Sen kur", prompt: "Bir şey sipariş et: 'I'd like ...'" },
        { type: "summary", title: "Özet", content: "Yiyecek kelimeleri + I'd like ... (kibar istek). Restoran/kafede işine yarar." },
      ],
    },
  },
  {
    slug: "time",
    title: "Saat ve Zaman",
    level: "A1",
    summary: "Saati sormak ve söylemek.",
    content: {
      title: "Saat ve Zaman",
      level: "A1",
      estimatedMinutes: 15,
      focus: ["vocabulary"],
      sections: [
        { type: "warmup", title: "Hedef", content: "Saati sormayı ve söylemeyi öğreniyoruz." },
        { type: "teach", title: "Saat sorma", content: "• What time is it? = Saat kaç?\n• It's three o'clock. = Saat üç.\n• It's half past three. = Saat üç buçuk.\n• It's quarter past three. = Saat üçü çeyrek geçiyor.\n• It's quarter to four. = Dörde çeyrek var." },
        { type: "teach", title: "at ile saat", content: "Bir saatte bir şey yapmak için 'at':\n• I get up at seven. = Yedide kalkarım.\n• The class starts at nine. = Ders dokuzda başlar." },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "'What time is it?' ne demek?", options: ["Saat kaç?", "Ne zaman?", "Kaç tane?"], answer: "Saat kaç?" },
          { type: "multiple_choice", question: "'at seven' ne demek?", options: ["yedide", "yedi tane", "yediye kadar"], answer: "yedide" },
        ] },
        { type: "production", title: "Sen kur", prompt: "Kaçta kalkarsın? 'I get up at ...'" },
        { type: "summary", title: "Özet", content: "What time is it? = saat kaç, It's ... o'clock, saatte iş için 'at'." },
      ],
    },
  },
  {
    slug: "this-that",
    title: "this / that / these / those",
    level: "A1",
    summary: "Bu / şu / bunlar / şunlar.",
    content: {
      title: "this / that / these / those",
      level: "A1",
      estimatedMinutes: 12,
      focus: ["grammar"],
      sections: [
        { type: "warmup", title: "Hedef", content: "Yakın-uzak ve tekil-çoğul nesneleri göstermeyi öğreniyoruz." },
        { type: "teach", title: "Kural", content: "• this = bu (yakın, tekil)\n• that = şu/o (uzak, tekil)\n• these = bunlar (yakın, çoğul)\n• those = şunlar/onlar (uzak, çoğul)\n\n• This is a pen. = Bu bir kalem.\n• Those are cars. = Şunlar araba." },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "'these' ne demek?", options: ["bunlar", "şu", "bu"], answer: "bunlar" },
          { type: "multiple_choice", question: "___ is my book. (yakın, tekil)", options: ["This", "These", "Those"], answer: "This" },
        ] },
        { type: "summary", title: "Özet", content: "this/that tekil (yakın/uzak), these/those çoğul (yakın/uzak)." },
      ],
    },
  },
  {
    slug: "plurals-articles",
    title: "a / an ve Çoğullar",
    level: "A1",
    summary: "Bir tane demek ve çoğul yapmak.",
    content: {
      title: "a / an ve Çoğullar",
      level: "A1",
      estimatedMinutes: 15,
      focus: ["grammar"],
      sections: [
        { type: "warmup", title: "Hedef", content: "'Bir tane' demeyi (a/an) ve çoğul yapmayı öğreniyoruz." },
        { type: "teach", title: "a / an", content: "Tekil sayılabilen nesnelerde 'bir' için:\n• a = sessiz harfle başlayanlar: a book, a car\n• an = sesli harfle başlayanlar (a,e,i,o,u): an apple, an egg, an hour\n\nKural sese göredir: an hour (h okunmaz)." },
        { type: "teach", title: "Çoğul", content: "Çoğul için sona -s eklenir:\n• book → books, car → cars\n• -s, -sh, -ch → -es: bus → buses, watch → watches\n• y → ies: baby → babies\n\nDüzensizler: man → men, woman → women, child → children." },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "___ apple", options: ["a", "an", "the"], answer: "an" },
          { type: "multiple_choice", question: "'child' çoğulu:", options: ["childs", "children", "childes"], answer: "children" },
        ] },
        { type: "production", title: "Sen kur", prompt: "a/an ile bir cümle yaz: 'I have a/an ...'" },
        { type: "summary", title: "Özet", content: "a (sessiz) / an (sesli), çoğul +s (bazıları düzensiz: children, men, women)." },
      ],
    },
  },
  {
    slug: "can",
    title: "can (yapabilmek)",
    level: "A1",
    summary: "Yetenek, izin ve rica.",
    content: {
      title: "can — yapabilmek",
      level: "A1",
      estimatedMinutes: 12,
      focus: ["grammar"],
      sections: [
        { type: "warmup", title: "Hedef", content: "Yetenek (yapabilmek), izin ve rica için 'can' öğreniyoruz." },
        { type: "teach", title: "Kural", content: "can + fiil (düz hali). Herkes için aynı (-s yok):\n• I can swim. = Yüzebilirim.\n• She can drive. = Araba kullanabilir.\n\nOlumsuz: can't (cannot) → I can't come.\nSoru: Can you help me? = Yardım eder misin?" },
        { type: "repeat", title: "Tekrarla", sentence: "Can you help me, please?" },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "'I can swim.' ne demek?", options: ["Yüzebilirim.", "Yüzmeyi severim.", "Yüzdüm."], answer: "Yüzebilirim." },
          { type: "multiple_choice", question: "Doğru:", options: ["She can drives.", "She can drive.", "She cans drive."], answer: "She can drive." },
        ] },
        { type: "production", title: "Sen kur", prompt: "Ne yapabilirsin? 'I can ...'" },
        { type: "summary", title: "Özet", content: "can + fiil = yapabilmek (herkes için aynı, -s yok). can't = yapamaz." },
      ],
    },
  },
  {
    slug: "present-perfect",
    title: "Present Perfect (have + V3)",
    level: "B1",
    summary: "Geçmişte olan ama şimdiyle bağlı olaylar.",
    content: {
      title: "Present Perfect",
      level: "B1",
      estimatedMinutes: 25,
      focus: ["grammar"],
      sections: [
        { type: "warmup", title: "Hedef", content: "'have/has + fiilin 3. hali' yapısını öğreniyoruz. Türklerin en çok zorlandığı zaman." },
        { type: "teach", title: "Mantık", content: "have/has + V3 (fiilin 3. hali).\nGeçmişte oldu ama ŞİMDİYLE bağlantısı var; tam zaman belirtilmez:\n• I have finished. = Bitirdim (şu an bitmiş durumda).\n• She has gone. = Gitti (hâlâ yok).\n\nGeçmiş zamandan farkı: 'I finished at 5' (kesin geçmiş) vs 'I have finished' (sonuç şimdi önemli)." },
        { type: "teach", title: "for / since / just / already / yet", content: "• for = süre: for two years (iki yıldır)\n• since = başlangıç: since 2019\n• just = az önce: I have just eaten.\n• already = zaten: I have already seen it.\n• yet = henüz (olumsuz/soru): I haven't finished yet." },
        { type: "examples", title: "Örnekler", examples: ["I have lived here for five years.", "She has just left.", "Have you ever been to London?", "We haven't eaten yet."] },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "I have ___ my homework.", options: ["do", "did", "done"], answer: "done" },
          { type: "multiple_choice", question: "___ two years kullanımı:", options: ["since", "for", "yet"], answer: "for" },
        ] },
        { type: "production", title: "Sen kur", prompt: "'I have ...' ile bir cümle yaz (ör: I have finished...)." },
        { type: "summary", title: "Özet", content: "Present perfect = have/has + V3. Geçmiş-şimdi bağlantısı. for/since/just/already/yet ile kullanılır." },
      ],
    },
  },
  {
    slug: "modals",
    title: "should / must / have to",
    level: "B1",
    summary: "Tavsiye, zorunluluk ve kurallar.",
    content: {
      title: "should / must / have to",
      level: "B1",
      estimatedMinutes: 20,
      focus: ["grammar"],
      sections: [
        { type: "warmup", title: "Hedef", content: "Tavsiye, zorunluluk ve kural ifadelerini öğreniyoruz." },
        { type: "teach", title: "Kural", content: "Hepsi + fiilin düz hali:\n• should = -meli (tavsiye): You should rest. = Dinlenmelisin.\n• must / have to = zorunluluk: I must go. / I have to work.\n• mustn't = yasak: You mustn't smoke here.\n• don't have to = gerek yok: You don't have to come." },
        { type: "examples", title: "Örnekler", examples: ["You should see a doctor.", "I have to finish this today.", "You mustn't be late.", "We don't have to pay."] },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "Tavsiye: You ___ rest.", options: ["should", "mustn't", "don't have to"], answer: "should" },
          { type: "multiple_choice", question: "'mustn't' ne anlatır?", options: ["yasak", "gerek yok", "tavsiye"], answer: "yasak" },
        ] },
        { type: "production", title: "Sen kur", prompt: "Bir tavsiye ver: 'You should ...'" },
        { type: "summary", title: "Özet", content: "should = -meli (tavsiye), must/have to = zorunluluk, mustn't = yasak, don't have to = gerek yok." },
      ],
    },
  },
  {
    slug: "comparatives",
    title: "Karşılaştırma (bigger, the biggest)",
    level: "B1",
    summary: "Daha büyük, en büyük.",
    content: {
      title: "Karşılaştırma ve Üstünlük",
      level: "B1",
      estimatedMinutes: 20,
      focus: ["grammar"],
      sections: [
        { type: "warmup", title: "Hedef", content: "İki şeyi karşılaştırmayı ve 'en'i öğreniyoruz." },
        { type: "teach", title: "Kural", content: "Kısa sıfatlar (+er / +est):\n• big → bigger → the biggest\n• old → older → the oldest\n\nUzun sıfatlar (more / most):\n• expensive → more expensive → the most expensive\n\nDüzensiz: good → better → the best, bad → worse → the worst." },
        { type: "teach", title: "than ve the", content: "• A is bigger THAN B. = A, B'den daha büyük.\n• A is THE biggest. = A en büyük.\n\nKarşılaştırmada 'than', üstünlükte 'the' kullanılır." },
        { type: "examples", title: "Örnekler", examples: ["My car is faster than yours.", "This is the best restaurant.", "She is taller than me.", "It's the most beautiful city."] },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "'good' üstünlük hali:", options: ["goodest", "the best", "more good"], answer: "the best" },
          { type: "multiple_choice", question: "This is ___ than that.", options: ["big", "bigger", "biggest"], answer: "bigger" },
        ] },
        { type: "production", title: "Sen kur", prompt: "İki şeyi karşılaştır: 'X is ...er than Y.'" },
        { type: "summary", title: "Özet", content: "Kısa: +er/+est. Uzun: more/most. than (karşılaştırma), the (üstünlük). good→better→best." },
      ],
    },
  },
  {
    slug: "conditionals",
    title: "Şart Cümleleri (if)",
    level: "B1",
    summary: "Eğer ... olursa ... olur.",
    content: {
      title: "Şart Cümleleri — if",
      level: "B1",
      estimatedMinutes: 20,
      focus: ["grammar"],
      sections: [
        { type: "warmup", title: "Hedef", content: "'Eğer ... olursa ...' kalıbını öğreniyoruz." },
        { type: "teach", title: "1. tip şart", content: "Gerçek/olası durumlar:\nIf + geniş zaman, will + fiil\n• If it rains, I will stay home. = Yağmur yağarsa evde kalırım.\n• If you study, you will pass. = Çalışırsan geçersin.\n\nDİKKAT: 'if' kısmında 'will' KULLANILMAZ (If it will rain YANLIŞ)." },
        { type: "teach", title: "0. tip (genel gerçek)", content: "Her zaman doğru olan şeyler:\nIf + geniş zaman, geniş zaman\n• If you heat water, it boils. = Suyu ısıtırsan kaynar." },
        { type: "examples", title: "Örnekler", examples: ["If I have time, I will call you.", "If you don't hurry, you will be late.", "If it is hot, I open the window."] },
        { type: "comprehension", title: "Kontrol", questions: [
          { type: "multiple_choice", question: "If it ___, I will stay home.", options: ["rains", "will rain", "rained"], answer: "rains" },
          { type: "multiple_choice", question: "'If you study, you will pass.' ne demek?", options: ["Çalışırsan geçersin.", "Çalıştın ve geçtin.", "Çalışmalısın."], answer: "Çalışırsan geçersin." },
        ] },
        { type: "production", title: "Sen kur", prompt: "Bir şart cümlesi yaz: 'If ..., I will ...'" },
        { type: "summary", title: "Özet", content: "1. tip: If + geniş zaman, will + fiil. 'if' kısmında will yok. Şart → sonuç." },
      ],
    },
  },
);

export const MODULES: Array<{ title: string; note: string; slugs: string[] }> = [
  {
    title: "Modül 0 — Sıfırdan Başlangıç",
    note: "Hiç bilmiyorsan buradan başla.",
    slugs: [
      "greetings",
      "introduce",
      "numbers",
      "colors-things",
      "family",
      "food",
      "days-months",
      "time",
      "have-like",
      "polite",
    ],
  },
  {
    title: "Modül 1 — Temel Gramer (A1)",
    note: "İlk gramer kuralları.",
    slugs: [
      "to-be",
      "this-that",
      "plurals-articles",
      "present-simple",
      "present-continuous",
      "can",
    ],
  },
  {
    title: "Modül 2 — Günlük İngilizce (A2)",
    note: "Zamanlar ve cümle kurma.",
    slugs: [
      "past-simple",
      "future",
      "questions",
      "there-is-are",
      "sentence-structure",
    ],
  },
  {
    title: "Modül 3 — Orta Seviye (B1)",
    note: "İleri yapılar; A2'yi bitirince gel.",
    slugs: ["present-perfect", "modals", "comparatives", "conditionals"],
  },
];

export function getFoundation(slug: string): Foundation | undefined {
  return FOUNDATIONS.find((f) => f.slug === slug);
}
