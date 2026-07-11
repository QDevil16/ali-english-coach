import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getScenario } from "@/lib/scenarios";

// Canlı sesli diyalog için kısa ömürlü oturum (WebRTC ephemeral key).
export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const scenario = getScenario(body?.scenario || "");

  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_REALTIME_MODEL) {
    return NextResponse.json({
      mode: "disabled",
      note: "Canlı ses kapalı. Sunucuda OPENAI_REALTIME_MODEL tanımlı değil.",
    });
  }

  const { data: profile } = await supabase
    .from("learner_profiles")
    .select("cefr_level")
    .eq("user_id", user.id)
    .maybeSingle();
  const level = profile?.cefr_level || "A1";

  const instructions = `You are Ali's patient English tutor. Ali is Turkish, level ${level}, weak at listening.
Speak slowly and clearly. Use very simple English (A1/A2), short sentences.
Ask one simple question at a time and wait. If Ali makes a mistake, gently give the correct sentence, then continue.
You may add a very short Turkish hint when needed. Keep the conversation going with easy follow-up questions.
${scenario ? `ROLEPLAY: ${scenario.instruction} Stay in this role.` : ""}`;

  const model = process.env.OPENAI_REALTIME_MODEL;

  try {
    const res = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        voice: "alloy",
        modalities: ["audio", "text"],
        instructions,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      return NextResponse.json(
        { mode: "error", reason: err?.error?.message || `HTTP ${res.status}` },
        { status: 200 },
      );
    }
    const session = await res.json();
    return NextResponse.json({ mode: "ai", session, model });
  } catch {
    return NextResponse.json(
      { mode: "error", reason: "OpenAI'ye bağlanılamadı." },
      { status: 200 },
    );
  }
}
