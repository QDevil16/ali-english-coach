import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/ui/AppShell";
import { Card, CardText } from "@/components/ui/Card";
import { isDue } from "@/lib/srs";

export const dynamic = "force-dynamic";

export default async function VocabularyPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: words } = await supabase
    .from("vocabulary")
    .select("id, word, meaning_tr, mastery_score, last_seen_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(300);

  const list = words ?? [];
  const dueCount = list.filter((w) =>
    isDue(w.mastery_score ?? 0, w.last_seen_at),
  ).length;

  return (
    <AppShell title="Kelimelerim">
      <Link
        href="/vocabulary/packs"
        className="mb-4 block rounded-xl border border-brand bg-brand-light px-4 py-3 text-center text-sm font-semibold text-brand-dark"
      >
        ＋ Temalı kelime paketleri (seyahat, iş, restoran...)
      </Link>
      {list.length === 0 ? (
        <Card>
          <CardText>
            Henüz kelime yok. Ders çözdükçe öğrendiğin kelimeler buraya eklenir
            ve tekrar sistemine girer.
          </CardText>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">{list.length} kelime</span>
            {dueCount > 0 && (
              <Link
                href="/review"
                className="rounded-xl bg-brand px-3 py-1.5 text-sm font-semibold text-white"
              >
                {dueCount} kelime tekrarı →
              </Link>
            )}
          </div>
          <div className="space-y-2">
            {list.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <div>
                  <div className="font-semibold text-slate-900">{w.word}</div>
                  <div className="text-sm text-slate-500">{w.meaning_tr}</div>
                </div>
                <div className="flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <span
                      key={n}
                      className={
                        n < (w.mastery_score ?? 0)
                          ? "text-brand"
                          : "text-slate-200"
                      }
                    >
                      ●
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
