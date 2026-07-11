"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardText } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Input";

type State = "idle" | "connecting" | "live" | "error";

export function RealtimeVoice({ scenario }: { scenario?: string }) {
  const [state, setState] = useState<State>("idle");
  const [err, setErr] = useState<string | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function start() {
    setErr(null);
    setState("connecting");
    try {
      const sres = await fetch("/api/realtime/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario }),
      });
      const sjson = await sres.json();
      if (sjson.mode === "disabled") {
        setErr(sjson.note || "Canlı ses kapalı.");
        setState("error");
        return;
      }
      if (sjson.mode === "error") {
        setErr("OpenAI oturumu açılamadı: " + (sjson.reason || "bilinmeyen"));
        setState("error");
        return;
      }
      const key = sjson.session?.client_secret?.value;
      const model = sjson.model;
      if (!key) {
        setErr("Oturum anahtarı alınamadı.");
        setState("error");
        return;
      }

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      pc.ontrack = (e) => {
        if (audioRef.current) audioRef.current.srcObject = e.streams[0];
      };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      const dc = pc.createDataChannel("oai-events");
      dc.onopen = () => {
        // AI ilk selamı versin.
        dc.send(JSON.stringify({ type: "response.create" }));
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const resp = await fetch(
        `https://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}`,
        {
          method: "POST",
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/sdp",
          },
        },
      );
      if (!resp.ok) {
        setErr(
          "OpenAI realtime bağlantısı reddetti (model geçersiz veya kredi yetersiz olabilir).",
        );
        setState("error");
        return;
      }
      const answerSdp = await resp.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });
      setState("live");
    } catch (e: any) {
      setErr("Bağlanılamadı: " + (e?.message || "mikrofon izni?"));
      setState("error");
    }
  }

  function stop() {
    pcRef.current?.close();
    pcRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setState("idle");
  }

  return (
    <Card>
      <CardText>
        Gerçek zamanlı sesli sohbet. Mikrofonuna konuş, AI sesli cevap verir —
        sözünü kesebilirsin. (Dakika başına ücretlidir.)
      </CardText>

      {err && (
        <div className="mt-3">
          <Alert>{err}</Alert>
        </div>
      )}

      <audio ref={audioRef} autoPlay className="hidden" />

      <div className="mt-4">
        {state === "live" ? (
          <Button onClick={stop} variant="secondary" className="w-full">
            ⏹ Konuşmayı Bitir
          </Button>
        ) : (
          <Button
            onClick={start}
            disabled={state === "connecting"}
            className="w-full"
          >
            {state === "connecting" ? "Bağlanıyor..." : "🎙️ Canlı Konuşmayı Başlat"}
          </Button>
        )}
      </div>

      {state === "live" && (
        <p className="mt-3 text-center text-sm font-medium text-green-600">
          🟢 Canlı — konuşabilirsin
        </p>
      )}
    </Card>
  );
}
