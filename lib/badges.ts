export type Badge = { icon: string; label: string; earned: boolean };

export function computeBadges(stats: {
  lessons: number;
  streak: number;
  words: number;
  mastered: number;
}): Badge[] {
  const { lessons, streak, words, mastered } = stats;
  return [
    { icon: "🎯", label: "İlk ders", earned: lessons >= 1 },
    { icon: "🔥", label: "3 gün seri", earned: streak >= 3 },
    { icon: "⚡", label: "7 gün seri", earned: streak >= 7 },
    { icon: "📚", label: "5 ders", earned: lessons >= 5 },
    { icon: "🏅", label: "20 ders", earned: lessons >= 20 },
    { icon: "📝", label: "10 kelime", earned: words >= 10 },
    { icon: "💎", label: "50 kelime", earned: words >= 50 },
    { icon: "🧠", label: "10 kelime ustası", earned: mastered >= 10 },
  ];
}
