import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { aiEnabled } from "@/lib/ai/client";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const ai = aiEnabled();
  return NextResponse.json({
    ai,
    textModel: ai ? process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini" : null,
    supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
}
