import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Öğrenme verilerini siler; hesap ve onboarding/seviye bilgisi kalır.
export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const tables = [
    "mistakes",
    "lesson_attempts",
    "lessons",
    "curriculums",
    "placement_tests",
    "progress_metrics",
    "ai_memories",
  ];

  for (const t of tables) {
    const { error } = await supabase.from(t).delete().eq("user_id", user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
