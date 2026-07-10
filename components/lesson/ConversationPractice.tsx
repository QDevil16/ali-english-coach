"use client";

import { useState } from "react";
import { Card, CardText } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Input";
import {
  speak,
  recognizeOnce,
  recognitionSupported,
} from "@/lib/speech/browserSpeech";

type Msg = { role: "assistant" | "user"; content: string };

export function ConversationPractice() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [started, setStarted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [typed, setTyped] = useState("");
  const [note, setNote] = useState<string | null>(null);

  async function ask(history: Msg[]) {
    setBusy(true);
    try {
      const res = await fetch("/api/ai/converse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const json = await res.json();
      const reply: string = json.reply || "Let's talk! How are you?";
      setMessages([...history, { role: "assistant", content: reply }]);
      speak(reply.replace(/\(.*?\)/g, ""), 0.95); // Türkçe ipucu parantezini okuma
    } catch {
      setNote("Bağlanamadı, tekrar dene.");
    } finally {
      setBusy(false);
    }
  }

  function start() {
    setStarted(true);
    ask([]);
  }

  async function sendUser(text: string) {
    if (!text.trim()) return;
    const history = [...messages, { role: "user" as const, content: text }];
    setMessages(history);
    setTyped("");
    await ask(history);
  }

  async function mic() {
    setNote(null);
    if (!recognitionSupported()) {
      setNote("Mikrofon tanıma bu tarayıcıda yok. Chrome/Edge dene veya yazarak cevap ver.");
      return;
    }
    setListening(true);
    try {
      const t = await recognizeOnce();
      await sendUser(t);
    } catch {
      setNote("Duyulamadı, tekrar dene veya yazarak cevap ver.");
    } finally {
      setListening(false);
    }
  }

  if (!started) {
    return (
      <Card>
        <CardText>
          AI seninle basit İngilizce konuşur. O konuşur (sesli duyarsın), sen
          mikrofonla ya da yazarak cevap verirsin. Kısa ve seviyene uygun
          ilerler. Hazır mısın?
        </CardText>
        <div className="mt-4">
          <Button onClick={start} className="w-full">
            Konuşmayı Başlat
          </Button>
        </div>
      </Card>
    );
  }

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "assistant"
                ? "rounded-2xl bg-brand-light px-4 py-3 text-slate-800"
                : "ml-8 rounded-2xl bg-slate-100 px-4 py-3 text-slate-700"
            }
          >
            <div className="text-xs font-semibold text-slate-400">
              {m.role === "assistant" ? "Koç" : "Sen"}
            </div>
            {m.content}
          </div>
        ))}
        {busy && <p className="text-sm text-slate-400">...</p>}
      </div>

      {lastAssistant && (
        <button
          type="button"
          onClick={() => speak(lastAssistant.content.replace(/\(.*?\)/g, ""), 0.95)}
          className="text-sm text-brand"
        >
          🔊 Tekrar dinle
        </button>
      )}

      <div className="flex gap-2">
        <Button onClick={mic} disabled={busy || listening} className="flex-1">
          {listening ? "🎙️ Dinliyorum..." : "🎤 Konuş"}
        </Button>
      </div>

      <div className="flex gap-2">
        <Field
          label=""
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder="veya yazarak cevap ver..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendUser(typed);
          }}
        />
        <Button
          variant="secondary"
          onClick={() => sendUser(typed)}
          disabled={busy}
          className="mt-6 shrink-0"
        >
          Gönder
        </Button>
      </div>

      {note && <p className="text-sm text-amber-600">{note}</p>}
    </div>
  );
}
