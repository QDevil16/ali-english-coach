import type { CEFR, PlacementQuestion, PlacementResult } from "@/lib/types";

function levelFromPct(pct: number): CEFR {
  // Sıkı eşikler: kolay soruları bilmek A2/B1 anlamına gelmez.
  if (pct < 0.4) return "A0";
  if (pct < 0.65) return "A1";
  if (pct < 0.85) return "A2";
  return "B1";
}

const CATEGORY_TR: Record<string, string> = {
  vocabulary: "Kelime",
  grammar: "Gramer",
  reading: "Okuma",
  listening: "Dinleme",
  speaking: "Konuşma",
  sentence: "Cümle kurma",
};

export function computeResult(
  questions: PlacementQuestion[],
  answers: Record<string, number>,
): PlacementResult {
  const perCat: Record<string, { correct: number; total: number }> = {};
  let rawScore = 0;

  for (const q of questions) {
    perCat[q.category] ??= { correct: 0, total: 0 };
    perCat[q.category].total += 1;
    if (answers[q.id] === q.answerIndex) {
      perCat[q.category].correct += 1;
      rawScore += 1;
    }
  }

  const skills: Record<string, CEFR> = {};
  const scored: Array<{ cat: string; pct: number }> = [];
  for (const [cat, v] of Object.entries(perCat)) {
    const pct = v.total ? v.correct / v.total : 0;
    skills[cat] = levelFromPct(pct);
    scored.push({ cat, pct });
  }

  scored.sort((a, b) => a.pct - b.pct);
  const weakPoints = scored.slice(0, 2).map((s) => CATEGORY_TR[s.cat] ?? s.cat);
  const strengths = scored
    .slice(-2)
    .filter((s) => s.pct >= 0.5)
    .map((s) => CATEGORY_TR[s.cat] ?? s.cat);

  const overall = levelFromPct(rawScore / questions.length);
  const recommendedStart =
    overall === "A0"
      ? "Çok temel kalıplar ve dinleme ile başla."
      : overall === "A1"
        ? "Temel sorular ve günlük kalıplarla başla."
        : overall === "A2"
          ? "Kısa diyaloglar ve geçmiş zaman ile ilerle."
          : "Akıcılık ve daha uzun cümlelerle ilerle.";

  return {
    overall,
    rawScore,
    total: questions.length,
    skills,
    weakPoints,
    strengths,
    recommendedStart,
  };
}
