import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/ui/AppShell";
import { Card, CardTitle, CardText } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { StatCard, SkillRow } from "@/components/dashboard/StatCard";
import { computeStreak } from "@/lib/streak";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("learner_profiles")
    .select("*")
    .eq("user_id", user!.id)
    .maybeSingle();

  // Profil/seviye yoksa kullanıcıyı yönlendir.
  if (!profile) {
    return (
      <AppShell title="Ali English Coach">
        <Card>
          <CardTitle>Başlayalım</CardTitle>
          <CardText>
            Sana özel plan kurmak için önce kısa tanışma ve seviye testini
            tamamla.
          </CardText>
          <div className="mt-4">
            <LinkButton href="/onboarding" className="w-full">
              Tanışma & Seviye Testi
            </LinkButton>
          </div>
        </Card>
      </AppShell>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const [{ data: todayLesson }, { data: curriculum }, { data: mistakes }, { data: attempts }] =
    await Promise.all([
      supabase
        .from("lessons")
        .select("id, title, status, estimated_minutes")
        .eq("user_id", user!.id)
        .eq("lesson_date", today)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("curriculums")
        .select("id, title")
        .eq("user_id", user!.id)
        .eq("is_active", true)
        .maybeSingle(),
      supabase
        .from("mistakes")
        .select("category, correct_answer, explanation_tr")
        .eq("user_id", user!.id)
        .order("last_seen_at", { ascending: false })
        .limit(3),
      supabase
        .from("lesson_attempts")
        .select("completed_at")
        .eq("user_id", user!.id)
        .not("completed_at", "is", null),
    ]);

  const streak = computeStreak(
    (attempts ?? []).map((a) => a.completed_at as string),
  );
  const completed = attempts?.length ?? 0;

  return (
    <AppShell title="Ali English Coach">
      <div className="space-y-6">
        {/* Bugünkü ders */}
        <Card className="border-brand bg-brand-light">
          <div className="text-xs font-semibold text-brand-dark">
            BUGÜNKÜ DERS
          </div>
          {todayLesson ? (
            <>
              <div className="mt-1 text-lg font-bold text-slate-900">
                {todayLesson.title}
              </div>
              <CardText>
                ~{todayLesson.estimated_minutes ?? 35} dk ·{" "}
                {todayLesson.status === "done" ? "Tamamlandı ✓" : "Hazır"}
              </CardText>
            </>
          ) : (
            <CardText>Bugün için henüz ders yok. Hadi oluşturalım.</CardText>
          )}
          <div className="mt-4">
            <LinkButton href="/lesson/today" className="w-full">
              {todayLesson
                ? todayLesson.status === "done"
                  ? "Dersi Gözden Geçir"
                  : "Derse Başla"
                : "Bugünkü Dersi Oluştur"}
            </LinkButton>
          </div>
        </Card>

        {/* Özet istatistikler */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="Seviye" value={profile.cefr_level ?? "—"} />
          <StatCard label="Seri" value={`${streak}g`} hint="ardışık gün" />
          <StatCard label="Ders" value={completed} hint="tamamlanan" />
        </div>

        {/* Beceri seviyeleri */}
        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-800">
            Beceri seviyelerin
          </h2>
          <SkillRow
            skills={[
              { label: "Dinleme", level: profile.listening_level },
              { label: "Konuşma", level: profile.speaking_level },
              { label: "Gramer", level: profile.grammar_level },
              { label: "Kelime", level: profile.vocabulary_level },
            ]}
          />
        </div>

        {/* Müfredat durumu */}
        <Card>
          <CardTitle>Müfredatın</CardTitle>
          {curriculum ? (
            <>
              <CardText>{curriculum.title}</CardText>
              <Link
                href="/curriculum"
                className="mt-2 inline-block text-sm font-semibold text-brand"
              >
                Planı gör →
              </Link>
            </>
          ) : (
            <>
              <CardText>Henüz kişisel müfredatın yok.</CardText>
              <Link
                href="/curriculum"
                className="mt-2 inline-block text-sm font-semibold text-brand"
              >
                Müfredat oluştur →
              </Link>
            </>
          )}
        </Card>

        {/* Son hatalar */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Son hatalar</h2>
            <Link href="/mistakes" className="text-xs text-brand">
              Tümü
            </Link>
          </div>
          {mistakes && mistakes.length > 0 ? (
            <div className="space-y-2">
              {mistakes.map((m, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2"
                >
                  <div className="text-xs font-medium text-slate-400">
                    {m.category}
                  </div>
                  <div className="text-sm text-slate-700">
                    {m.explanation_tr ?? m.correct_answer}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">Henüz kayıtlı hata yok.</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
