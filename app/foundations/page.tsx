import { AppShell } from "@/components/ui/AppShell";
import { CardText } from "@/components/ui/Card";
import { FoundationCard } from "@/components/lesson/FoundationCard";
import { FOUNDATIONS } from "@/lib/foundations";

export const dynamic = "force-dynamic";

export default function FoundationsPage() {
  return (
    <AppShell title="Temeller">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-900">Gramer Temelleri</h1>
        <CardText>
          İngilizcenin kurallarını sırayla, Türkçe anlatımla öğren. Günlük
          derslere başlamadan önce bu temelleri sırayla çalış — hepsi kural →
          örnek → pratik.
        </CardText>
      </div>
      <div className="space-y-3">
        {FOUNDATIONS.map((f, i) => (
          <FoundationCard
            key={f.slug}
            slug={f.slug}
            title={f.title}
            level={f.level}
            summary={f.summary}
            index={i + 1}
          />
        ))}
      </div>
    </AppShell>
  );
}
