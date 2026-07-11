"use client";

import { useState } from "react";
import { AppShell } from "@/components/ui/AppShell";
import { CardText } from "@/components/ui/Card";
import { ListenPractice } from "@/components/listen/ListenPractice";
import { LISTEN_SETS, getListenSet } from "@/lib/listening";

export default function ListenPage() {
  const [set, setSet] = useState<string | null>(null);

  if (set) {
    const s = getListenSet(set)!;
    return (
      <AppShell title="Dinleme Pratiği">
        <button onClick={() => setSet(null)} className="mb-3 text-sm text-brand">
          ← Set değiştir
        </button>
        <ListenPractice title={s.title} sentences={s.sentences} />
      </AppShell>
    );
  }

  return (
    <AppShell title="Dinleme Pratiği">
      <h1 className="mb-1 text-lg font-bold text-slate-900">
        Dinle ve yaz (dikte)
      </h1>
      <CardText>
        Cümleyi dinle, duyduğunu yaz. Duyduğunu anlama becerisini en çok
        geliştiren egzersiz budur. Her gün birkaç dakika yap.
      </CardText>
      <div className="mt-4 space-y-2">
        {LISTEN_SETS.map((s) => (
          <button
            key={s.slug}
            onClick={() => setSet(s.slug)}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left hover:border-brand"
          >
            <div>
              <div className="font-semibold text-slate-800">{s.title}</div>
              <div className="text-xs text-slate-500">
                {s.sentences.length} cümle
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400">{s.level}</span>
          </button>
        ))}
      </div>
    </AppShell>
  );
}
