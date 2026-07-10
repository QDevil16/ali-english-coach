// Tamamlanan ders tarihlerinden ardışık gün serisini (streak) hesaplar.
export function computeStreak(dates: string[]): number {
  const days = new Set(dates.map((d) => d.slice(0, 10)));
  if (days.size === 0) return 0;

  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  // Bugün veya dün başlamıyorsa seri kopmuştur.
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (!days.has(iso(today)) && !days.has(iso(yesterday))) return 0;

  let streak = 0;
  const cursor = new Date(today);
  if (!days.has(iso(today))) cursor.setDate(cursor.getDate() - 1);

  while (days.has(iso(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
