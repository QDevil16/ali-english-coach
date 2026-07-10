export const MISTAKE_LABELS: Record<string, string> = {
  listening: "Dinleme anlama",
  word_order: "Kelime sırası",
  grammar: "Gramer",
  vocabulary: "Kelime",
  pronunciation: "Telaffuz",
  missing_word: "Eksik kelime",
  wrong_tense: "Yanlış zaman",
  translation: "Çeviri düşünme",
  slow_response: "Yavaş cevap",
  not_understanding: "Soruyu anlamama",
};

export function mistakeLabel(category: string | null): string {
  if (!category) return "Diğer";
  return MISTAKE_LABELS[category] ?? category;
}
