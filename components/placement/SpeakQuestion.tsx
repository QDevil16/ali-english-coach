"use client";

import { useState } from "react";
import {
  recognizeOnce,
  recognitionSupported,
  speak,
} from "@/lib/speech/browserSpeech";
import { scoreSpeech } from "@/lib/speech/score";

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
      const correct = scoreSpeech(t, sentence).ratio >= 0.8;
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
