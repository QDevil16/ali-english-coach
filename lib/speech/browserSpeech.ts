export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function getSpeechRate(): number {
  if (typeof window === "undefined") return 1;
  const v = Number(localStorage.getItem("aec.speechRate"));
  return v > 0 ? v : 1;
}

export function soundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem("aec.sound") !== "off";
}

export function speak(text: string, rate = 1): void {
  if (!speechSupported() || !text || !soundEnabled()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = rate;
  const voices = window.speechSynthesis.getVoices();
  const en = voices.find((v) => v.lang?.toLowerCase().startsWith("en"));
  if (en) u.voice = en;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking(): void {
  if (speechSupported()) window.speechSynthesis.cancel();
}

export function recognitionSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
  );
}

// Tek seferlik mikrofon dinleme; duyulan metni döndürür.
export function recognizeOnce(): Promise<string> {
  return new Promise((resolve, reject) => {
    const w = window as unknown as Record<string, any>;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return reject(new Error("unsupported"));
    const r = new SR();
    r.lang = "en-US";
    r.interimResults = false;
    r.maxAlternatives = 1;
    let got = false;
    r.onresult = (e: any) => {
      got = true;
      resolve(e.results[0][0].transcript as string);
    };
    r.onerror = (e: any) => reject(new Error(e.error || "error"));
    r.onend = () => {
      if (!got) reject(new Error("no-speech"));
    };
    r.start();
  });
}
