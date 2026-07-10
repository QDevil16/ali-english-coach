import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateJSON } from "@/lib/ai/client";
import { TEACHER_SYSTEM, analyzePlacementPrompt } from "@/lib/ai/prompts";
import { mockPlacementAnalysis } from "@/lib/ai/mock";
import type { PlacementAnalysis } from "@/lib/types";

export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("learner_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: test } = await supabase
    .from("placement_tests")
    .select("result, confirmed_level")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const level = test?.confirmed_level || profile?.cefr_level || "A1";

  const { data, mode } = await generateJSON<PlacementAnalysis>({
    system: TEACHER_SYSTEM,
    user: analyzePlacementPrompt({ profile, test }),
    mock: () => mockPlacementAnalysis(level),
  });

  if (profile) {
    await supabase
      .from("learner_profiles")
      .update({ ai_summary: data.aiSummary })
      .eq("id", profile.id);
  }

  return NextResponse.json({ analysis: data, mode });
}
