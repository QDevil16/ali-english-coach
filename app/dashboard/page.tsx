import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/ui/AppShell";
import { Card, CardTitle, CardText } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { StatCard, SkillRow } from "@/components/dashboard/StatCard";
import { computeStreak } from "@/lib/streak";
import { isDue } from "@/lib/srs";

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

  // Tekrar hazır (spaced repetition) sayısı
  const [{ data: vocab }, { data: dueMistakes }] = await Promise.all([
    supabase
      .from("vocabulary")
      .select("mastery_score, last_seen_at")
      .eq("user_id", user!.id),
    supabase
      .from("mistakes")
      .select("mastery_score, last_seen_at")
      .eq("user_id", user!.id),
  ]);
  const dueCount =
    (vocab ?? []).filter((v) => isDue(v.mastery_score ?? 0, v.last_seen_at))
      .length +
    (dueMistakes ?? []).filter((m) => isDue(m.mastery_score ?? 0, m.last_seen_at))
      .length;

  return (
    <AppShell title="Ali English Coach">
      <div className="space-y-6">
        {profile.ai_summary && (
          <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
            <span className="font-semibold text-slate-900">🎯 Yöntemin: </span>
            {profile.ai_summary}
          </div>
        )}

        {/* Sıfırdan kurs */}
        <Link
          href="/foundations"
          className="block rounded-2xl border border-brand bg-brand-light p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-brand-dark">
                🎓 Sıfırdan İngilizce Kursu
              </div>
              <div className="text-xs text-slate-600">
                Selamlaşma, tanışma, sayılar → zamanlar → cümle kurma. Sırayla öğren.
              </div>
            </div>
            <span className="text-brand">→</span>
          </div>
        </Link>

        {/* Günün oturumu */}
        <Card className="border-brand bg-brand-light">
          <div className="text-xs font-semibold text-brand-dark">
            GÜNÜN OTURUMU
          </div>
          <div className="mb-1 text-[11px] text-slate-500">
            🔁 tekrar → 💡 konu → 👂 dinleme → ✍️ pratik → 🎤 konuşma
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

        {/* Tekrar (spaced repetition) */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/review"
            className="rounded-2xl border border-brand bg-brand-light p-4"
          >
            <div className="text-sm font-semibold text-brand-dark">🔁 Tekrar</div>
            <div className="mt-1 text-2xl font-extrabold text-slate-900">
              {dueCount}
            </div>
            <div className="text-xs text-slate-500">hazır kart</div>
          </Link>
          <Link
            href="/vocabulary"
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="text-sm font-semibold text-slate-700">📚 Kelimelerim</div>
            <div className="mt-1 text-xs text-slate-500">
              öğrendiğin kelimeler ve tekrar
            </div>
          </Link>
        </div>

        {/* Dinleme + Konuşma */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/listen"
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="text-sm font-bold text-slate-900">👂 Dinleme</div>
            <div className="mt-1 text-xs text-slate-500">
              duyduğunu yaz (dikte) — anlama gelişir
            </div>
          </Link>
          <Link
            href="/lesson/practice"
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="text-sm font-bold text-slate-900">🎤 Konuşma</div>
            <div className="mt-1 text-xs text-slate-500">
              senaryolu sohbet: restoran, otel, yön...
            </div>
          </Link>
        </div>

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
