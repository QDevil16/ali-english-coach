import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/ui/AppShell";
import { Card, CardTitle, CardText } from "@/components/ui/Card";
import { GenerateButton } from "@/components/dashboard/GenerateButton";
import type { CurriculumPlan } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CurriculumPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: row } = await supabase
    .from("curriculums")
    .select("plan, title, level, duration_weeks")
    .eq("user_id", user!.id)
    .eq("is_active", true)
    .maybeSingle();

  const plan = row?.plan as CurriculumPlan | undefined;

  return (
    <AppShell title="Müfredat">
      <div className="mb-4 rounded-xl bg-slate-100 px-4 py-3 text-sm">
        <span className="text-slate-600">
          Hedefin veya öğrenme tarzın değiştiyse{" "}
        </span>
        <a href="/onboarding" className="font-semibold text-brand">
          bilgilerini güncelle
        </a>
        <span className="text-slate-600">
          , sonra planı yeniden oluştur — sistem yeni bilgilere göre kurar.
        </span>
      </div>
      {!plan ? (
        <Card>
          <CardTitle>Kişisel müfredat</CardTitle>
          <CardText>
            Profiline ve seviyene göre 8 haftalık kişisel bir plan oluşturalım.
            Bu bir kez üretilir ve kaydedilir.
          </CardText>
          <div className="mt-4">
            <GenerateButton
              endpoint="/api/ai/generate-curriculum"
              label="Müfredatımı Oluştur"
              loadingLabel="Oluşturuluyor..."
            />
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{plan.title}</h1>
            <p className="text-sm text-slate-500">
              {plan.level} · {plan.durationWeeks} hafta
            </p>
          </div>

          {plan.weeks?.map((w) => (
            <Card key={w.week}>
              <div className="mb-1 text-xs font-semibold text-brand">
                HAFTA {w.week}
              </div>
              <CardTitle>{w.mainTopic}</CardTitle>
              <CardText>{w.goal}</CardText>
              <div className="mt-3 space-y-1 text-sm text-slate-600">
                <div>🎧 Dinleme: {w.listeningGoal}</div>
                <div>🗣️ Konuşma: {w.speakingGoal}</div>
                {w.patterns?.length > 0 && (
                  <div>🔑 Kalıplar: {w.patterns.join(", ")}</div>
                )}
              </div>
              {w.lessons?.length > 0 && (
                <ul className="mt-3 list-inside list-disc text-sm text-slate-500">
                  {w.lessons.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ul>
              )}
            </Card>
          ))}

          <Card>
            <CardText>
              Planı yeniden oluşturmak eskisini pasif yapar ve yenisini kurar.
            </CardText>
            <div className="mt-3">
              <GenerateButton
                endpoint="/api/ai/generate-curriculum"
                label="Planı Yeniden Oluştur"
                loadingLabel="Oluşturuluyor..."
              />
            </div>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
