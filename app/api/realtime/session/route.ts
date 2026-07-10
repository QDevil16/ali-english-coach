import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Canlı sesli diyalog için kısa ömürlü oturum. MVP'de placeholder.
export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_REALTIME_MODEL) {
    return NextResponse.json({
      mode: "disabled",
      note: "Canlı ses kapalı. OPENAI_REALTIME_MODEL tanımlı değil.",
    });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_REALTIME_MODEL,
        voice: "alloy",
      }),
    });
    if (!res.ok) return NextResponse.json({ error: "provider" }, { status: 502 });
    const session = await res.json();
    return NextResponse.json({ mode: "ai", session });
  } catch {
    return NextResponse.json({ error: "provider" }, { status: 502 });
  }
}
