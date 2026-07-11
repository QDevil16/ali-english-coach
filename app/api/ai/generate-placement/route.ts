import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateJSON } from "@/lib/ai/client";
import { TEACHER_SYSTEM, generatePlacementPrompt } from "@/lib/ai/prompts";
import { mockPlacementQuestions } from "@/lib/ai/mock";
import type { AIPlacementQuestion } from "@/lib/types";

export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, mode } = await generateJSON<{ questions: AIPlacementQuestion[] }>({
    system: TEACHER_SYSTEM,
    user: generatePlacementPrompt(),
    mock: () => ({ questions: mockPlacementQuestions() }),
    temperature: 0.5,
  });

  const questions =
    Array.isArray(data?.questions) && data.questions.length > 0
      ? data.questions
      : mockPlacementQuestions();

  return NextResponse.json({ questions, mode });
}
