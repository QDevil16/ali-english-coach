import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateJSON } from "@/lib/ai/client";
import { TEACHER_SYSTEM, evaluatePrompt } from "@/lib/ai/prompts";
import { mockEvaluation } from "@/lib/ai/mock";
import type { EvaluationResult } from "@/lib/types";

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.question || typeof body?.userAnswer !== "string") {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const { question, userAnswer, expected } = body;

  const { data, mode } = await generateJSON<EvaluationResult>({
    system: TEACHER_SYSTEM,
    user: evaluatePrompt({ question, userAnswer, expected }),
    mock: () => mockEvaluation(question, userAnswer, expected),
    temperature: 0.3,
  });

  return NextResponse.json({ evaluation: data, mode });
}
