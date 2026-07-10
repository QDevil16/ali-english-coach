import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/ui/AppShell";
import { Card, CardTitle, CardText } from "@/components/ui/Card";
import { StatCard, SkillRow } from "@/components/dashboard/StatCard";
import { GenerateButton } from "@/components/dashboard/GenerateButton";
import { computeStreak } from "@/lib/streak";
import { computeBadges } from "@/lib/badges";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: metrics }, { data: attempts }, { data: vocab }] =
    await Promise.all([
      supabase
        .from("learner_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle(),
      supabase
        .from("progress_metrics")
        .select("date, total_minutes, completed_lessons")
        .eq("user_id", user!.id)
        .order("date", { ascending: false })
        .limit(30),
      supabase
        .from("lesson_attempts")
        .select("completed_at")
        .eq("user_id", user!.id)
        .not("completed_at", "is", null),
      supabase
        .from("vocabulary")
        .select("mastery_score")
        .eq("user_id", user!.id),
    ]);

  const totalMinutes = (metrics ?? []).reduce(
    (s, m) => s + (m.total_minutes ?? 0),
    0,
  );
  const totalLessons = (metrics ?? []).reduce(
    (s, m) => s + (m.completed_lessons ?? 0),
    0,
  );

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekMinutes = (metrics ?? [])
    .filter((m) => m.date && new Date(m.date) >= weekAgo)
    .reduce((s, m) => s + (m.total_minutes ?? 0), 0);

  const streak = computeStreak(
    (attempts ?? []).map((a) => a.completed_at as string),
  );
  const wordCount = vocab?.length ?? 0;
  const mastered = (vocab ?? []).filter((v) => (v.mastery_score ?? 0) >= 4).length;
  const badges = computeBadges({
    lessons: totalLessons,
    streak,
    words: wordCount,
    mastered,
  });

  return (
    <AppShell title="İlerleme">
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="Seviye" value={profile?.cefr_level ?? "—"} />
          <StatCard label="Ders" value={totalLessons} hint="toplam" />
          <StatCard label="Süre" value={`${totalMinutes}dk`} hint="toplam" />
        </div>

        <Card>
          <CardTitle>Bu hafta</CardTitle>
          <CardText>{weekMinutes} dakika çalıştın.</CardText>
        </Card>

        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-800">Rozetler</h2>
          <div className="grid grid-cols-4 gap-2">
            {badges.map((b) => (
              <div
                key={b.label}
                className={`rounded-xl border p-2 text-center ${
                  b.earned
                    ? "border-brand bg-brand-light"
                    : "border-slate-200 bg-slate-50 opacity-50"
                }`}
              >
                <div className="text-2xl">{b.earned ? b.icon : "🔒"}</div>
                <div className="mt-1 text-[10px] leading-tight text-slate-600">
                  {b.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-800">
            Beceri gelişimin
          </h2>
          <SkillRow
            skills={[
              { label: "Dinleme", level: profile?.listening_level },
              { label: "Konuşma", level: profile?.speaking_level },
              { label: "Gramer", level: profile?.grammar_level },
              { label: "Kelime", level: profile?.vocabulary_level },
              { label: "Okuma", level: profile?.reading_level },
            ]}
          />
        </div>

        <Card>
          <CardTitle>Koç yorumu</CardTitle>
          <CardText>
            {profile?.ai_summary ??
              "Henüz yorum yok. Aşağıdan güncel bir değerlendirme oluşturabilirsin."}
          </CardText>
          <div className="mt-3">
            <GenerateButton
              endpoint="/api/ai/analyze-placement"
              label="Değerlendirmeyi Güncelle"
              loadingLabel="Hazırlanıyor..."
            />
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
