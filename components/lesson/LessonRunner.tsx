"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardTitle, CardText } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Input";
import { ListenButton } from "@/components/lesson/ListenButton";
import { ConversationPractice } from "@/components/lesson/ConversationPractice";
import {
  speak,
  recognizeOnce,
  recognitionSupported,
} from "@/lib/speech/browserSpeech";
import { scoreSpeech, speechFeedback } from "@/lib/speech/score";
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

function categoryFor(t: string): string {
  if (t === "listening") return "listening";
  if (t === "comprehension") return "not_understanding";
  return "grammar";
}

function sectionComplete(
  s: Record<string, any>,
  si: number,
  answers: Record<string, AnswerRecord>,
): boolean {
  const qs = Array.isArray(s.questions) ? s.questions : [];
  for (let qi = 0; qi < qs.length; qi++)
    if (answers[`s${si}q${qi}`] === undefined) return false;
  if (s.type === "production" && s.prompt && answers[`s${si}prod`] === undefined)
    return false;
  return true;
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
  const sections = content.sections ?? [];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>({});
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const record = (id: string, rec: AnswerRecord) =>
    setAnswers((a) => ({ ...a, [id]: rec }));

  const s = (sections[step] ?? {}) as Record<string, any>;
  const canProceed = sectionComplete(s, step, answers);
  const isLast = step === sections.length - 1;

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
    const minutes = Math.max(1, Math.round((Date.now() - startRef.current) / 60000));
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
        body: JSON.stringify({ lessonId, answers, score, timeSpentMinutes: minutes }),
      });
      const json = await res.json();
      setFeedback(json.feedback || "Ders tamamlandı!");
    } catch {
      setError("Kaydedilemedi ama ilerlemen alındı.");
    } finally {
      setFinished(true);
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
      <div>
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>Adım {step + 1} / {sections.length}</span>
          <span>{Math.round(((step + 1) / sections.length) * 100)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-brand transition-all"
            style={{ width: `${((step + 1) / sections.length) * 100}%` }}
          />
        </div>
      </div>

      <Section section={s as unknown as LessonSection} si={step} answers={answers} onAnswer={record} />

      {error && <Alert>{error}</Alert>}

      <div className="flex gap-2">
        {step > 0 && (
          <Button
            variant="ghost"
            onClick={() => setStep(step - 1)}
            className="shrink-0"
          >
            Geri
          </Button>
        )}
        {isLast ? (
          <Button onClick={finish} disabled={!canProceed || saving} className="flex-1">
            {saving ? "Kaydediliyor..." : "Dersi Bitir"}
          </Button>
        ) : (
          <Button onClick={() => setStep(step + 1)} disabled={!canProceed} className="flex-1">
            {canProceed ? "Sonraki Adım →" : "Önce bu adımı tamamla"}
          </Button>
        )}
      </div>
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

  // Faz başlığı — oturumun hangi bölümünde olduğunu gösterir.
  if (s.type === "phase") {
    const icon: Record<string, string> = {
      review: "🔁",
      teach: "💡",
      listen: "👂",
      practice: "✍️",
      speak: "🎤",
    };
    return (
      <div className="rounded-2xl border-2 border-brand bg-brand-light p-6 text-center">
        <div className="text-3xl">{icon[s.phase] ?? "▶️"}</div>
        <div className="mt-2 text-lg font-bold text-brand-dark">{s.title}</div>
        {s.minutes && (
          <div className="mt-1 text-sm text-slate-600">⏱ ~{s.minutes} dakika</div>
        )}
        <div className="mt-2 text-xs text-slate-500">
          Hazır olunca “Sonraki Adım” de.
        </div>
      </div>
    );
  }

  // Konuşma bölümü — öğrendiklerinle sesli sohbet (hatalar tekrara işlenir).
  if (s.type === "conversation") {
    return (
      <Card>
        {s.title && (
          <div className="mb-2 text-xs font-semibold text-brand">
            {String(s.title).toUpperCase()}
          </div>
        )}
        <CardText>
          Öğrendiklerinle kısa bir konuşma yap. Bitirince “Bitir ve
          Değerlendir” de — hataların tekrar sistemine işlensin. Sonra dersi
          bitir.
        </CardText>
        <div className="mt-3">
          <ConversationPractice starter={s.starter} topic={s.topic} />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {s.title && (
        <div className="mb-2 text-xs font-semibold text-brand">
          {String(s.title).toUpperCase()}
        </div>
      )}

      {s.content &&
        (s.type === "teach" || s.type === "correction" ? (
          <div className="rounded-xl bg-brand-light px-4 py-3">
            <p className="whitespace-pre-line leading-relaxed text-slate-800">
              {s.type === "teach" ? "💡 " : "⚠️ "}
              {s.content}
            </p>
          </div>
        ) : (
          <p className="whitespace-pre-line leading-relaxed text-slate-700">
            {s.content}
          </p>
        ))}

      {Array.isArray(s.words) && (
        <ul className="mt-2 space-y-2">
          {s.words.map((w: any, i: number) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
            >
              <span>
                <span className="font-semibold text-slate-900">{w.word}</span>
                <span className="ml-2 text-sm text-slate-500">{w.tr}</span>
              </span>
              <button
                type="button"
                onClick={() => speak(w.word, 0.9)}
                className="text-brand"
              >
                🔊
              </button>
            </li>
          ))}
        </ul>
      )}

      {s.sentence && s.type !== "repeat" && (
        <div className="mt-2">
          <p className="text-lg font-bold text-slate-900">{s.sentence}</p>
          <ListenButton text={s.sentence} slowText={s.slowText} />
        </div>
      )}

      {s.type === "repeat" && s.sentence && (
        <RepeatBox sentence={s.sentence} />
      )}

      {s.pattern && (
        <div className="mt-2">
          <p className="text-lg font-bold text-slate-900">{s.pattern}</p>
          {s.explanationTr && (
            <p className="mt-1 text-sm text-slate-600">{s.explanationTr}</p>
          )}
        </div>
      )}

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

function RepeatBox({ sentence }: { sentence: string }) {
  const [heard, setHeard] = useState<string | null>(null);
  const [fb, setFb] = useState<{ ok: boolean; message: string } | null>(null);
  const [listening, setListening] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function repeat() {
    setNote(null);
    if (!recognitionSupported()) {
      setNote("Mikrofon tanıma bu tarayıcıda yok (Chrome/Edge dene). Yine de dinleyip yüksek sesle tekrarla.");
      return;
    }
    setListening(true);
    try {
      const t = await recognizeOnce();
      setHeard(t);
      setFb(speechFeedback(scoreSpeech(t, sentence)));
    } catch {
      setNote("Duyulamadı, tekrar dene.");
    } finally {
      setListening(false);
    }
  }

  return (
    <div className="mt-2">
      <p className="text-lg font-bold text-slate-900">{sentence}</p>
      <ListenButton text={sentence} />
      <button
        type="button"
        onClick={repeat}
        disabled={listening}
        className="mt-2 w-full rounded-xl border border-brand px-4 py-2 text-sm font-semibold text-brand disabled:opacity-60"
      >
        {listening ? "🎙️ Dinliyorum..." : "🎤 Sen tekrarla"}
      </button>
      {heard && (
        <div className="mt-2 text-sm">
          <p className="text-slate-500">Sen dedin: “{heard}”</p>
          <p className="text-slate-500">Hedef: “{sentence}”</p>
        </div>
      )}
      {fb && (
        <p className={cn("mt-1 text-sm font-semibold", fb.ok ? "text-green-600" : "text-amber-600")}>
          {fb.message}
        </p>
      )}
      {note && <p className="mt-2 text-sm text-amber-600">{note}</p>}
    </div>
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
      <p className="mb-2 text-sm font-medium text-slate-800">{question.question}</p>
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
        <p className={cn("mt-2 text-sm", answered.correct ? "text-green-600" : "text-red-600")}>
          {answered.correct ? "Doğru! 👏" : `Doğrusu: ${correctAnswer}`}
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
  const [fb, setFb] = useState("");
  const [correctAns, setCorrectAns] = useState("");

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
      onAnswer(id, {
        correct: true,
        question: prompt,
        userAnswer: value,
        correctAnswer: "",
        category,
      });
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
        <Button onClick={check} disabled={loading} variant="secondary" className="mt-2 w-full">
          {loading ? "Kontrol ediliyor..." : "Kontrol Et"}
        </Button>
      )}
      {fb && <p className="mt-2 text-sm text-slate-700">{fb}</p>}
      {correctAns && (
        <p className="mt-1 text-sm font-semibold text-green-700">✓ Doğrusu: {correctAns}</p>
      )}
    </div>
  );
}
