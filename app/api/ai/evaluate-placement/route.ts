import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateJSON } from "@/lib/ai/client";
import { TEACHER_SYSTEM, evaluatePlacementPrompt } from "@/lib/ai/prompts";
import { mockPlacementEvaluation } from "@/lib/ai/mock";
import type { AIPlacementQuestion } from "@/lib/types";

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const questions: AIPlacementQuestion[] = Array.isArray(body?.questions)
    ? body.questions
    : [];
  const answers: Record<string, string> = body?.answers || {};
  if (questions.length === 0)
    return NextResponse.json({ error: "empty" }, { status: 400 });

  const transcript = questions
    .map((q) => {
      const a = answers[q.id] || "(boş)";
      const correct =
        q.answer && (q.type === "mc" || q.type === "listen")
          ? ` [doğru: ${q.answer}]`
          : "";
      return `(${q.skill}/${q.type}) ${q.prompt}${
        q.sentence ? ` "${q.sentence}"` : ""
      } → cevap: ${a}${correct}`;
    })
    .join("\n");

  const { data, mode } = await generateJSON({
    system: TEACHER_SYSTEM,
    user: evaluatePlacementPrompt(transcript),
    mock: () => mockPlacementEvaluation(questions, answers),
    temperature: 0.2,
  });

  return NextResponse.json({ result: data, mode });
}
