import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Metin → ses. Ekonomik varsayılan: tarayıcı SpeechSynthesis. Bu opsiyonel yedektir.
export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      mode: "disabled",
      note: "Sunucu tarafı TTS kapalı. Tarayıcı SpeechSynthesis kullanın.",
    });
  }

  const body = await req.json().catch(() => null);
  const text = body?.text;
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_TTS_MODEL || "tts-1",
        voice: "alloy",
        input: text,
      }),
    });
    if (!res.ok) return NextResponse.json({ error: "provider" }, { status: 502 });
    const buf = await res.arrayBuffer();
    return new Response(buf, {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "provider" }, { status: 502 });
  }
}
