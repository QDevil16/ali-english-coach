"use client";

import { useState } from "react";
import { AppShell } from "@/components/ui/AppShell";
import { ConversationPractice } from "@/components/lesson/ConversationPractice";
import { RealtimeVoice } from "@/components/lesson/RealtimeVoice";
import { SCENARIOS, getScenario } from "@/lib/scenarios";
import { cn } from "@/lib/utils";

export default function PracticePage() {
  const [scenario, setScenario] = useState<string | null>(null);
  const [tab, setTab] = useState<"live" | "free">("free");

  if (!scenario) {
    return (
      <AppShell title="Konuşma Pratiği">
        <h1 className="mb-1 text-lg font-bold text-slate-900">
          Ne pratiği yapalım?
        </h1>
        <p className="mb-4 text-sm text-slate-500">
          Bir durum seç; AI o rolde seninle konuşsun.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.slug}
              onClick={() => setScenario(s.slug)}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-left hover:border-brand"
            >
              <div className="text-2xl">{s.emoji}</div>
              <div className="mt-1 text-sm font-semibold text-slate-800">
                {s.title}
              </div>
            </button>
          ))}
        </div>
      </AppShell>
    );
  }

  const sc = getScenario(scenario)!;

  return (
    <AppShell title="Konuşma Pratiği">
      <button
        onClick={() => setScenario(null)}
        className="mb-3 text-sm text-brand"
      >
        ← Durum değiştir
      </button>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl">{sc.emoji}</span>
        <span className="font-semibold text-slate-800">{sc.title}</span>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => setTab("free")}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-semibold",
            tab === "free"
              ? "bg-brand text-white"
              : "border border-slate-300 bg-white text-slate-600",
          )}
        >
          💬 Ücretsiz mod
        </button>
        <button
          onClick={() => setTab("live")}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-semibold",
            tab === "live"
              ? "bg-brand text-white"
              : "border border-slate-300 bg-white text-slate-600",
          )}
        >
          🎙️ Canlı ses
        </button>
      </div>

      {tab === "live" ? (
        <RealtimeVoice key={sc.slug} scenario={sc.slug} />
      ) : (
        <ConversationPractice key={sc.slug} scenario={sc.slug} starter={sc.starter} />
      )}
    </AppShell>
  );
}
