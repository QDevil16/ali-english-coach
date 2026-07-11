export type VocabPack = {
  slug: string;
  title: string;
  emoji: string;
  words: Array<{ word: string; tr: string }>;
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

export function getVocabPack(slug: string): VocabPack | undefined {
  return VOCAB_PACKS.find((p) => p.slug === slug);
}
