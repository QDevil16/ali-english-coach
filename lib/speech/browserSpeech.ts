export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, rate = 1): void {
  if (!speechSupported() || !text) return;
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
