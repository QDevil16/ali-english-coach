import type {
  CurriculumPlan,
  EvaluationResult,
  LessonContent,
  PlacementAnalysis,
} from "@/lib/types";

export function mockPlacementAnalysis(level: string): PlacementAnalysis {
  return {
    aiSummary: `Seviyen ${level}. Dinleme ve temel kalıplarda pratik sana en çok yardımcı olur. Kısa ve düzenli çalışırsan hızlı ilerlersin.`,
    weakPoints: ["Dinleme", "Cümle kurma"],
    strengths: ["Motivasyon"],
    recommendation:
      "Her gün kısa dinleme ve 1-2 kalıp tekrarı ile başla. Ezber yerine tekrar kullan.",
  };
}

export function mockCurriculum(level: string, weeks: number): CurriculumPlan {
  const topics = [
    "Selamlaşma ve kendini tanıtma",
    "Basit sorular: nerede / ne / kim",
    "Günlük rutin",
    "Alışveriş ve sayılar",
    "Yön sorma ve tarif etme",
    "Geçmiş zaman ile basit anlatım",
    "Plan ve gelecek",
    "Kısa diyaloglarla akıcılık",
  ];
  const w = Array.from({ length: weeks }, (_, k) => {
    const topic = topics[k % topics.length];
    return {
      week: k + 1,
      goal: `${topic} konusunu anlamak ve kullanmak`,
      mainTopic: topic,
      listeningGoal: "Kısa cümleleri yavaş ve normal hızda anlamak",
      speakingGoal: "Kalıpları kendi cümlende kullanmak",
      patterns: ["Where do you ...?", "I ... every day."],
      reviewMistakes: ["Kelime sırası", "Dinleme"],
      lessons: [`${topic} - Ders 1`, `${topic} - Ders 2`, `${topic} - Tekrar`],
    };
  });
  return {
    title: `${level} seviyesi için kişisel plan`,
    level,
    durationWeeks: weeks,
    weeks: w,
  };
}

export function mockLesson(level: string): LessonContent {
  return {
    title: "Where do you live? kalıbı",
    level,
    estimatedMinutes: 35,
    focus: ["listening", "speaking", "basic questions"],
    sections: [
      {
        type: "warmup",
        title: "Bugünkü hedef",
        content: "Bugün basit 'nerede' sorularını anlamayı çalışacağız.",
      },
      {
        type: "listening",
        title: "Kısa dinleme",
        sentence: "Where do you live?",
        slowText: "Where ... do ... you ... live?",
        questions: [
          {
            type: "multiple_choice",
            question: "Bu soru ne anlama geliyor?",
            options: ["Nerede yaşıyorsun?", "Ne iş yapıyorsun?", "Nereye gidiyorsun?"],
            answer: "Nerede yaşıyorsun?",
          },
        ],
      },
      {
        type: "pattern",
        title: "Kalıp",
        pattern: "Where do you ...?",
        explanationTr: "Birine nerede bir şey yaptığını sormak için kullanılır.",
        examples: ["Where do you live?", "Where do you work?", "Where do you study?"],
      },
      {
        type: "production",
        title: "Cümle kur",
        prompt: "Kendi cümleni yaz: Where do you ...?",
      },
      {
        type: "summary",
        title: "Ders özeti",
        content: "Bugün 'Where do you ...?' kalıbını öğrendik. Yarın tekrar edeceğiz.",
      },
    ],
  };
}

export function mockEvaluation(
  question: string,
  userAnswer: string,
  expected?: string,
): EvaluationResult {
  const correct =
    !!expected &&
    userAnswer.trim().toLowerCase() === expected.trim().toLowerCase();
  return {
    correct,
    score: correct ? 100 : 40,
    feedbackTr: correct
      ? "Çok iyi! Doğru cevap."
      : "Küçük bir hata var, sorun değil. Doğru şeklini gör ve tekrar dene.",
    correctAnswer: expected,
    mistakeCategory: correct ? undefined : "grammar",
  };
}

export function mockFinishSummary(score: number): { feedbackTr: string } {
  return {
    feedbackTr:
      score >= 70
        ? "Bugün güzel gitti! Kalıbı iyi kullandın. Yarın kısa bir tekrar yapacağız."
        : "İyi bir başlangıç. Zorlandığın yerleri yarın tekrar çalışacağız, merak etme.",
  };
}
