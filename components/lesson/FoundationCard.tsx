"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardTitle, CardText } from "@/components/ui/Card";

export function FoundationCard({
  slug,
  title,
  level,
  summary,
  index,
  done,
}: {
  slug: string;
  title: string;
  level: string;
  summary: string;
  index: number;
  done?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function open() {
    setLoading(true);
    try {
      const res = await fetch("/api/foundations/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const json = await res.json();
      if (json?.lessonId) router.push(`/lessons/${json.lessonId}`);
      else setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  return (
    <button type="button" onClick={open} disabled={loading} className="w-full text-left">
      <Card className="transition-colors hover:border-brand">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold " +
                (done
                  ? "bg-green-500 text-white"
                  : "bg-brand-light text-brand-dark")
              }
            >
              {done ? "✓" : index}
            </span>
            <div>
              <CardTitle>{title}</CardTitle>
              <CardText>{summary}</CardText>
            </div>
          </div>
          <span className="ml-2 shrink-0 text-xs font-semibold text-slate-400">
            {loading ? "..." : level}
          </span>
        </div>
      </Card>
    </button>
  );
}
