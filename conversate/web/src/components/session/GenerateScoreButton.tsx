"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function GenerateScoreButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <Button
        type="button"
        disabled={loading}
        onClick={() => {
          setLoading(true);
          setError(null);
          void fetch(`/api/sessions/${sessionId}/score`, { method: "POST" })
            .then(async (res) => {
              if (!res.ok) {
                const body = (await res.json().catch(() => ({}))) as {
                  error?: string;
                };
                setError(body.error ?? `Scoring failed (${res.status})`);
                return;
              }
              router.refresh();
            })
            .catch(() => setError("Network error while scoring"))
            .finally(() => setLoading(false));
        }}
      >
        {loading ? "Scoring…" : "Generate score"}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
