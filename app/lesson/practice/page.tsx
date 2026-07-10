"use client";

import { useState } from "react";
import { AppShell } from "@/components/ui/AppShell";
import { ConversationPractice } from "@/components/lesson/ConversationPractice";
import { RealtimeVoice } from "@/components/lesson/RealtimeVoice";
import { cn } from "@/lib/utils";

export default function PracticePage() {
  const [tab, setTab] = useState<"live" | "free">("live");

  return (
    <AppShell title="Konuşma Pratiği">
      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => setTab("live")}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-semibold",
            tab === "live"
              ? "bg-brand text-white"
              : "bg-white text-slate-600 border border-slate-300",
          )}
        >
          🎙️ Canlı ses
        </button>
        <button
          onClick={() => setTab("free")}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-semibold",
            tab === "free"
              ? "bg-brand text-white"
              : "bg-white text-slate-600 border border-slate-300",
          )}
        >
          💬 Ücretsiz mod
        </button>
      </div>

      {tab === "live" ? <RealtimeVoice /> : <ConversationPractice />}
    </AppShell>
  );
}
