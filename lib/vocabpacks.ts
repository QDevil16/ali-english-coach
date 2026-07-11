export type VocabPack = {
  slug: string;
  title: string;
  emoji: string;
  words: Array<{ word: string; tr: string; ex?: string }>;
};

export const VOCAB_PACKS: VocabPack[] = [
  {
    slug: "travel",
    title: "Seyahat",
    emoji: "✈️",
    words: [
      { word: "airport", tr: "havaalanı" }, { word: "ticket", tr: "bilet" }, { word: "passport", tr: "pasaport" }, { word: "luggage", tr: "bagaj" }, { word: "hotel", tr: "otel" }, { word: "room", tr: "oda" }, { word: "map", tr: "harita" }, { word: "station", tr: "istasyon" }, { word: "arrive", tr: "varmak" }, { word: "leave", tr: "ayrılmak" },
    ],
  },
  {
    slug: "restaurant",
    title: "Restoran",
    emoji: "🍽️",
    words: [
      { word: "menu", tr: "menü" }, { word: "order", tr: "sipariş vermek" }, { word: "bill", tr: "hesap" }, { word: "waiter", tr: "garson" }, { word: "drink", tr: "içecek" }, { word: "meal", tr: "yemek/öğün" }, { word: "delicious", tr: "lezzetli" }, { word: "fork", tr: "çatal" }, { word: "spoon", tr: "kaşık" }, { word: "plate", tr: "tabak" },
    ],
  },
  {
    slug: "work",
    title: "İş hayatı",
    emoji: "💼",
    words: [
      { word: "meeting", tr: "toplantı" }, { word: "email", tr: "e-posta" }, { word: "manager", tr: "yönetici" }, { word: "office", tr: "ofis" }, { word: "project", tr: "proje" }, { word: "deadline", tr: "son teslim" }, { word: "customer", tr: "müşteri" }, { word: "salary", tr: "maaş" }, { word: "report", tr: "rapor" }, { word: "colleague", tr: "iş arkadaşı" },
    ],
  },
  {
    slug: "shopping",
    title: "Alışveriş",
    emoji: "🛍️",
    words: [
      { word: "price", tr: "fiyat" }, { word: "cheap", tr: "ucuz" }, { word: "expensive", tr: "pahalı" }, { word: "size", tr: "beden/boyut" }, { word: "money", tr: "para" }, { word: "cash", tr: "nakit" }, { word: "card", tr: "kart" }, { word: "shop", tr: "dükkân" }, { word: "buy", tr: "satın almak" }, { word: "sell", tr: "satmak" },
    ],
  },
  {
    slug: "directions",
    title: "Yön ve şehir",
    emoji: "🗺️",
    words: [
      { word: "left", tr: "sol" }, { word: "right", tr: "sağ" }, { word: "straight", tr: "düz" }, { word: "corner", tr: "köşe" }, { word: "near", tr: "yakın" }, { word: "far", tr: "uzak" }, { word: "street", tr: "sokak" }, { word: "bridge", tr: "köprü" }, { word: "square", tr: "meydan" }, { word: "cross", tr: "karşıya geçmek" },
    ],
  },
  {
    slug: "everyday",
    title: "Günlük fiiller",
    emoji: "🔤",
    words: [
      { word: "go", tr: "gitmek" }, { word: "come", tr: "gelmek" }, { word: "eat", tr: "yemek" }, { word: "drink", tr: "içmek" }, { word: "want", tr: "istemek" }, { word: "need", tr: "ihtiyaç duymak" }, { word: "know", tr: "bilmek" }, { word: "think", tr: "düşünmek" }, { word: "say", tr: "söylemek" }, { word: "understand", tr: "anlamak" },
    ],
  },
];

// En sık kullanılan kelimeler (örnek cümleli) — çekirdek kelime hazinesi.
VOCAB_PACKS.push(
  {
    slug: "core-verbs",
    title: "En sık fiiller",
    emoji: "⭐",
    words: [
      { word: "be", tr: "olmak", ex: "I am happy." },
      { word: "have", tr: "sahip olmak", ex: "I have a car." },
      { word: "do", tr: "yapmak", ex: "I do my homework." },
      { word: "make", tr: "yapmak/üretmek", ex: "I make coffee." },
      { word: "get", tr: "almak/olmak", ex: "I get up early." },
      { word: "go", tr: "gitmek", ex: "I go to work." },
      { word: "know", tr: "bilmek", ex: "I know the answer." },
      { word: "think", tr: "düşünmek", ex: "I think it is good." },
      { word: "take", tr: "almak", ex: "I take the bus." },
      { word: "see", tr: "görmek", ex: "I see a bird." },
      { word: "come", tr: "gelmek", ex: "Come here, please." },
      { word: "want", tr: "istemek", ex: "I want water." },
      { word: "use", tr: "kullanmak", ex: "I use a phone." },
      { word: "find", tr: "bulmak", ex: "I can't find my keys." },
      { word: "give", tr: "vermek", ex: "Give me the book." },
    ],
  },
  {
    slug: "core-adjectives",
    title: "En sık sıfatlar",
    emoji: "⭐",
    words: [
      { word: "good", tr: "iyi", ex: "It is a good day." },
      { word: "bad", tr: "kötü", ex: "The weather is bad." },
      { word: "big", tr: "büyük", ex: "It is a big house." },
      { word: "small", tr: "küçük", ex: "I have a small car." },
      { word: "new", tr: "yeni", ex: "This is my new phone." },
      { word: "old", tr: "eski/yaşlı", ex: "My car is old." },
      { word: "happy", tr: "mutlu", ex: "I am happy today." },
      { word: "easy", tr: "kolay", ex: "This is easy." },
      { word: "hard", tr: "zor", ex: "English is hard." },
      { word: "important", tr: "önemli", ex: "This is important." },
      { word: "beautiful", tr: "güzel", ex: "It is a beautiful city." },
      { word: "different", tr: "farklı", ex: "We are different." },
    ],
  },
  {
    slug: "core-function",
    title: "Bağlaç ve edatlar",
    emoji: "🔗",
    words: [
      { word: "and", tr: "ve", ex: "tea and coffee" },
      { word: "but", tr: "ama", ex: "small but nice" },
      { word: "because", tr: "çünkü", ex: "I stayed because I was tired." },
      { word: "so", tr: "bu yüzden", ex: "It was late, so I left." },
      { word: "if", tr: "eğer", ex: "If it rains, I stay home." },
      { word: "when", tr: "-diğinde", ex: "Call me when you arrive." },
      { word: "in", tr: "içinde/-de", ex: "in the box" },
      { word: "on", tr: "üstünde/-de", ex: "on the table" },
      { word: "at", tr: "-de (nokta)", ex: "at home" },
      { word: "with", tr: "ile", ex: "Come with me." },
      { word: "about", tr: "hakkında", ex: "a book about cats" },
      { word: "for", tr: "için", ex: "This is for you." },
    ],
  },
);

export function getVocabPack(slug: string): VocabPack | undefined {
  return VOCAB_PACKS.find((p) => p.slug === slug);
}
