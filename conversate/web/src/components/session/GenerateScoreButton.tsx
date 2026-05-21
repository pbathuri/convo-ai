"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function GenerateScoreButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      type="button"
      disabled={loading}
      onClick={() => {
        setLoading(true);
        void fetch(`/api/sessions/${sessionId}/score`, { method: "POST" })
          .then(() => router.refresh())
          .finally(() => setLoading(false));
      }}
    >
      {loading ? "Scoring…" : "Generate score"}
    </Button>
  );
}
