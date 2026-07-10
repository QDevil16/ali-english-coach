export type SpeechScore = {
  ratio: number;
  missing: string[];
  extra: string[];
  exact: boolean;
};

function norm(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

// Söylenen ile hedefi kelime kelime karşılaştırır; dürüst puan verir.
export function scoreSpeech(said: string, target: string): SpeechScore {
  const a = norm(said);
  const b = norm(target);
  const aCount: Record<string, number> = {};
  a.forEach((w) => (aCount[w] = (aCount[w] || 0) + 1));

  const missing: string[] = [];
  const usedFromA: Record<string, number> = {};
  for (const w of b) {
    const have = aCount[w] || 0;
    const used = usedFromA[w] || 0;
    if (used < have) usedFromA[w] = used + 1;
    else missing.push(w);
  }
  const bSet = new Set(b);
  const extra = a.filter((w) => !bSet.has(w));

  const matched = b.length - missing.length;
  const ratio = b.length ? matched / b.length : 0;
  const exact = missing.length === 0 && extra.length === 0;
  return { ratio, missing, extra, exact };
}

// Dürüst Türkçe geri bildirim (asla yanlışa "çok iyi" demez).
export function speechFeedback(score: SpeechScore): {
  ok: boolean;
  message: string;
} {
  if (score.exact) return { ok: true, message: "Mükemmel telaffuz! 👏" };
  if (score.ratio >= 0.8 && score.missing.length <= 1)
    return {
      ok: false,
      message:
        score.missing.length > 0
          ? `Neredeyse! Atladığın: “${score.missing.join(", ")}”. Bir daha dene.`
          : "Neredeyse doğru. Bir daha dene.",
    };
  return {
    ok: false,
    message:
      score.missing.length > 0
        ? `Eksik/yanlış. Atladığın kelimeler: “${score.missing.join(", ")}”. Tekrar dene.`
        : "Tam oturmadı, tekrar dene.",
  };
}
