import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getScenario } from "@/lib/scenarios";

// Canlı sesli diyalog için kısa ömürlü oturum (WebRTC ephemeral key).
// OpenAI realtime API iki sürümde farklı uçlar kullanır; ikisini de dener.
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
  const model = process.env.OPENAI_REALTIME_MODEL;
  const key = process.env.OPENAI_API_KEY;

  const instructions = `You are Ali's patient English tutor. Ali is Turkish, level ${level}, weak at listening.
Speak slowly and clearly. Use very simple English (A1/A2), short sentences.
Ask one simple question at a time and wait. If Ali makes a mistake, gently give the correct sentence, then continue.
You may add a very short Turkish hint when needed. Keep the conversation going with easy follow-up questions.
${scenario ? `ROLEPLAY: ${scenario.instruction} Stay in this role.` : ""}`;

  const auth = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

  // 1) GA uç: /v1/realtime/client_secrets
  try {
    const res = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: auth,
      body: JSON.stringify({
        session: {
          type: "realtime",
          model,
          instructions,
          audio: { output: { voice: "alloy" } },
        },
      }),
    });
    if (res.ok) {
      const j = await res.json();
      const ephemeralKey = j?.value || j?.client_secret?.value;
      if (ephemeralKey) {
        return NextResponse.json({
          mode: "ai",
          ephemeralKey,
          connectUrl: `https://api.openai.com/v1/realtime/calls?model=${encodeURIComponent(model)}`,
          model,
        });
      }
    }
  } catch {
    // beta'ya düş
  }

  // 2) Beta uç: /v1/realtime/sessions
  try {
    const res = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: auth,
      body: JSON.stringify({ model, voice: "alloy", modalities: ["audio", "text"], instructions }),
    });
    if (res.ok) {
      const j = await res.json();
      const ephemeralKey = j?.client_secret?.value;
      if (ephemeralKey) {
        return NextResponse.json({
          mode: "ai",
          ephemeralKey,
          connectUrl: `https://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}`,
          model,
        });
      }
    }
    const err = await res.json().catch(() => null);
    return NextResponse.json({
      mode: "error",
      reason: err?.error?.message || `HTTP ${res.status}`,
    });
  } catch {
    return NextResponse.json({ mode: "error", reason: "OpenAI'ye bağlanılamadı." });
  }
}
