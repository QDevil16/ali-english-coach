import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateJSON } from "@/lib/ai/client";
import { TEACHER_SYSTEM, reviewConversationPrompt } from "@/lib/ai/prompts";
import { mockConversationReview } from "@/lib/ai/mock";

type Review = {
  feedbackTr: string;
  corrections: Array<{
    userAnswer: string;
    correct: string;
    explanationTr: string;
    category: string;
  }>;
  words: Array<{ word: string; tr: string }>;
};

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const minutes = Math.max(1, Math.min(Number(body?.timeSpentMinutes) || 5, 60));
  if (messages.length === 0)
    return NextResponse.json({ error: "empty" }, { status: 400 });

  const { data: profile } = await supabase
    .from("learner_profiles")
    .select("cefr_level")
    .eq("user_id", user.id)
    .maybeSingle();
  const level = profile?.cefr_level || "A1";

  const transcript = messages
    .map((m: any) => `${m.role === "user" ? "Ali" : "AI"}: ${m.content}`)
    .join("\n");

  const { data, mode } = await generateJSON<Review>({
    system: TEACHER_SYSTEM,
    user: reviewConversationPrompt(transcript, level),
    mock: () => mockConversationReview(),
    temperature: 0.3,
  });

  // Hataları tekrar sistemine kaydet
  const corrections = Array.isArray(data.corrections) ? data.corrections : [];
  if (corrections.length) {
    await supabase.from("mistakes").insert(
      corrections.slice(0, 5).map((c) => ({
        user_id: user.id,
        category: c.category || "grammar",
        user_answer: c.userAnswer || "",
        correct_answer: c.correct || "",
        explanation_tr: c.explanationTr || "",
        severity: 2,
        repeat_count: 1,
        mastery_score: 0,
        last_seen_at: new Date().toISOString(),
      })),
    );
  }

  // Kelimeleri deftere kaydet (varsa)
  const words = Array.isArray(data.words) ? data.words : [];
  if (words.length) {
    try {
      await supabase.from("vocabulary").upsert(
        words.slice(0, 8).map((w) => ({
          user_id: user.id,
          word: String(w.word || "").toLowerCase().trim(),
          meaning_tr: w.tr || "",
        })),
        { onConflict: "user_id,word", ignoreDuplicates: true },
      );
    } catch {
      // vocabulary tablosu yoksa geç
    }
  }

  // Süreyi ilerlemeye ekle
  const day = new Date().toISOString().slice(0, 10);
  const { data: pm } = await supabase
    .from("progress_metrics")
    .select("id, total_minutes")
    .eq("user_id", user.id)
    .eq("date", day)
    .maybeSingle();
  if (pm) {
    await supabase
      .from("progress_metrics")
      .update({ total_minutes: (pm.total_minutes ?? 0) + minutes })
      .eq("id", pm.id);
  } else {
    await supabase
      .from("progress_metrics")
      .insert({ user_id: user.id, date: day, total_minutes: minutes });
  }

  return NextResponse.json({
    feedbackTr: data.feedbackTr,
    savedMistakes: corrections.length,
    savedWords: words.length,
    mode,
  });
}
