export type ListenSet = {
  slug: string;
  title: string;
  level: string;
  sentences: string[];
};

// Dikte için seviyeli cümle bankası (duyduğunu yaz).
export const LISTEN_SETS: ListenSet[] = [
  {
    slug: "greetings",
    title: "Selamlaşma",
    level: "A0",
    sentences: [
      "Hello, how are you?",
      "Nice to meet you.",
      "See you later.",
      "Have a good day.",
      "What is your name?",
      "Where are you from?",
      "I am fine, thank you.",
      "Good morning, everyone.",
    ],
  },
  {
    slug: "daily",
    title: "Günlük hayat",
    level: "A1",
    sentences: [
      "I get up at seven.",
      "She goes to work by bus.",
      "We have lunch at noon.",
      "He watches TV in the evening.",
      "I don't like coffee.",
      "Do you live near here?",
      "They are at home now.",
      "What do you do every day?",
    ],
  },
  {
    slug: "travel",
    title: "Seyahat",
    level: "A2",
    sentences: [
      "Where is the train station?",
      "How much is a ticket?",
      "Can you help me, please?",
      "I would like a room for two nights.",
      "What time does the bus leave?",
      "Is there a bank near here?",
      "Turn left at the corner.",
      "I am looking for the airport.",
    ],
  },
  {
    slug: "restaurant",
    title: "Restoran",
    level: "A2",
    sentences: [
      "Can I see the menu, please?",
      "I would like a coffee.",
      "How much is it?",
      "The bill, please.",
      "Do you have any water?",
      "This food is delicious.",
      "Can I pay by card?",
      "I don't eat meat.",
    ],
  },
  {
    slug: "work",
    title: "İş hayatı",
    level: "B1",
    sentences: [
      "Can we schedule a meeting?",
      "I will send you an email.",
      "What time works for you?",
      "I have finished the report.",
      "Could you repeat that, please?",
      "Let me check and get back to you.",
      "We need to talk about the project.",
      "Thank you for your help.",
    ],
  },
];

export function getListenSet(slug: string): ListenSet | undefined {
  return LISTEN_SETS.find((s) => s.slug === slug);
}
