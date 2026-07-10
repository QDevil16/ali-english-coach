"use client";

import { useState } from "react";
import {
  recognizeOnce,
  recognitionSupported,
  speak,
} from "@/lib/speech/browserSpeech";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isMatch(said: string, target: string): boolean {
  const a = normalize(said);
  const b = normalize(target);
  if (!a) return false;
  if (a === b) return true;
  const bw = b.split(" ");
  const aw = new Set(a.split(" "));
  const hit = bw.filter((w) => aw.has(w)).length;
  return hit / bw.length >= 0.6;
}

export function SpeakQuestion({
  sentence,
  answered,
  onResult,
}: {
  sentence: string;
  answered: boolean;
  onResult: (correct: boolean) => void;
}) {
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState<string | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function record() {
    setErr(null);
    if (!recognitionSupported()) {
      setErr(
        "Tarayıcın mikrofonla tanımayı desteklemiyor. Chrome/Edge dene. (Bu soruyu boş geçebilirsin.)",
      );
      return;
    }
    setListening(true);
    try {
      const t = await recognizeOnce();
      setHeard(t);
      const correct = isMatch(t, sentence);
      setOk(correct);
      onResult(correct);
    } catch {
      setErr("Duyulamadı, tekrar dene. (Mikrofon iznini kontrol et.)");
    } finally {
      setListening(false);
    }
  }

  return (
    <div className="mt-4">
      <p className="text-2xl font-bold text-slate-900">{sentence}</p>
      <button
        type="button"
        onClick={() => speak(sentence, 0.9)}
        className="mt-1 text-sm text-brand"
      >
        🔊 Örnek dinle
      </button>

      <div className="mt-3">
        <button
          type="button"
          onClick={record}
          disabled={listening || answered}
          className="w-full rounded-xl bg-brand px-4 py-3 text-base font-semibold text-white disabled:opacity-60"
        >
          {listening ? "🎙️ Dinliyorum..." : answered ? "Kaydedildi" : "🎤 Konuş"}
        </button>
      </div>

      {heard && (
        <p className="mt-2 text-sm text-slate-500">Duydum: “{heard}”</p>
      )}
      {ok !== null && (
        <p
          className={`mt-1 text-sm font-semibold ${
            ok ? "text-green-600" : "text-red-600"
          }`}
        >
          {ok ? "Güzel telaffuz! 👏" : "Yakın değil — sorun değil, kaydettim."}
        </p>
      )}
      {err && <p className="mt-2 text-sm text-amber-600">{err}</p>}
    </div>
  );
}
