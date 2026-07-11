"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AppShell } from "@/components/ui/AppShell";
import { Card, CardTitle, CardText } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Input";
import { speak } from "@/lib/speech/browserSpeech";
import { VOCAB_PACKS } from "@/lib/vocabpacks";

export default function VocabPacksPage() {
  const [owned, setOwned] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  async function loadOwned() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from("vocabulary")
      .select("word")
      .eq("user_id", user.id);
    if (error) {
      if (error.code === "42P01" || /does not exist/i.test(error.message)) {
        setError(
          "Kelime tablosu Supabase'de yok. SQL Editor'de supabase/migration-vocabulary.sql dosyasını bir kez çalıştır.",
        );
      }
      setLoaded(true);
      return;
    }
    setOwned(new Set((data ?? []).map((r) => r.word)));
    setLoaded(true);
  }

  useEffect(() => {
    loadOwned();
  }, []);

  async function addPack(
    slug: string,
    words: Array<{ word: string; tr: string; ex?: string }>,
  ) {
    setBusy(slug);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setBusy(null);
      return;
    }
    const { error } = await supabase.from("vocabulary").upsert(
      words.map((w) => ({
        user_id: user.id,
        word: w.word.toLowerCase(),
        meaning_tr: w.tr,
        example: w.ex ?? null,
      })),
      { onConflict: "user_id,word", ignoreDuplicates: true },
    );
    setBusy(null);
    if (error) {
      setError(
        error.code === "42P01" || /does not exist/i.test(error.message)
          ? "Kelime tablosu yok. supabase/migration-vocabulary.sql çalıştır."
          : "Eklenemedi: " + error.message,
      );
      return;
    }
    // Gerçekten eklendi — durumu tazele.
    await loadOwned();
  }

  function packOwned(words: Array<{ word: string }>): boolean {
    return words.every((w) => owned.has(w.word.toLowerCase()));
  }

  return (
    <AppShell title="Kelime Paketleri">
      <CardText>
        Temalı kelime setlerini deftere ekle; hepsi tekrar sistemine girer ve
        zamanla karşına çıkıp pekişir.
      </CardText>
      {error && (
        <div className="mt-3">
          <Alert>{error}</Alert>
        </div>
      )}
      <div className="mt-4 space-y-3">
        {VOCAB_PACKS.map((p) => {
          const already = loaded && packOwned(p.words);
          return (
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
                  variant={already ? "ghost" : "secondary"}
                  onClick={() => addPack(p.slug, p.words)}
                  disabled={busy === p.slug || already}
                  className="shrink-0 px-3 py-2 text-sm"
                >
                  {already
                    ? "Defterinde ✓"
                    : busy === p.slug
                      ? "Ekleniyor..."
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
          );
        })}
      </div>
    </AppShell>
  );
}
