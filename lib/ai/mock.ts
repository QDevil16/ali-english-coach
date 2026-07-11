import type {
  AIPlacementQuestion,
  CurriculumPlan,
  EvaluationResult,
  LessonContent,
  PlacementAnalysis,
} from "@/lib/types";
import { PLACEMENT_QUESTIONS } from "@/lib/placement/questions";

const CATEGORY_TR: Record<string, string> = {
  vocabulary: "Kelime",
  grammar: "Gramer",
  reading: "Okuma",
  listening: "Dinleme",
  speaking: "Konuşma",
  sentence: "Cümle kurma",
};

// AI kapalıyken: statik bankayı AI soru formatına çevir.
export function mockPlacementQuestions(): AIPlacementQuestion[] {
  return PLACEMENT_QUESTIONS.map((q) => {
    if (q.speak)
      return {
        id: q.id,
        skill: "speaking",
        type: "speak" as const,
        prompt: q.prompt,
        sentence: q.sentence,
      };
    const type = q.audio ? ("listen" as const) : ("mc" as const);
    return {
      id: q.id,
      skill: q.category,
      type,
      prompt: q.prompt,
      options: q.options,
      answer: q.options[q.answerIndex],
      sentence: q.sentence,
    };
  });
}

function levelFromPct(pct: number): string {
  if (pct < 0.4) return "A0";
  if (pct < 0.65) return "A1";
  if (pct < 0.85) return "A2";
  return "B1";
}

// AI kapalıyken: çoktan seçmeli/dinleme doğruluğundan seviye tahmini.
export function mockPlacementEvaluation(
  questions: AIPlacementQuestion[],
  answers: Record<string, string>,
) {
  let correct = 0;
  let total = 0;
  const perSkill: Record<string, { c: number; t: number }> = {};
  for (const q of questions) {
    if ((q.type === "mc" || q.type === "listen") && q.answer) {
      total += 1;
      perSkill[q.skill] ??= { c: 0, t: 0 };
      perSkill[q.skill].t += 1;
      if ((answers[q.id] || "").trim() === q.answer.trim()) {
        correct += 1;
        perSkill[q.skill].c += 1;
      }
    }
  }
  const overall = levelFromPct(total ? correct / total : 0);
  const skills: Record<string, string> = {};
  const scored: Array<{ s: string; pct: number }> = [];
  for (const [s, v] of Object.entries(perSkill)) {
    const pct = v.t ? v.c / v.t : 0;
    skills[s] = levelFromPct(pct);
    scored.push({ s, pct });
  }
  scored.sort((a, b) => a.pct - b.pct);
  return {
    overall,
    skills,
    weakPoints: scored.slice(0, 2).map((x) => CATEGORY_TR[x.s] ?? x.s),
    strengths: scored
      .slice(-1)
      .filter((x) => x.pct >= 0.5)
      .map((x) => CATEGORY_TR[x.s] ?? x.s),
    recommendation:
      "Her gün kısa dinleme ve tekrar ile başla. (AI kapalı — bu tahmin çoktan seçmeli cevaplara dayanır.)",
  };
}

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
    method:
      "Sana özel yaklaşım: az gramer, bol tekrar ve dinleme; kısa adımlar; her oturumun sonunda öğrendiklerinle kısa konuşma. Türkçe destekli ilerleriz. (AI kapalı — açınca kişiselleşir.)",
    weeks: w,
  };
}

export function mockLesson(level: string): LessonContent {
  return {
    title: "Günün Oturumu — Where do you ...?",
    level,
    estimatedMinutes: 30,
    focus: ["grammar", "listening", "speaking"],
    sections: [
      { type: "phase", phase: "review", title: "Isınma / dünün tekrarı", minutes: 5 },
      {
        type: "warmup",
        title: "Bugünkü hedef",
        content:
          "Bugün 'Where do you ...?' kalıbıyla 'nerede' sorularını öğrenip, dinleyip, konuşacağız. Oturum 5 kısa bölümden oluşur; acele yok.",
      },
      { type: "phase", phase: "teach", title: "Yeni konu", minutes: 10 },
      {
        type: "teach",
        title: "Mantığı öğren",
        content:
          "Türkçede 'Nerede yaşıyorsun?' dersin. İngilizcede soru kurarken yardımcı fiil 'do' eklenir:\nWhere + do + you + live? = Where do you live?\n'do'nun Türkçe karşılığı yoktur; 'bu bir soru' demenin yoludur.",
      },
      {
        type: "vocab",
        title: "Kelimeler",
        words: [
          { word: "live", tr: "yaşamak" },
          { word: "work", tr: "çalışmak" },
          { word: "study", tr: "okumak" },
          { word: "city", tr: "şehir" },
        ],
      },
      {
        type: "teach",
        title: "Dikkat: sık hata",
        content:
          "'Where you live?' DEME — 'do' eksik. Doğrusu: 'Where DO you live?'. Soru kelimesinden sonra do/does gelir.",
      },
      {
        type: "pattern",
        title: "Kalıp",
        pattern: "Where do you ___?",
        explanationTr: "Boşluğa fiil gelir: live, work, study, eat...",
        examples: ["Where do you live?", "Where do you work?", "Where do you study?"],
      },
      { type: "phase", phase: "listen", title: "Dinleme", minutes: 7 },
      {
        type: "listening",
        title: "Dinleme 1",
        sentence: "Where do you live?",
        slowText: "Where ... do ... you ... live?",
        questions: [
          {
            type: "multiple_choice",
            question: "Bu cümle ne anlama geliyor?",
            options: ["Nerede yaşıyorsun?", "Ne iş yapıyorsun?", "Nereye gidiyorsun?"],
            answer: "Nerede yaşıyorsun?",
          },
        ],
      },
      { type: "repeat", title: "Dinle ve tekrarla", sentence: "Where do you work?" },
      { type: "phase", phase: "practice", title: "Pratik", minutes: 5 },
      {
        type: "comprehension",
        title: "Anlama",
        questions: [
          {
            type: "multiple_choice",
            question: "'Where do you study?' nasıl cevaplanır?",
            options: ["I study at university.", "I am fine, thanks.", "Yes, I do."],
            answer: "I study at university.",
          },
        ],
      },
      {
        type: "production",
        title: "Cümle kur",
        prompt: "Bu kalıpla kendi cümleni yaz: Where do you ...?",
      },
      { type: "phase", phase: "speak", title: "Öğrendiklerinle konuş", minutes: 6 },
      {
        type: "conversation",
        title: "Kısa konuşma",
        topic: "asking where people live and work",
        starter: "Hi Ali! Where do you live? (Nerede yaşıyorsun?)",
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

const MOCK_TURNS = [
  "Hi Ali! How are you today? (Bugün nasılsın?)",
  "Good! Where do you live? (Nerede yaşıyorsun?)",
  "Nice. What do you do? (Ne iş yaparsın?)",
  "Great. Do you like English? (İngilizceyi sever misin?)",
  "Well done! Say one thing you did today. (Bugün yaptığın bir şey söyle.)",
  "Good job! Let's stop here. See you tomorrow! (Yarın görüşürüz!)",
];

export function mockConversationReply(turnIndex: number): string {
  return MOCK_TURNS[Math.min(turnIndex, MOCK_TURNS.length - 1)];
}

export function mockConversationReview(): {
  feedbackTr: string;
  corrections: Array<{
    userAnswer: string;
    correct: string;
    explanationTr: string;
    category: string;
  }>;
  words: Array<{ word: string; tr: string }>;
} {
  return {
    feedbackTr:
      "Güzel konuştun! (AI kapalı olduğu için otomatik hata analizi yapılamadı — gerçek düzeltmeler OpenAI anahtarı ile gelir.)",
    corrections: [],
    words: [],
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
