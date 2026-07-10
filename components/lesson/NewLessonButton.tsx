"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NewLessonButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!confirm("Bugünkü ders yenilensin mi? Mevcut (bitmemiş) ders silinip yenisi üretilir.")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: true }),
      });
      const json = await res.json();
      if (json?.lesson?.id) {
        router.push(`/lessons/${json.lesson.id}`);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={run}
      disabled={loading}
      className="text-sm text-slate-400 underline"
    >
      {loading ? "Yeni ders üretiliyor..." : "Yeni ders üret"}
    </button>
  );
}
