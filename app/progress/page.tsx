import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/ui/AppShell";
import { Card, CardTitle, CardText } from "@/components/ui/Card";
import { StatCard, SkillRow } from "@/components/dashboard/StatCard";
import { GenerateButton } from "@/components/dashboard/GenerateButton";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: metrics }] = await Promise.all([
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
