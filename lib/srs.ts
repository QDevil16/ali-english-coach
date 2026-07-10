// Basit aralıklı tekrar (Leitner). mastery arttıkça tekrar aralığı uzar.
const INTERVAL_DAYS = [1, 2, 4, 8, 16, 30];

export function intervalDays(mastery: number): number {
  return INTERVAL_DAYS[Math.min(Math.max(mastery, 0), INTERVAL_DAYS.length - 1)];
}

export function isDue(mastery: number, lastSeen: string | null): boolean {
  if (!lastSeen) return true;
  const due = new Date(lastSeen);
  due.setDate(due.getDate() + intervalDays(mastery));
  return due <= new Date();
}

export function nextMastery(mastery: number, known: boolean): number {
  return known ? Math.min(5, mastery + 1) : 0;
}
