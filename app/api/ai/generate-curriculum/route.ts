import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateJSON } from "@/lib/ai/client";
import { TEACHER_SYSTEM, curriculumPrompt } from "@/lib/ai/prompts";
import { mockCurriculum } from "@/lib/ai/mock";
import type { CurriculumPlan } from "@/lib/types";

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const weeks = Math.min(Math.max(Number(body?.weeks) || 8, 4), 12);

  const { data: profile } = await supabase
    .from("learner_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  const level = profile?.cefr_level || "A1";

  const { data: plan, mode } = await generateJSON<CurriculumPlan>({
    system: TEACHER_SYSTEM,
    user: curriculumPrompt(profile, weeks),
    mock: () => mockCurriculum(level, weeks),
  });

  // Eski aktif müfredatı pasifleştir, yenisini ekle.
  await supabase
    .from("curriculums")
    .update({ is_active: false })
    .eq("user_id", user.id)
    .eq("is_active", true);

  const { data: row, error } = await supabase
    .from("curriculums")
    .insert({
      user_id: user.id,
      title: plan.title,
      level: plan.level || level,
      duration_weeks: plan.durationWeeks || weeks,
      plan,
      is_active: true,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ curriculum: row, mode });
}
