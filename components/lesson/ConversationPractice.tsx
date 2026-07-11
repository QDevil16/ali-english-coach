"use client";

import { useRef, useState } from "react";
import { Card, CardTitle, CardText } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { Field } from "@/components/ui/Input";
import {
  speak,
  recognizeOnce,
  recognitionSupported,
} from "@/lib/speech/browserSpeech";

type Msg = { role: "assistant" | "user"; content: string };

export function ConversationPractice({
  scenario,
  starter,
  topic,
}: {
  scenario?: string;
  starter?: string;
  topic?: string;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [started, setStarted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [typed, setTyped] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const startRef = useRef(Date.now());
  const [reviewing, setReviewing] = useState(false);
  const [review, setReview] = useState<{
    feedbackTr: string;
    savedMistakes: number;
    savedWords: number;
  } | null>(null);

  const hasUserTurn = messages.some((m) => m.role === "user");

  async function finishAndReview() {
    setReviewing(true);
    try {
      const minutes = Math.round((Date.now() - startRef.current) / 60000);
      const res = await fetch("/api/ai/review-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, timeSpentMinutes: minutes }),
      });
      const json = await res.json();
      setReview({
        feedbackTr: json.feedbackTr || "Sohbet kaydedildi.",
        savedMistakes: json.savedMistakes ?? 0,
        savedWords: json.savedWords ?? 0,
      });
    } catch {
      setNote("Değerlendirme yapılamadı.");
    } finally {
      setReviewing(false);
    }
  }

  async function ask(history: Msg[]) {
    setBusy(true);
    try {
      const res = await fetch("/api/ai/converse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, scenario, topic }),
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
    if (starter) {
      // Senaryo açılış cümlesini hemen göster ve seslendir.
      setMessages([{ role: "assistant", content: starter }]);
      speak(starter.replace(/\(.*?\)/g, ""), 0.95);
    } else {
      ask([]);
    }
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

  if (review) {
    return (
      <Card>
        <CardTitle>Sohbet değerlendirmen 📋</CardTitle>
        <CardText>{review.feedbackTr}</CardText>
        <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          🔁 Tekrar sistemine eklendi: <b>{review.savedMistakes}</b> düzeltme ·{" "}
          <b>{review.savedWords}</b> kelime
        </div>
        <div className="mt-4 space-y-2">
          <LinkButton href="/review" className="w-full">
            Tekrar kartlarına git
          </LinkButton>
          <LinkButton href="/dashboard" variant="secondary" className="w-full">
            Panele dön
          </LinkButton>
        </div>
      </Card>
    );
  }

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

      {hasUserTurn && (
        <Button
          variant="secondary"
          onClick={finishAndReview}
          disabled={reviewing || busy}
          className="w-full"
        >
          {reviewing
            ? "Değerlendiriliyor..."
            : "Bitir ve Değerlendir (hataları kaydet)"}
        </Button>
      )}
    </div>
  );
}
