"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Input";

export function GenerateButton({
  endpoint,
  label,
  loadingLabel,
  redirectTo,
}: {
  endpoint: string;
  label: string;
  loadingLabel: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, { method: "POST" });
      if (!res.ok) throw new Error();
      if (redirectTo) router.push(redirectTo);
      else router.refresh();
    } catch {
      setError("Oluşturulamadı. Tekrar dene.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      {error && <Alert>{error}</Alert>}
      <Button onClick={run} disabled={loading} className="w-full">
        {loading ? loadingLabel : label}
      </Button>
    </div>
  );
}
