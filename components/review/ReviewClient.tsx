"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardTitle, CardText } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { speak } from "@/lib/speech/browserSpeech";
import { nextMastery } from "@/lib/srs";

export type ReviewItem = {
  type: "vocab" | "mistake";
  id: string;
  mastery: number;
  front: string;
  back: string;
  speak?: string;
};

export function ReviewClient({ items }: { items: ReviewItem[] }) {
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [known, setKnown] = useState(0);

  if (items.length === 0) {
    return (
      <Card>
        <CardTitle>Tekrar edilecek bir şey yok 🎉</CardTitle>
        <CardText>
          Şu an tekrar zamanı gelmiş kelime veya hata yok. Ders çözdükçe ve
          zaman geçtikçe burada birikir.
        </CardText>
        <div className="mt-4">
          <LinkButton href="/dashboard" className="w-full">
            Panele Dön
          </LinkButton>
        </div>
      </Card>
    );
  }

  if (i >= items.length) {
    return (
      <Card>
        <CardTitle>Tekrar bitti 👏</CardTitle>
        <CardText>
          {items.length} kart gözden geçirdin, {known} tanesini biliyordun.
          Bilmediklerini yakında tekrar göstereceğiz.
        </CardText>
        <div className="mt-4">
          <LinkButton href="/dashboard" className="w-full">
            Panele Dön
          </LinkButton>
        </div>
      </Card>
    );
  }

  const item = items[i];

  async function grade(isKnown: boolean) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const m = nextMastery(item.mastery, isKnown);
    if (user) {
      const table = item.type === "vocab" ? "vocabulary" : "mistakes";
      await supabase
        .from(table)
        .update({
          mastery_score: m,
          last_seen_at: new Date().toISOString(),
        })
        .eq("id", item.id);
    }
    if (isKnown) setKnown((k) => k + 1);
    setRevealed(false);
    setI((x) => x + 1);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-xs text-slate-500">
        <span>{item.type === "vocab" ? "Kelime" : "Hata"} tekrarı</span>
        <span>{i + 1} / {items.length}</span>
      </div>

      <Card className="min-h-[180px]">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-900">{item.front}</p>
          {item.speak && (
            <button
              type="button"
              onClick={() => speak(item.speak!, 0.9)}
              className="mt-2 text-sm text-brand"
            >
              🔊 Dinle
            </button>
          )}
          {revealed && (
            <p className="mt-4 border-t border-slate-100 pt-4 text-lg text-slate-700">
              {item.back}
            </p>
          )}
        </div>
      </Card>

      {!revealed ? (
        <Button onClick={() => setRevealed(true)} className="w-full">
          Göster
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => grade(false)}
            className="flex-1"
          >
            Bilmiyordum
          </Button>
          <Button onClick={() => grade(true)} className="flex-1">
            Biliyordum
          </Button>
        </div>
      )}
    </div>
  );
}
