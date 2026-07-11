import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateText } from "@/lib/ai/client";
import { conversationSystem } from "@/lib/ai/prompts";
import { mockConversationReply } from "@/lib/ai/mock";
import { getScenario } from "@/lib/scenarios";

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const messages = Array.isArray(body?.messages) ? body.messages : [];

  const { data: profile } = await supabase
    .from("learner_profiles")
    .select("cefr_level")
    .eq("user_id", user.id)
    .maybeSingle();
  const level = profile?.cefr_level || "A1";

  const turnIndex = messages.filter((m: any) => m.role === "assistant").length;
  const scenario = getScenario(body?.scenario || "");

  const { text, mode } = await generateText({
    system: conversationSystem(level, scenario?.instruction),
    messages: messages.slice(-10),
    mock: () => mockConversationReply(turnIndex),
    temperature: 0.8,
  });

  return NextResponse.json({ reply: text, mode });
}
