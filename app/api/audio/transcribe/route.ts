import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Ses → yazı. Önce tarayıcı SpeechRecognition önerilir; bu opsiyonel yedektir.
export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      text: "",
      mode: "disabled",
      note: "Sunucu tarafı transcribe kapalı. Tarayıcı SpeechRecognition kullanın.",
    });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("audio");
  if (!file) return NextResponse.json({ error: "no_audio" }, { status: 400 });

  const out = new FormData();
  out.append("file", file as Blob, "audio.webm");
  out.append("model", process.env.OPENAI_TRANSCRIBE_MODEL || "whisper-1");

  try {
    const res = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: out,
      },
    );
    if (!res.ok) return NextResponse.json({ error: "provider" }, { status: 502 });
    const data = await res.json();
    return NextResponse.json({ text: data.text ?? "", mode: "ai" });
  } catch {
    return NextResponse.json({ error: "provider" }, { status: 502 });
  }
}
