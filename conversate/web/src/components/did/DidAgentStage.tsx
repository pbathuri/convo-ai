"use client";

import type { AgentManager } from "@d-id/client-sdk";
import { useEffect, useRef, useState } from "react";
import { trackDidEvent } from "@/lib/analytics/client";
import { classifyDidError } from "@/lib/did/error-classify";
import type { PersonaId } from "@/lib/personas";

type Props = {
  agentId: string;
  clientKey: string;
  personaId?: PersonaId;
};

type Phase = "idle" | "connecting" | "connected" | "error";

function DidErrorPanel({ message }: { message: string }) {
  const kind = classifyDidError(message);
  return (
    <div
      className="space-y-2 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm"
      role="alert"
    >
      <p className="font-medium text-destructive">
        D-ID stream could not connect
      </p>
      <p className="text-xs text-muted-foreground">{message}</p>
      <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
        <li>
          Allowlist <code className="text-[11px]">http://localhost:3000</code>{" "}
          and <code className="text-[11px]">http://localhost:3001</code> in D-ID
          Studio for this embed client key.
        </li>
        <li>
          Use a <strong>D-ID Studio embed client key</strong> in{" "}
          <code className="text-[11px]">NEXT_PUBLIC_DID_CLIENT_KEY</code>, not a
          server API key.
        </li>
        <li>
          Confirm the agent ID in the matching{" "}
          <code className="text-[11px]">DID_PERSONA_*</code> env var is valid in
          Studio.
        </li>
        <li>
          Test in real Chrome; Cursor embedded preview may block WebRTC/CORS.
        </li>
        {kind === "cors" ? (
          <li>
            This looks like a CORS/origin block — fix the Studio allowlist
            first.
          </li>
        ) : null}
      </ul>
      <p className="text-xs">
        See{" "}
        <code className="text-[11px]">
          docs/implementation/did-local-debugging.md
        </code>{" "}
        in the repo.
      </p>
    </div>
  );
}

export function DidAgentStage({ agentId, clientKey, personaId }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const managerRef = useRef<AgentManager | null>(null);
  const mountMsRef = useRef<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [greetingLatencyMs, setGreetingLatencyMs] = useState<number | null>(
    null,
  );

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
                  const latency = Math.round(
                    performance.now() - mountMsRef.current,
                  );
                  setGreetingLatencyMs(latency);
                  trackDidEvent("did_video_play_complete", {
                    ...basePayload(),
                    phaseMs: latency,
                  });
                })
                .catch(() => { });
            },
            onError(err) {
              const msg = err?.message ?? String(err);
              setError(msg);
              setPhase("error");
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
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          controls
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Stream: {phase}
        {greetingLatencyMs != null
          ? ` · greeting ready ~${greetingLatencyMs}ms`
          : null}
      </p>
      {phase === "error" && error ? <DidErrorPanel message={error} /> : null}
    </div>
  );
}
