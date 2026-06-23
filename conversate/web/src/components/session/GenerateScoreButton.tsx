"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function GenerateScoreButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [xpMessage, setXpMessage] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <Button
        type="button"
        disabled={loading}
        onClick={() => {
          setLoading(true);
          setError(null);
          setXpMessage(null);
          void fetch(`/api/sessions/${sessionId}/score`, { method: "POST" })
            .then(async (res) => {
              if (!res.ok) {
                const body = (await res.json().catch(() => ({}))) as {
                  error?: string;
                };
                setError(body.error ?? `Scoring failed (${res.status})`);
                return;
              }
              const body = (await res.json()) as { xp?: number; xpDegraded?: boolean };
              if (typeof body.xp === "number") {
                setXpMessage(
                  body.xpDegraded
                    ? `+${body.xp} XP (local estimate — backend offline)`
                    : `+${body.xp} XP earned`,
                );
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
      {xpMessage ? (
        <p className="text-xs font-medium text-[var(--sakura-petal-500)]">
          {xpMessage}
        </p>
      ) : null}
    </div>
  );
}
