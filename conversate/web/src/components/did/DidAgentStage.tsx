"use client";

import type { AgentManager } from "@d-id/client-sdk";
import { useEffect, useRef, useState } from "react";
import { trackDidEvent } from "@/lib/analytics/client";
import type { PersonaId } from "@/lib/personas";

type Props = {
  agentId: string;
  clientKey: string;
  personaId?: PersonaId;
};

type Phase = "idle" | "connecting" | "connected" | "error";

export function DidAgentStage({ agentId, clientKey, personaId }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const managerRef = useRef<AgentManager | null>(null);
  const mountMsRef = useRef<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [greetingLatencyMs, setGreetingLatencyMs] = useState<number | null>(null);

  useEffect(() => {
    if (!agentId || !clientKey) return;

    let cancelled = false;
    mountMsRef.current = performance.now();

    const basePayload = () => ({
      personaId,
      agentId,
      elapsedMs: Math.round(performance.now() - mountMsRef.current),
    });

    void (async () => {
      try {
        setPhase("connecting");
        setError(null);

        trackDidEvent("did_sdk_import_start", basePayload());
        const importStart = performance.now();
        const sdk = await import("@d-id/client-sdk");
        const importMs = Math.round(performance.now() - importStart);
        trackDidEvent("did_sdk_import_complete", {
          ...basePayload(),
          phaseMs: importMs,
        });

        trackDidEvent("did_manager_create_start", basePayload());
        const createStart = performance.now();
        const manager = await sdk.createAgentManager(agentId, {
          auth: { type: "key", clientKey },
          streamOptions: { compatibilityMode: "auto", streamWarmup: true },
          callbacks: {
            onSrcObjectReady(srcObject) {
              trackDidEvent("did_src_ready", basePayload());
              const el = videoRef.current;
              if (!el || cancelled) return;
              el.srcObject = srcObject;
              trackDidEvent("did_video_play_start", basePayload());
              void el
                .play()
                .then(() => {
                  const latency = Math.round(performance.now() - mountMsRef.current);
                  setGreetingLatencyMs(latency);
                  trackDidEvent("did_video_play_complete", {
                    ...basePayload(),
                    phaseMs: latency,
                  });
                })
                .catch(() => {});
            },
            onError(err) {
              const msg = err?.message ?? String(err);
              setError(msg);
              trackDidEvent("did_error", { ...basePayload(), error: msg });
            },
          },
        });
        trackDidEvent("did_manager_create_complete", {
          ...basePayload(),
          phaseMs: Math.round(performance.now() - createStart),
        });

        managerRef.current = manager;
        if (cancelled) {
          await manager.disconnect();
          return;
        }

        trackDidEvent("did_connect_start", basePayload());
        const connectStart = performance.now();
        await manager.connect();
        trackDidEvent("did_connect_complete", {
          ...basePayload(),
          phaseMs: Math.round(performance.now() - connectStart),
        });

        if (cancelled) {
          await manager.disconnect();
          return;
        }
        setPhase("connected");
        trackDidEvent("did_connected", basePayload());
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : String(e);
          setError(msg);
          setPhase("error");
          trackDidEvent("did_error", { ...basePayload(), error: msg });
        }
      }
    })();

    return () => {
      cancelled = true;
      trackDidEvent("did_disconnected", basePayload());
      const m = managerRef.current;
      managerRef.current = null;
      void m?.disconnect?.();
      const el = videoRef.current;
      if (el) {
        el.srcObject = null;
      }
    };
  }, [agentId, clientKey, personaId]);

  return (
    <div className="space-y-2">
      <div className="relative aspect-video w-full max-w-xl overflow-hidden rounded-lg border bg-black">
        {/* biome-ignore lint/a11y/useMediaCaption: D-ID agent stream is synchronized A/V */}
        <video ref={videoRef} className="h-full w-full object-cover" playsInline controls />
      </div>
      <p className="text-xs text-muted-foreground">
        Stream: {phase}
        {greetingLatencyMs != null ? ` · greeting ready ~${greetingLatencyMs}ms` : null}
      </p>
      {error ? (
        <div className="space-y-1 text-sm text-destructive">
          <p>{error}</p>
          {error.toLowerCase().includes("fetch") ? (
            <p className="text-xs text-muted-foreground">
              Check that <code className="text-[11px]">NEXT_PUBLIC_DID_CLIENT_KEY</code> is set,
              the agent ID in <code className="text-[11px]">DID_PERSONA_*</code> is valid, and
              http://localhost:3000 is allowlisted in D-ID Studio for this client key. Use Chrome
              (not an embedded preview browser).
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
