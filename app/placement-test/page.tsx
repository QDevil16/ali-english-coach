"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Input";
import { Card, CardTitle, CardText } from "@/components/ui/Card";
import { SingleChoice } from "@/components/ui/Choice";
import { ListenButton } from "@/components/lesson/ListenButton";
import { SpeakQuestion } from "@/components/placement/SpeakQuestion";
import { PLACEMENT_QUESTIONS } from "@/lib/placement/questions";
import { computeResult } from "@/lib/placement/score";
import type { CEFR } from "@/lib/types";

const LEVELS: CEFR[] = ["A0", "A1", "A2", "B1"];

export default function PlacementTestPage() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const [chosenLevel, setChosenLevel] = useState<CEFR | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const q = PLACEMENT_QUESTIONS[i];
  const total = PLACEMENT_QUESTIONS.length;

  const result = useMemo(
    () => (done ? computeResult(PLACEMENT_QUESTIONS, answers) : null),
    [done, answers],
  );

  function pick(idx: number) {
    setAnswers((a) => ({ ...a, [q.id]: idx }));
  }

  function next() {
    if (answers[q.id] === undefined) return;
    if (i + 1 < total) setI(i + 1);
    else {
      const r = computeResult(PLACEMENT_QUESTIONS, answers);
      setChosenLevel(r.overall);
      setDone(true);
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

    const { error: e1 } = await supabase.from("placement_tests").insert({
      user_id: user.id,
      answers,
      raw_score: result.rawScore,
      result,
      confirmed_level: chosenLevel,
    });

    const { data: lp } = await supabase
      .from("learner_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    const levels = {
      cefr_level: chosenLevel,
      listening_level: result.skills.listening ?? chosenLevel,
      speaking_level: result.skills.speaking ?? chosenLevel,
      grammar_level: result.skills.grammar ?? chosenLevel,
      vocabulary_level: result.skills.vocabulary ?? chosenLevel,
      reading_level: result.skills.reading ?? chosenLevel,
    };

    const e2 = lp
      ? (await supabase.from("learner_profiles").update(levels).eq("id", lp.id))
          .error
      : (
          await supabase
            .from("learner_profiles")
            .insert({ user_id: user.id, ...levels })
        ).error;

    setSaving(false);
    if (e1 || e2) {
      setError("Kaydedilemedi. Tekrar dene.");
      return;
    }
    router.push("/dashboard");
  }

  if (done && result) {
    return (
      <main className="py-8">
        <Container>
          <h1 className="mb-1 text-2xl font-bold text-slate-900">
            Seviye Sonucun
          </h1>
          <p className="mb-6 text-sm text-slate-600">
            Sistem seviyeni{" "}
            <strong className="text-brand">{result.overall}</strong> olarak
            ölçtü. Bu seviyeden başlamak ister misin? İstersen değiştir.
          </p>

          <Card className="mb-4">
            <CardText>
              Doğru: {result.rawScore}/{result.total}
            </CardText>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {Object.entries(result.skills).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="capitalize text-slate-500">{k}</span>
                  <span className="font-semibold text-slate-800">{v}</span>
                </div>
              ))}
            </div>
          </Card>

          {result.weakPoints.length > 0 && (
            <Card className="mb-4">
              <CardTitle>Zayıf alanlar</CardTitle>
              <CardText>{result.weakPoints.join(", ")}</CardText>
            </Card>
          )}

          <Card className="mb-4">
            <CardTitle>Önerilen başlangıç</CardTitle>
            <CardText>{result.recommendedStart}</CardText>
          </Card>

          <div className="mb-6">
            <SingleChoice
              label="Başlangıç seviyeni onayla veya değiştir"
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

  return (
    <main className="py-8">
      <Container>
        <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
          <span>Seviye Testi</span>
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
          {q.helpTr && (
            <p className="mt-1 text-sm text-slate-500">{q.helpTr}</p>
          )}

          {q.audio && q.sentence && (
            <div className="mt-3">
              <ListenButton text={q.sentence} slowText={q.sentence} />
            </div>
          )}
        </Card>

        {q.speak && q.sentence ? (
          <SpeakQuestion
            sentence={q.sentence}
            answered={answers[q.id] !== undefined}
            onResult={(correct) =>
              setAnswers((a) => ({ ...a, [q.id]: correct ? 1 : 0 }))
            }
          />
        ) : (
          <SingleChoice
            label=""
            options={q.options.map((o, idx) => ({ value: idx, label: o }))}
            value={answers[q.id] ?? null}
            onChange={pick}
            columns={1}
          />
        )}

        <Button
          onClick={next}
          disabled={answers[q.id] === undefined}
          className="mt-6 w-full"
        >
          {q.speak && answers[q.id] === undefined
            ? "Önce konuş (veya geç)"
            : i + 1 < total
              ? "Sonraki"
              : "Testi Bitir"}
        </Button>
        {q.speak && (
          <button
            type="button"
            onClick={() => setAnswers((a) => ({ ...a, [q.id]: 0 }))}
            className="mt-2 w-full py-2 text-sm text-slate-400"
          >
            Bu soruyu geç
          </button>
        )}
      </Container>
    </main>
  );
}
