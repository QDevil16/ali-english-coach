"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Input";
import { Card, CardTitle, CardText } from "@/components/ui/Card";
import { SingleChoice } from "@/components/ui/Choice";
import { ListenButton } from "@/components/lesson/ListenButton";
import { SpeakQuestion } from "@/components/placement/SpeakQuestion";
import type { AIPlacementQuestion, CEFR } from "@/lib/types";

const LEVELS: CEFR[] = ["A0", "A1", "A2", "B1"];

type Result = {
  overall: CEFR;
  skills: Record<string, string>;
  weakPoints: string[];
  strengths: string[];
  recommendation: string;
};

export default function PlacementTestPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<AIPlacementQuestion[] | null>(null);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"loading" | "quiz" | "grading" | "result">(
    "loading",
  );
  const [result, setResult] = useState<Result | null>(null);
  const [chosenLevel, setChosenLevel] = useState<CEFR | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/ai/generate-placement", { method: "POST" });
        const json = await res.json();
        setQuestions(json.questions);
        setPhase("quiz");
      } catch {
        setError("Test yüklenemedi.");
      }
    })();
  }, []);

  if (phase === "loading" || !questions) {
    return (
      <main className="py-8">
        <Container>
          <Card>
            <CardTitle>Seviye testin hazırlanıyor…</CardTitle>
            <CardText>Yapay zekâ sana özel sorular oluşturuyor.</CardText>
          </Card>
          {error && (
            <div className="mt-3">
              <Alert>{error}</Alert>
            </div>
          )}
        </Container>
      </main>
    );
  }

  const q = questions[i];
  const total = questions.length;
  const answered = answers[q.id] !== undefined;

  function setAns(v: string) {
    setAnswers((a) => ({ ...a, [q.id]: v }));
  }

  async function next() {
    if (i + 1 < total) {
      setI(i + 1);
      return;
    }
    setPhase("grading");
    try {
      const res = await fetch("/api/ai/evaluate-placement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions, answers }),
      });
      const json = await res.json();
      const r = json.result as Result;
      setResult(r);
      setChosenLevel((r.overall as CEFR) || "A1");
      setPhase("result");
    } catch {
      setError("Değerlendirilemedi.");
      setPhase("quiz");
    }
  }

  async function confirm() {
    if (!result || !chosenLevel) return;
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
    await supabase.from("placement_tests").insert({
      user_id: user.id,
      answers,
      result,
      confirmed_level: chosenLevel,
    });
    const levels = {
      cefr_level: chosenLevel,
      listening_level: result.skills?.listening ?? chosenLevel,
      speaking_level: result.skills?.speaking ?? chosenLevel,
      grammar_level: result.skills?.grammar ?? chosenLevel,
      vocabulary_level: result.skills?.vocabulary ?? chosenLevel,
      reading_level: result.skills?.reading ?? chosenLevel,
      ai_summary: result.recommendation ?? null,
    };
    const { data: lp } = await supabase
      .from("learner_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (lp)
      await supabase.from("learner_profiles").update(levels).eq("id", lp.id);
    else
      await supabase
        .from("learner_profiles")
        .insert({ user_id: user.id, ...levels });
    setSaving(false);
    router.push("/dashboard");
  }

  if (phase === "grading") {
    return (
      <main className="py-8">
        <Container>
          <Card>
            <CardTitle>Cevapların değerlendiriliyor…</CardTitle>
            <CardText>Yapay zekâ seviyeni belirliyor.</CardText>
          </Card>
        </Container>
      </main>
    );
  }

  if (phase === "result" && result) {
    return (
      <main className="py-8">
        <Container>
          <h1 className="mb-1 text-2xl font-bold text-slate-900">Seviye Sonucun</h1>
          <p className="mb-6 text-sm text-slate-600">
            Yapay zekâ seviyeni{" "}
            <strong className="text-brand">{result.overall}</strong> olarak
            belirledi. Onayla veya değiştir.
          </p>
          <Card className="mb-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(result.skills || {}).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="capitalize text-slate-500">{k}</span>
                  <span className="font-semibold text-slate-800">{v}</span>
                </div>
              ))}
            </div>
          </Card>
          {result.weakPoints?.length > 0 && (
            <Card className="mb-4">
              <CardTitle>Zayıf alanlar</CardTitle>
              <CardText>{result.weakPoints.join(", ")}</CardText>
            </Card>
          )}
          <Card className="mb-4">
            <CardTitle>Öneri</CardTitle>
            <CardText>{result.recommendation}</CardText>
          </Card>
          <div className="mb-6">
            <SingleChoice
              label="Başlangıç seviyeni onayla / değiştir"
              options={LEVELS.map((l) => ({ value: l, label: l }))}
              value={chosenLevel}
              onChange={setChosenLevel}
              columns={4}
            />
          </div>
          {error && (
            <div className="mb-4">
              <Alert>{error}</Alert>
            </div>
          )}
          <Button onClick={confirm} disabled={saving} className="w-full">
            {saving ? "Kaydediliyor..." : `${chosenLevel} ile Başla`}
          </Button>
        </Container>
      </main>
    );
  }

  // quiz
  return (
    <main className="py-8">
      <Container>
        <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
          <span>Seviye Testi (AI)</span>
          <span>
            {i + 1} / {total}
          </span>
        </div>
        <div className="mb-6 h-2 w-full rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-brand transition-all"
            style={{ width: `${((i + 1) / total) * 100}%` }}
          />
        </div>

        <Card className="mb-6">
          <p className="text-lg font-semibold text-slate-900">{q.prompt}</p>
          {q.type === "listen" && q.sentence && (
            <div className="mt-3">
              <ListenButton text={q.sentence} slowText={q.sentence} />
            </div>
          )}
        </Card>

        {q.type === "speak" && q.sentence ? (
          <SpeakQuestion
            sentence={q.sentence}
            answered={answered}
            onResult={() => {}}
            onTranscript={(t) => setAns(t)}
          />
        ) : q.type === "open" ? (
          <textarea
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-light"
            rows={3}
            value={answers[q.id] ?? ""}
            onChange={(e) => setAns(e.target.value)}
            placeholder="Cevabını İngilizce yaz..."
          />
        ) : (
          <div className="space-y-2">
            {(q.options ?? []).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setAns(opt)}
                className={
                  "w-full rounded-xl border px-4 py-3 text-left text-sm " +
                  (answers[q.id] === opt
                    ? "border-brand bg-brand-light text-brand-dark"
                    : "border-slate-300 hover:border-brand")
                }
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        <Button
          onClick={next}
          disabled={!answered && q.type !== "speak" && q.type !== "open"}
          className="mt-6 w-full"
        >
          {i + 1 < total ? "Sonraki" : "Testi Bitir"}
        </Button>
        {(q.type === "speak" || q.type === "open") && (
          <button
            type="button"
            onClick={() => {
              if (!answered) setAns("");
              next();
            }}
            className="mt-2 w-full py-2 text-sm text-slate-400"
          >
            Bu soruyu geç
          </button>
        )}
      </Container>
    </main>
  );
}
