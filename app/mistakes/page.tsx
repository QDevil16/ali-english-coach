import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/ui/AppShell";
import { Card, CardText } from "@/components/ui/Card";
import { mistakeLabel } from "@/lib/mistakes";

export const dynamic = "force-dynamic";

export default async function MistakesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: mistakes } = await supabase
    .from("mistakes")
    .select("*")
    .eq("user_id", user!.id)
    .order("last_seen_at", { ascending: false })
    .limit(50);

  return (
    <AppShell title="Hatalarım">
      {!mistakes || mistakes.length === 0 ? (
        <Card>
          <CardText>
            Henüz kayıtlı hata yok. Ders çözdükçe zorlandığın noktalar burada
            birikir ve sonraki derslerde tekrar karşına çıkar.
          </CardText>
        </Card>
      ) : (
        <div className="space-y-3">
          {mistakes.map((m) => (
            <Card key={m.id}>
              <div className="mb-1 flex items-center justify-between">
                <span className="rounded-full bg-brand-light px-2 py-0.5 text-xs font-semibold text-brand-dark">
                  {mistakeLabel(m.category)}
                </span>
                {m.repeat_count > 1 && (
                  <span className="text-xs text-slate-400">
                    {m.repeat_count}× tekrar
                  </span>
                )}
              </div>
              {m.user_answer && (
                <p className="text-sm text-red-600 line-through">
                  {m.user_answer}
                </p>
              )}
              {m.correct_answer && (
                <p className="text-sm font-semibold text-green-700">
                  ✓ {m.correct_answer}
                </p>
              )}
              {m.explanation_tr && (
                <p className="mt-1 text-sm text-slate-600">{m.explanation_tr}</p>
              )}
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>Ustalık: {m.mastery_score ?? 0}/5</span>
                {m.last_seen_at && (
                  <span>
                    Son: {new Date(m.last_seen_at).toLocaleDateString("tr-TR")}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
