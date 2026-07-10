import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateJSON } from "@/lib/ai/client";
import { TEACHER_SYSTEM, lessonPrompt } from "@/lib/ai/prompts";
import { mockLesson } from "@/lib/ai/mock";
import type { LessonContent } from "@/lib/types";

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const force = !!body?.force;
  const today = new Date().toISOString().slice(0, 10);

  if (force) {
    // Yenile: bugünün derslerini sil, yenisini üret.
    await supabase
      .from("lessons")
      .delete()
      .eq("user_id", user.id)
      .eq("lesson_date", today)
      .neq("status", "done");
  } else {
    // Bugüne ait ders zaten varsa onu döndür (yeniden üretme).
    const { data: existing } = await supabase
      .from("lessons")
      .select("*")
      .eq("user_id", user.id)
      .eq("lesson_date", today)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (existing) return NextResponse.json({ lesson: existing, mode: "cache" });
  }

  const { data: profile } = await supabase
    .from("learner_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  const { data: curriculum } = await supabase
    .from("curriculums")
    .select("id, plan, level")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();
  const { data: mistakes } = await supabase
    .from("mistakes")
    .select("category, correct_answer, explanation_tr")
    .eq("user_id", user.id)
    .order("last_seen_at", { ascending: false })
    .limit(8);

  // Önceki dersler: tekrar etmesin, üstüne koysun (ilerleyen kurs).
  const { data: past } = await supabase
    .from("lessons")
    .select("title, lesson_date")
    .eq("user_id", user.id)
    .order("lesson_date", { ascending: false })
    .limit(8);

  const { count: doneCount } = await supabase
    .from("lessons")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "done");

  const level = profile?.cefr_level || "A1";

  const { data: content, mode } = await generateJSON<LessonContent>({
    system: TEACHER_SYSTEM,
    user: lessonPrompt({
      profile,
      curriculum: curriculum?.plan,
      mistakes,
      previousLessons: (past ?? []).map((p) => p.title),
      lessonNumber: (doneCount ?? 0) + 1,
    }),
    mock: () => mockLesson(level),
  });

  const { data: row, error } = await supabase
    .from("lessons")
    .insert({
      user_id: user.id,
      curriculum_id: curriculum?.id ?? null,
      title: content.title,
      level: content.level || level,
      focus_skills: content.focus || [],
      estimated_minutes: content.estimatedMinutes || 35,
      lesson_date: today,
      content,
      status: "planned",
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ lesson: row, mode });
}
