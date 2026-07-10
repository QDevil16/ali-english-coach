import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { aiEnabled } from "@/lib/ai/client";

// Gerçek bir OpenAI isteği atar; model/anahtar doğru mu net söyler.
export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  if (!aiEnabled()) {
    return NextResponse.json({
      ok: false,
      reason: "OPENAI_API_KEY tanımlı değil (sunucuda .env.local).",
    });
  }

  const model = process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini";
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 1,
      }),
    });
    if (res.ok) return NextResponse.json({ ok: true, model });
    const err = await res.json().catch(() => null);
    return NextResponse.json({
      ok: false,
      model,
      status: res.status,
      reason: err?.error?.message || `HTTP ${res.status}`,
    });
  } catch {
    return NextResponse.json({
      ok: false,
      model,
      reason: "OpenAI'ye bağlanılamadı (ağ/proxy).",
    });
  }
}
