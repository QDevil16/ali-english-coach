import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/ui/AppShell";
import { LessonRunner } from "@/components/lesson/LessonRunner";
import type { LessonContent } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, title, level, estimated_minutes, content")
    .eq("id", params.id)
    .eq("user_id", user!.id)
    .maybeSingle();

  if (!lesson) notFound();

  const content = lesson.content as LessonContent;

  return (
    <AppShell title="Ders">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-900">{lesson.title}</h1>
        <p className="text-sm text-slate-500">
          {lesson.level} · ~{lesson.estimated_minutes ?? 35} dk
        </p>
      </div>
      <LessonRunner lessonId={lesson.id} content={content} />
    </AppShell>
  );
}
