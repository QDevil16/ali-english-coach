export type Scenario = {
  slug: string;
  title: string;
  emoji: string;
  instruction: string; // AI'ya rol talimatı (İngilizce)
  starter: string; // AI'nın ilk cümlesi
};

export const SCENARIOS: Scenario[] = [
  {
    slug: "free",
    title: "Serbest sohbet",
    emoji: "💬",
    instruction: "Have a free, simple, friendly conversation. Ask about daily life.",
    starter: "Hi Ali! How are you today? (Bugün nasılsın?)",
  },
  {
    slug: "restaurant",
    title: "Restoran",
    emoji: "🍽️",
    instruction:
      "You are a friendly waiter in a restaurant. Help Ali order food and drinks. Ask simple questions (what to eat, drink, for here or takeaway).",
    starter: "Hello! Welcome to our restaurant. What would you like to drink? (Ne içmek istersiniz?)",
  },
  {
    slug: "hotel",
    title: "Otel",
    emoji: "🏨",
    instruction:
      "You are a hotel receptionist. Help Ali check in: name, reservation, how many nights, breakfast.",
    starter: "Good evening! Welcome. Do you have a reservation? (Rezervasyonunuz var mı?)",
  },
  {
    slug: "airport",
    title: "Havaalanı",
    emoji: "✈️",
    instruction:
      "You are airport staff at check-in. Ask for passport, destination, luggage. Keep it simple.",
    starter: "Hello! Can I see your passport, please? Where are you flying to? (Nereye uçuyorsunuz?)",
  },
  {
    slug: "directions",
    title: "Yön sorma",
    emoji: "🗺️",
    instruction:
      "You are a helpful local. Ali is a tourist asking for directions. Give simple directions (left, right, straight).",
    starter: "Hi! You look lost. Do you need help? Where do you want to go? (Nereye gitmek istiyorsun?)",
  },
  {
    slug: "shopping",
    title: "Alışveriş",
    emoji: "🛍️",
    instruction:
      "You are a shop assistant. Help Ali buy something: size, color, price, payment.",
    starter: "Hello! Can I help you? What are you looking for? (Ne arıyorsunuz?)",
  },
  {
    slug: "smalltalk",
    title: "Tanışma / sohbet",
    emoji: "🤝",
    instruction:
      "You just met Ali at a party. Make small talk: name, country, job, hobbies.",
    starter: "Hi! I'm Sam. Nice to meet you. What's your name? (Adın ne?)",
  },
  {
    slug: "job",
    title: "İş görüşmesi",
    emoji: "💼",
    instruction:
      "You are an interviewer in a simple job interview. Ask easy questions: name, experience, why this job. Encourage Ali.",
    starter: "Hello, thanks for coming. Can you tell me a little about yourself? (Kendinden bahseder misin?)",
  },
];

export function getScenario(slug: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.slug === slug);
}
