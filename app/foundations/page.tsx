import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/ui/AppShell";
import { CardText } from "@/components/ui/Card";
import { FoundationCard } from "@/components/lesson/FoundationCard";
import { MODULES, getFoundation } from "@/lib/foundations";

export const dynamic = "force-dynamic";

export default async function FoundationsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: doneLessons } = await supabase
    .from("lessons")
    .select("title")
    .eq("user_id", user!.id)
    .eq("status", "done");
  const doneTitles = new Set((doneLessons ?? []).map((l) => l.title));

  const all = MODULES.flatMap((m) => m.slugs);
  const doneCount = all.filter((slug) => {
    const f = getFoundation(slug);
    return f && doneTitles.has(f.content.title);
  }).length;

  let counter = 0;

  return (
    <AppShell title="Kurs">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-900">
          Sıfırdan İngilizce Kursu
        </h1>
        <CardText>
          Hiç bilmiyorsan Modül 0'dan başla, sırayla ilerle. Her ders kural →
          örnek → pratik. İlerledikçe günlük derslerle pekiştir.
        </CardText>
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs text-slate-500">
            <span>Kurs ilerlemen</span>
            <span>
              {doneCount} / {all.length}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-brand transition-all"
              style={{ width: `${(doneCount / all.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {MODULES.map((m) => (
          <div key={m.title}>
            <h2 className="text-sm font-bold text-slate-800">{m.title}</h2>
            <p className="mb-2 text-xs text-slate-500">{m.note}</p>
            <div className="space-y-3">
              {m.slugs.map((slug) => {
                const f = getFoundation(slug);
                if (!f) return null;
                counter += 1;
                return (
                  <FoundationCard
                    key={f.slug}
                    slug={f.slug}
                    title={f.title}
                    level={f.level}
                    summary={f.summary}
                    index={counter}
                    done={doneTitles.has(f.content.title)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
