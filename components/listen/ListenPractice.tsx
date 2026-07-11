"use client";

import { useState } from "react";
import { Card, CardTitle, CardText } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { speak, getSpeechRate } from "@/lib/speech/browserSpeech";
import { scoreSpeech } from "@/lib/speech/score";
import { cn } from "@/lib/utils";

export function ListenPractice({
  title,
  sentences,
}: {
  title: string;
  sentences: string[];
}) {
  const [i, setI] = useState(0);
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const target = sentences[i];
  const done = i >= sentences.length;

  const score = checked ? scoreSpeech(value, target) : null;

  function check() {
    if (!value.trim()) return;
    const s = scoreSpeech(value, target);
    if (s.ratio >= 0.9 && s.extra.length <= 1) setCorrectCount((c) => c + 1);
    setChecked(true);
  }
  function next() {
    setChecked(false);
    setValue("");
    setI((x) => x + 1);
  }

  if (done) {
    return (
      <Card>
        <CardTitle>Bitti 👏</CardTitle>
        <CardText>
          {sentences.length} cümleden {correctCount} tanesini doğru yazdın.
          Duyduğunu anlama böyle gelişir — her gün 5 dakika yap.
        </CardText>
        <div className="mt-4">
          <LinkButton href="/listen" className="w-full">
            Başka set seç
          </LinkButton>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-xs text-slate-500">
        <span>{title}</span>
        <span>{i + 1} / {sentences.length}</span>
      </div>

      <Card>
        <CardText>Dinle ve duyduğunu aşağıya yaz. Metni göremezsin.</CardText>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => speak(target, getSpeechRate())}
            className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            🔊 Dinle
          </button>
          <button
            type="button"
            onClick={() => speak(target, getSpeechRate() * 0.6)}
            className="rounded-xl border border-brand px-4 py-2 text-sm font-semibold text-brand"
          >
            🐢 Yavaş
          </button>
        </div>
      </Card>

      <textarea
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-light"
        rows={2}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={checked}
        placeholder="Duyduğunu buraya yaz..."
      />

      {checked && score && (
        <Card>
          <div
            className={cn(
              "text-sm font-semibold",
              score.exact ? "text-green-600" : "text-amber-600",
            )}
          >
            {score.exact
              ? "Tam doğru! 👏"
              : score.ratio >= 0.9
                ? "Çok iyi, neredeyse tam."
                : "Bir daha dinle, kelimeleri yakala."}
          </div>
          <div className="mt-2 text-sm">
            <div className="text-slate-500">Sen: {value}</div>
            <div className="font-semibold text-slate-900">Doğru: {target}</div>
            {score.missing.length > 0 && (
              <div className="mt-1 text-amber-600">
                Kaçırdığın: {score.missing.join(", ")}
              </div>
            )}
          </div>
        </Card>
      )}

      {!checked ? (
        <Button onClick={check} disabled={!value.trim()} className="w-full">
          Kontrol Et
        </Button>
      ) : (
        <Button onClick={next} className="w-full">
          {i + 1 < sentences.length ? "Sonraki" : "Bitir"}
        </Button>
      )}
    </div>
  );
}
