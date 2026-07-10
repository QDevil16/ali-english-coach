import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateJSON } from "@/lib/ai/client";
import { TEACHER_SYSTEM, finishLessonPrompt } from "@/lib/ai/prompts";
import { mockFinishSummary } from "@/lib/ai/mock";

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.lessonId) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const {
    lessonId,
    answers = {},
    score = 0,
    timeSpentMinutes = 0,
  } = body;

  const { data: summary, mode } = await generateJSON<{ feedbackTr: string }>({
    system: TEACHER_SYSTEM,
    user: finishLessonPrompt({ answers, score }),
    mock: () => mockFinishSummary(score),
  });

  const { data: attempt, error } = await supabase
    .from("lesson_attempts")
    .insert({
      user_id: user.id,
      lesson_id: lessonId,
      answers,
      score,
      time_spent_minutes: timeSpentMinutes,
      ai_feedback: summary.feedbackTr,
      completed_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: lessonRow } = await supabase
    .from("lessons")
    .update({ status: "done" })
    .eq("id", lessonId)
    .eq("user_id", user.id)
    .select("content")
    .single();

  // Dersteki kelimeleri kelime defterine ekle (varsa mevcut ilerlemeyi bozma).
  try {
    const sections = (lessonRow?.content as any)?.sections ?? [];
    const words: Array<{ user_id: string; word: string; meaning_tr: string }> = [];
    for (const s of sections) {
      if (Array.isArray(s?.words)) {
        for (const w of s.words) {
          if (w?.word)
            words.push({
              user_id: user.id,
              word: String(w.word).toLowerCase().trim(),
              meaning_tr: w.tr ?? "",
            });
        }
      }
    }
    if (words.length) {
      await supabase
        .from("vocabulary")
        .upsert(words, { onConflict: "user_id,word", ignoreDuplicates: true });
    }
  } catch {
    // vocabulary tablosu yoksa sessiz geç.
  }

  // Günlük ilerleme metriğini güncelle (aynı gün ise topla).
  const day = new Date().toISOString().slice(0, 10);
  const { data: pm } = await supabase
    .from("progress_metrics")
    .select("id, total_minutes, completed_lessons")
    .eq("user_id", user.id)
    .eq("date", day)
    .maybeSingle();

  if (pm) {
    await supabase
      .from("progress_metrics")
      .update({
        total_minutes: (pm.total_minutes ?? 0) + timeSpentMinutes,
        completed_lessons: (pm.completed_lessons ?? 0) + 1,
      })
      .eq("id", pm.id);
  } else {
    await supabase.from("progress_metrics").insert({
      user_id: user.id,
      date: day,
      total_minutes: timeSpentMinutes,
      completed_lessons: 1,
    });
  }

  return NextResponse.json({
    feedback: summary.feedbackTr,
    attemptId: attempt.id,
    mode,
  });
}
