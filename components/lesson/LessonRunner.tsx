"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardTitle, CardText } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Input";
import { ListenButton } from "@/components/lesson/ListenButton";
import { cn } from "@/lib/utils";
import type { LessonContent, LessonSection } from "@/lib/types";

type AnswerRecord = {
  correct: boolean;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  category: string;
  explanation?: string;
};

function categoryFor(sectionType: string): string {
  if (sectionType === "listening") return "listening";
  if (sectionType === "comprehension") return "not_understanding";
  if (sectionType === "production") return "grammar";
  return "grammar";
}

export function LessonRunner({
  lessonId,
  content,
}: {
  lessonId: string;
  content: LessonContent;
}) {
  const router = useRouter();
  const startRef = useRef(Date.now());
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>({});
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function record(id: string, rec: AnswerRecord) {
    setAnswers((a) => ({ ...a, [id]: rec }));
  }

  async function finish() {
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const list = Object.values(answers);
    const correct = list.filter((a) => a.correct).length;
    const score = list.length ? Math.round((correct / list.length) * 100) : 100;
    const minutes = Math.max(
      1,
      Math.round((Date.now() - startRef.current) / 60000),
    );

    const wrong = list.filter((a) => !a.correct);
    if (wrong.length) {
      await supabase.from("mistakes").insert(
        wrong.map((w) => ({
          user_id: user.id,
          lesson_id: lessonId,
          category: w.category,
          user_answer: w.userAnswer,
          correct_answer: w.correctAnswer,
          explanation_tr: w.explanation ?? null,
          severity: 2,
          repeat_count: 1,
          mastery_score: 0,
          last_seen_at: new Date().toISOString(),
        })),
      );
    }

    try {
      const res = await fetch("/api/ai/finish-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          answers,
          score,
          timeSpentMinutes: minutes,
        }),
      });
      const json = await res.json();
      setFeedback(json.feedback || "Ders tamamlandı!");
      setFinished(true);
    } catch {
      setError("Kaydedilemedi ama ilerlemen alındı. Panele dönebilirsin.");
      setFinished(true);
    } finally {
      setSaving(false);
    }
  }

  if (finished) {
    return (
      <Card>
        <CardTitle>Ders tamamlandı 🎉</CardTitle>
        <CardText>{feedback}</CardText>
        {error && (
          <div className="mt-3">
            <Alert>{error}</Alert>
          </div>
        )}
        <div className="mt-4">
          <LinkButton href="/dashboard" className="w-full">
            Panele Dön
          </LinkButton>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {content.sections?.map((s, si) => (
        <Section
          key={si}
          section={s}
          si={si}
          answers={answers}
          onAnswer={record}
        />
      ))}

      {error && <Alert>{error}</Alert>}
      <Button onClick={finish} disabled={saving} className="w-full">
        {saving ? "Kaydediliyor..." : "Dersi Bitir"}
      </Button>
    </div>
  );
}

function Section({
  section,
  si,
  answers,
  onAnswer,
}: {
  section: LessonSection;
  si: number;
  answers: Record<string, AnswerRecord>;
  onAnswer: (id: string, rec: AnswerRecord) => void;
}) {
  const s = section as Record<string, any>;
  const cat = categoryFor(s.type);

  return (
    <Card>
      {s.title && <div className="mb-1 text-xs font-semibold text-brand">{String(s.title).toUpperCase()}</div>}

      {s.content && (
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
          {s.content}
        </p>
      )}

      {/* Dinleme / cümle */}
      {s.sentence && (
        <div className="mt-2">
          <p className="text-lg font-bold text-slate-900">{s.sentence}</p>
          <ListenButton text={s.sentence} slowText={s.slowText} />
        </div>
      )}

      {/* Kalıp */}
      {s.pattern && (
        <div className="mt-2">
          <p className="text-lg font-bold text-slate-900">{s.pattern}</p>
          {s.explanationTr && (
            <p className="mt-1 text-sm text-slate-600">{s.explanationTr}</p>
          )}
        </div>
      )}

      {/* Örnekler */}
      {Array.isArray(s.examples) && (
        <ul className="mt-3 space-y-2">
          {s.examples.map((ex: string, i: number) => (
            <li key={i} className="rounded-xl bg-slate-50 px-3 py-2">
              <span className="text-slate-800">{ex}</span>
              <ListenButton text={ex} />
            </li>
          ))}
        </ul>
      )}

      {/* Çoktan seçmeli sorular */}
      {Array.isArray(s.questions) &&
        s.questions.map((q: any, qi: number) => (
          <McQuestion
            key={qi}
            id={`s${si}q${qi}`}
            question={q}
            category={cat}
            answered={answers[`s${si}q${qi}`]}
            onAnswer={onAnswer}
          />
        ))}

      {/* Üretim (yazılı cevap) */}
      {s.type === "production" && s.prompt && (
        <ProductionBox
          id={`s${si}prod`}
          prompt={s.prompt}
          category={cat}
          answered={answers[`s${si}prod`]}
          onAnswer={onAnswer}
        />
      )}
    </Card>
  );
}

function McQuestion({
  id,
  question,
  category,
  answered,
  onAnswer,
}: {
  id: string;
  question: any;
  category: string;
  answered?: AnswerRecord;
  onAnswer: (id: string, rec: AnswerRecord) => void;
}) {
  const options: string[] = question.options ?? [];
  const correctAnswer: string = question.answer ?? "";

  function pick(opt: string) {
    if (answered) return;
    onAnswer(id, {
      correct: opt === correctAnswer,
      question: question.question ?? "",
      userAnswer: opt,
      correctAnswer,
      category,
    });
  }

  return (
    <div className="mt-4">
      <p className="mb-2 text-sm font-medium text-slate-800">
        {question.question}
      </p>
      <div className="space-y-2">
        {options.map((opt) => {
          const chosen = answered?.userAnswer === opt;
          const isCorrect = opt === correctAnswer;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => pick(opt)}
              disabled={!!answered}
              className={cn(
                "w-full rounded-xl border px-4 py-3 text-left text-sm",
                !answered && "border-slate-300 hover:border-brand",
                answered && isCorrect && "border-green-500 bg-green-50",
                answered && chosen && !isCorrect && "border-red-500 bg-red-50",
                answered && !isCorrect && !chosen && "border-slate-200 opacity-60",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <p
          className={cn(
            "mt-2 text-sm",
            answered.correct ? "text-green-600" : "text-red-600",
          )}
        >
          {answered.correct
            ? "Doğru! 👏"
            : `Doğrusu: ${correctAnswer}`}
        </p>
      )}
    </div>
  );
}

function ProductionBox({
  id,
  prompt,
  category,
  answered,
  onAnswer,
}: {
  id: string;
  prompt: string;
  category: string;
  answered?: AnswerRecord;
  onAnswer: (id: string, rec: AnswerRecord) => void;
}) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [fb, setFb] = useState<string>("");
  const [correctAns, setCorrectAns] = useState<string>("");

  async function check() {
    if (!value.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: prompt, userAnswer: value }),
      });
      const json = await res.json();
      const ev = json.evaluation ?? {};
      setFb(ev.feedbackTr ?? "");
      if (!ev.correct && ev.correctAnswer) setCorrectAns(ev.correctAnswer);
      onAnswer(id, {
        correct: !!ev.correct,
        question: prompt,
        userAnswer: value,
        correctAnswer: ev.correctAnswer ?? "",
        category: ev.mistakeCategory ?? category,
        explanation: ev.feedbackTr,
      });
    } catch {
      setFb("Kontrol edilemedi, yine de devam edebilirsin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3">
      <textarea
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-light"
        rows={2}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!!answered}
        placeholder="Cevabını yaz..."
      />
      {!answered && (
        <Button
          onClick={check}
          disabled={loading}
          variant="secondary"
          className="mt-2 w-full"
        >
          {loading ? "Kontrol ediliyor..." : "Kontrol Et"}
        </Button>
      )}
      {fb && <p className="mt-2 text-sm text-slate-700">{fb}</p>}
      {correctAns && (
        <p className="mt-1 text-sm font-semibold text-green-700">
          ✓ Doğrusu: {correctAns}
        </p>
      )}
    </div>
  );
}
