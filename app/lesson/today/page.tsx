import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/ui/AppShell";
import { Card, CardTitle, CardText } from "@/components/ui/Card";
import { GenerateButton } from "@/components/dashboard/GenerateButton";

export const dynamic = "force-dynamic";

export default async function TodayLessonPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const today = new Date().toISOString().slice(0, 10);
  const { data: lesson } = await supabase
    .from("lessons")
    .select("id")
    .eq("user_id", user!.id)
    .eq("lesson_date", today)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lesson) redirect(`/lessons/${lesson.id}`);

  return (
    <AppShell title="Bugünkü Ders">
      <Card>
        <CardTitle>Bugünkü dersini hazırlayalım</CardTitle>
        <CardText>
          Seviyene, hedefine ve son hatalarına göre kısa bir ders oluşturacağız.
          Bir kez üretilir; bugün tekrar gelince aynı ders açılır.
        </CardText>
        <div className="mt-4">
          <GenerateButton
            endpoint="/api/ai/generate-lesson"
            label="Dersi Oluştur"
            loadingLabel="Ders hazırlanıyor..."
          />
        </div>
      </Card>
    </AppShell>
  );
}
