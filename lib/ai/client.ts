export function aiEnabled(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

const TEXT_MODEL = () => process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini";

// OpenAI varsa JSON üretir; yoksa veya hata olursa mock'a düşer.
export async function generateJSON<T>(opts: {
  system: string;
  user: string;
  mock: () => T;
  temperature?: number;
}): Promise<{ data: T; mode: "ai" | "mock" }> {
  if (!aiEnabled()) return { data: opts.mock(), mode: "mock" };

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: TEXT_MODEL(),
        messages: [
          { role: "system", content: opts.system },
          { role: "user", content: opts.user },
        ],
        response_format: { type: "json_object" },
        temperature: opts.temperature ?? 0.6,
      }),
    });

    if (!res.ok) return { data: opts.mock(), mode: "mock" };
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content;
    if (!content) return { data: opts.mock(), mode: "mock" };
    return { data: JSON.parse(content) as T, mode: "ai" };
  } catch {
    return { data: opts.mock(), mode: "mock" };
  }
}

type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

// Düz metin (JSON değil) üretir — sohbet için. AI yoksa mock'a düşer.
export async function generateText(opts: {
  system: string;
  messages: ChatMsg[];
  mock: () => string;
  temperature?: number;
}): Promise<{ text: string; mode: "ai" | "mock" }> {
  if (!aiEnabled()) return { text: opts.mock(), mode: "mock" };
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: TEXT_MODEL(),
        messages: [{ role: "system", content: opts.system }, ...opts.messages],
        temperature: opts.temperature ?? 0.7,
        max_tokens: 200,
      }),
    });
    if (!res.ok) return { text: opts.mock(), mode: "mock" };
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content;
    if (!content) return { text: opts.mock(), mode: "mock" };
    return { text: content.trim(), mode: "ai" };
  } catch {
    return { text: opts.mock(), mode: "mock" };
  }
}
