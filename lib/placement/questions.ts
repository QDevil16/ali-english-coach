import type { PlacementQuestion } from "@/lib/types";

// Metin tabanlı seviye testi (20 soru). Dinleme soruları anlam odaklıdır.
export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // vocabulary
  { id: "v1", category: "vocabulary", prompt: '"apple" ne demek?', options: ["elma", "masa", "araba", "kapı"], answerIndex: 0 },
  { id: "v2", category: "vocabulary", prompt: '"water" ne demek?', options: ["ateş", "su", "toprak", "hava"], answerIndex: 1 },
  { id: "v3", category: "vocabulary", prompt: '"tired" ne demek?', options: ["mutlu", "aç", "yorgun", "hızlı"], answerIndex: 2 },
  { id: "v4", category: "vocabulary", prompt: '"expensive" ne demek?', options: ["ucuz", "pahalı", "kolay", "zor"], answerIndex: 1 },

  // grammar
  { id: "g1", category: "grammar", prompt: "She ___ a teacher.", options: ["am", "is", "are", "be"], answerIndex: 1 },
  { id: "g2", category: "grammar", prompt: "They ___ football every Sunday.", options: ["plays", "playing", "play", "played"], answerIndex: 2 },
  { id: "g3", category: "grammar", prompt: "I ___ to school yesterday.", options: ["go", "goes", "went", "going"], answerIndex: 2 },
  { id: "g4", category: "grammar", prompt: "There ___ some milk in the fridge.", options: ["is", "are", "have", "has"], answerIndex: 0 },
  { id: "g5", category: "grammar", prompt: "He has ___ working since morning.", options: ["be", "being", "been", "was"], answerIndex: 2 },

  // reading
  { id: "r1", category: "reading", prompt: 'Metin: "Tom is a doctor. He works in a hospital." Tom nerede çalışır?', options: ["okulda", "hastanede", "markette", "evde"], answerIndex: 1 },
  { id: "r2", category: "reading", prompt: 'Metin: "The shop opens at 9 and closes at 6." Dükkân kaçta kapanır?', options: ["9", "6", "18:00 (6)", "cevap yok"], answerIndex: 2 },
  { id: "r3", category: "reading", prompt: 'Metin: "Ann likes tea but she doesn\'t like coffee." Ann neyi sevmez?', options: ["çay", "kahve", "su", "süt"], answerIndex: 1 },
  { id: "r4", category: "reading", prompt: 'Metin: "We will travel to Italy next summer." Ne zaman?', options: ["geçen yaz", "gelecek yaz", "kışın", "şimdi"], answerIndex: 1 },

  // listening (anlam)
  { id: "l1", category: "listening", prompt: '"Where do you live?" ne anlama gelir?', helpTr: "Kalıbı düşün.", options: ["Ne iş yaparsın?", "Nerede yaşıyorsun?", "Nereye gidiyorsun?", "Kaç yaşındasın?"], answerIndex: 1 },
  { id: "l2", category: "listening", prompt: '"How much is it?" ne anlama gelir?', options: ["Nasılsın?", "Bu ne kadar?", "Kaç tane?", "Nerede?"], answerIndex: 1 },
  { id: "l3", category: "listening", prompt: '"Can you help me, please?" ne anlama gelir?', options: ["Bana yardım eder misin?", "Beni duyuyor musun?", "Sen kimsin?", "Ne zaman?"], answerIndex: 0 },
  { id: "l4", category: "listening", prompt: '"I don\'t understand." ne anlama gelir?', options: ["Anlamıyorum.", "Katılmıyorum.", "Bilmiyorum.", "Duymuyorum."], answerIndex: 0 },

  // sentence building
  { id: "s1", category: "sentence", prompt: 'Doğru sıralama: "you / are / how"', options: ["Are you how?", "How are you?", "You are how?", "How you are?"], answerIndex: 1 },
  { id: "s2", category: "sentence", prompt: 'Doğru sıralama: "name / is / my / Ali"', options: ["My name is Ali.", "Name my is Ali.", "Is my name Ali.", "Ali my name is."], answerIndex: 0 },
  { id: "s3", category: "sentence", prompt: 'Doğru sıralama: "coffee / like / I / don\'t"', options: ["I don't like coffee.", "I like don't coffee.", "Don't I like coffee.", "Coffee I don't like."], answerIndex: 0 },
];
