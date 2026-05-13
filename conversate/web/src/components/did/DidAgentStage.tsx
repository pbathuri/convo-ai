"use client";

import type { AgentManager } from "@d-id/client-sdk";
import { useEffect, useRef, useState } from "react";

type Props = {
  agentId: string;
  clientKey: string;
  openingLine: string;
};

export function DidAgentStage({ agentId, clientKey, openingLine }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const managerRef = useRef<AgentManager | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "connecting" | "connected" | "speaking" | "done">("idle");

  useEffect(() => {
    if (!agentId || !clientKey || !openingLine) return;

    let cancelled = false;

    void (async () => {
      try {
        setPhase("connecting");
        setError(null);
        const sdk = await import("@d-id/client-sdk");
        const manager = await sdk.createAgentManager(agentId, {
          auth: { type: "key", clientKey },
          streamOptions: { compatibilityMode: "auto", streamWarmup: true },
          callbacks: {
            onSrcObjectReady(srcObject) {
              const el = videoRef.current;
              if (!el || cancelled) return;
              el.srcObject = srcObject;
              void el.play().catch(() => {});
            },
            onError(err) {
              setError(err?.message ?? String(err));
            },
          },
        });
        managerRef.current = manager;
        if (cancelled) {
          await manager.disconnect();
          return;
        }
        await manager.connect();
        if (cancelled) {
          await manager.disconnect();
          return;
        }
        setPhase("connected");
        setPhase("speaking");
        await manager.speak({ type: "text", input: openingLine });
        if (!cancelled) setPhase("done");
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
          setPhase("idle");
        }
      }
    })();

    return () => {
      cancelled = true;
      const m = managerRef.current;
      managerRef.current = null;
      void m?.disconnect?.();
      const el = videoRef.current;
      if (el) {
        el.srcObject = null;
      }
    };
  }, [agentId, clientKey, openingLine]);

  return (
    <div className="space-y-2">
      <div className="relative aspect-video w-full max-w-xl overflow-hidden rounded-lg border bg-black">
        {/* biome-ignore lint/a11y/useMediaCaption: D-ID agent stream is synchronized A/V */}
        <video ref={videoRef} className="h-full w-full object-cover" playsInline controls />
      </div>
      <p className="text-xs text-muted-foreground">Stream: {phase}</p>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
