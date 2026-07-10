"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardText } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Input";

export function LivePractice() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function start() {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/realtime/session", { method: "POST" });
      const json = await res.json();
      if (json.mode === "disabled") {
        setStatus(
          "Canlı ses şu an kapalı. Ekonomik modda dinleme ve yazılı pratik kullan.",
        );
      } else if (json.mode === "ai") {
        setStatus(
          "Canlı oturum hazır. Tam sesli entegrasyon sonraki sürümde eklenecek.",
        );
      } else {
        setStatus("Başlatılamadı, tekrar dene.");
      }
    } catch {
      setStatus("Başlatılamadı, tekrar dene.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardTitle>Kısa Canlı Pratik (opsiyonel)</CardTitle>
      <CardText>
        Basit sorularla kısa konuşma pratiği. Maliyet dostu olması için günde
        5–15 dakika önerilir; ana çalışma dinleme, tekrar ve yazılı cevaptır.
      </CardText>
      <div className="mt-4">
        <Button onClick={start} disabled={loading} className="w-full">
          {loading ? "Kontrol ediliyor..." : "Kısa Pratik Başlat"}
        </Button>
      </div>
      {status && (
        <div className="mt-3">
          <Alert kind="success">{status}</Alert>
        </div>
      )}
    </Card>
  );
}
