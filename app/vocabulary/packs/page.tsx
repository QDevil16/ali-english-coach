"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AppShell } from "@/components/ui/AppShell";
import { Card, CardTitle, CardText } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { speak } from "@/lib/speech/browserSpeech";
import { VOCAB_PACKS } from "@/lib/vocabpacks";

export default function VocabPacksPage() {
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState<string | null>(null);

  async function addPack(slug: string, words: Array<{ word: string; tr: string }>) {
    setBusy(slug);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("vocabulary").upsert(
        words.map((w) => ({
          user_id: user.id,
          word: w.word.toLowerCase(),
          meaning_tr: w.tr,
        })),
        { onConflict: "user_id,word", ignoreDuplicates: true },
      );
    }
    setBusy(null);
    setAdded((a) => ({ ...a, [slug]: true }));
  }

  return (
    <AppShell title="Kelime Paketleri">
      <CardText>
        Temalı kelime setlerini deftere ekle; hepsi tekrar sistemine girer ve
        zamanla karşına çıkıp pekişir.
      </CardText>
      <div className="mt-4 space-y-3">
        {VOCAB_PACKS.map((p) => (
          <Card key={p.slug}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{p.emoji}</span>
                <div>
                  <CardTitle>{p.title}</CardTitle>
                  <CardText>{p.words.length} kelime</CardText>
                </div>
              </div>
              <Button
                variant={added[p.slug] ? "ghost" : "secondary"}
                onClick={() => addPack(p.slug, p.words)}
                disabled={busy === p.slug || added[p.slug]}
                className="shrink-0 px-3 py-2 text-sm"
              >
                {added[p.slug]
                  ? "Eklendi ✓"
                  : busy === p.slug
                    ? "..."
                    : "Deftere ekle"}
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.words.map((w) => (
                <button
                  key={w.word}
                  onClick={() => speak(w.word, 0.9)}
                  className="rounded-lg bg-slate-50 px-2 py-1 text-sm text-slate-700"
                >
                  {w.word} · {w.tr}
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
