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
    title: "Where do you ...? — nerede soruları",
    level,
    estimatedMinutes: 30,
    focus: ["listening", "speaking", "basic questions"],
    sections: [
      {
        type: "warmup",
        title: "Bugünkü hedef",
        content:
          "Bugün 'Where do you ...?' kalıbıyla basit 'nerede' sorularını anlamayı ve kurmayı çalışacağız. Acele yok, tekrar tekrar dinle.",
      },
      {
        type: "listening",
        title: "Dinleme 1",
        sentence: "Where do you live?",
        slowText: "Where ... do ... you ... live?",
        questions: [
          {
            type: "multiple_choice",
            question: "Bu cümle ne anlama geliyor?",
            options: [
              "Nerede yaşıyorsun?",
              "Ne iş yapıyorsun?",
              "Nereye gidiyorsun?",
            ],
            answer: "Nerede yaşıyorsun?",
          },
        ],
      },
      {
        type: "listening",
        title: "Dinleme 2",
        sentence: "Where do you work?",
        slowText: "Where ... do ... you ... work?",
        questions: [
          {
            type: "multiple_choice",
            question: "Bu cümle ne anlama geliyor?",
            options: ["Nerede çalışıyorsun?", "Ne zaman çalışırsın?", "Kiminle çalışırsın?"],
            answer: "Nerede çalışıyorsun?",
          },
        ],
      },
      {
        type: "pattern",
        title: "Kalıp",
        pattern: "Where do you ___?",
        explanationTr:
          "Birine bir şeyi NEREDE yaptığını sormak için kullanılır. Boşluğa fiil gelir: live, work, study, eat...",
        examples: [
          "Where do you live?",
          "Where do you work?",
          "Where do you study?",
          "Where do you eat lunch?",
        ],
      },
      {
        type: "comprehension",
        title: "Anlama",
        questions: [
          {
            type: "multiple_choice",
            question: "'Where do you study?' nasıl cevaplanır?",
            options: [
              "I study at university.",
              "I am fine, thanks.",
              "Yes, I do.",
            ],
            answer: "I study at university.",
          },
        ],
      },
      {
        type: "production",
        title: "Cümle kur",
        prompt: "Bu kalıpla kendi cümleni yaz: Where do you ...?",
      },
      {
        type: "dialogue",
        title: "Mini diyalog",
        content:
          "A: Hi! Where do you live?\nB: I live in Kocaeli.\nA: Nice! Where do you work?\nB: I work in Istanbul.",
      },
      {
        type: "summary",
        title: "Ders özeti",
        content:
          "Bugün 'Where do you ...?' kalıbını dinledik, anladık ve kullandık. Yarın kısa bir tekrarla pekiştireceğiz.",
      },
    ],
  };
}

export function mockEvaluation(
  question: string,
  userAnswer: string,
  expected?: string,
): EvaluationResult {
  // Beklenen cevap yoksa (serbest cümle) AI kapalıyken dil kontrolü yapılamaz.
  // Sahte "hata" verme; cevabı kabul et ve dürüst bilgilendir.
  if (!expected) {
    return {
      correct: true,
      score: 100,
      feedbackTr:
        "Cevabın kaydedildi. (AI kapalı olduğu için otomatik dil kontrolü yapılmadı — açık cevaplar OpenAI anahtarı ile değerlendirilir.)",
    };
  }
  const correct =
    userAnswer.trim().toLowerCase() === expected.trim().toLowerCase();
  return {
    correct,
    score: correct ? 100 : 40,
    feedbackTr: correct
      ? "Çok iyi! Doğru cevap."
      : "Küçük bir hata var, sorun değil. Doğrusu aşağıda.",
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
