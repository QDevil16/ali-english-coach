import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getFoundation } from "@/lib/foundations";

// Statik temel dersi DB'ye yazar (bir kez) ve id döner; sonrası normal ders akışı.
export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const f = getFoundation(body?.slug || "");
  if (!f) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Aynı temel dersi tekrar oluşturma; varsa onu aç.
  const { data: existing } = await supabase
    .from("lessons")
    .select("id")
    .eq("user_id", user.id)
    .eq("title", f.content.title)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existing) return NextResponse.json({ lessonId: existing.id });

  const { data: row, error } = await supabase
    .from("lessons")
    .insert({
      user_id: user.id,
      title: f.content.title,
      level: f.content.level,
      focus_skills: f.content.focus ?? [],
      estimated_minutes: f.content.estimatedMinutes ?? 20,
      lesson_date: null,
      content: f.content,
      status: "planned",
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ lessonId: row.id });
}
