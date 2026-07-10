"use client";

import { speak, getSpeechRate } from "@/lib/speech/browserSpeech";

export function ListenButton({
  text,
  slowText,
}: {
  text: string;
  slowText?: string;
}) {
  return (
    <div className="mt-2 flex gap-2">
      <button
        type="button"
        onClick={() => speak(text, getSpeechRate())}
        className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
      >
        🔊 Dinle
      </button>
      <button
        type="button"
        onClick={() => speak(slowText || text, getSpeechRate() * 0.6)}
        className="rounded-xl border border-brand px-4 py-2 text-sm font-semibold text-brand"
      >
        🐢 Yavaş Dinle
      </button>
    </div>
  );
}
