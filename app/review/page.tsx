import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/ui/AppShell";
import { ReviewClient, type ReviewItem } from "@/components/review/ReviewClient";
import { isDue } from "@/lib/srs";
import { mistakeLabel } from "@/lib/mistakes";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: vocab }, { data: mistakes }] = await Promise.all([
    supabase
      .from("vocabulary")
      .select("id, word, meaning_tr, mastery_score, last_seen_at")
      .eq("user_id", user!.id)
      .limit(200),
    supabase
      .from("mistakes")
      .select("id, category, correct_answer, explanation_tr, mastery_score, last_seen_at")
      .eq("user_id", user!.id)
      .limit(200),
  ]);

  const items: ReviewItem[] = [];

  for (const v of vocab ?? []) {
    if (isDue(v.mastery_score ?? 0, v.last_seen_at)) {
      items.push({
        type: "vocab",
        id: v.id,
        mastery: v.mastery_score ?? 0,
        front: v.word,
        back: v.meaning_tr || "—",
        speak: v.word,
      });
    }
  }
  for (const m of mistakes ?? []) {
    if (isDue(m.mastery_score ?? 0, m.last_seen_at)) {
      items.push({
        type: "mistake",
        id: m.id,
        mastery: m.mastery_score ?? 0,
        front: m.explanation_tr || mistakeLabel(m.category),
        back: m.correct_answer || "—",
        speak: m.correct_answer || undefined,
      });
    }
  }

  // Karıştır (kelime + hata harmanlanır), en fazla 20 kart.
  items.sort(() => Math.random() - 0.5);
  const limited = items.slice(0, 20);

  return (
    <AppShell title="Tekrar">
      <ReviewClient items={limited} />
    </AppShell>
  );
}
