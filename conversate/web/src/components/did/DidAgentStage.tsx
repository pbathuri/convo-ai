"use client";

import type { AgentManager } from "@d-id/client-sdk";
import { useEffect, useRef, useState } from "react";
import { trackDidEvent } from "@/lib/analytics/client";
import { classifyDidError } from "@/lib/did/error-classify";
import type { PersonaId } from "@/lib/personas";
import { DID_CONNECT_TIMEOUT_MS } from "@/lib/session/interview-phase";

export type DidPhase = "idle" | "connecting" | "connected" | "error";

type Props = {
  agentId: string;
  clientKey: string;
  personaId?: PersonaId;
  connectTimeoutMs?: number;
  onPhaseChange?: (phase: DidPhase) => void;
  onError?: (message: string) => void;
  onConnected?: () => void;
  hidden?: boolean;
};

function DidErrorPanel({
  message,
  onContinueTranscriptOnly,
}: {
  message: string;
  onContinueTranscriptOnly?: () => void;
}) {
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
        <li>Check localhost allowlist in D-ID Studio.</li>
        <li>
          Add <code className="text-[11px]">http://localhost:3000</code> and{" "}
          <code className="text-[11px]">http://localhost:3001</code> for this
          embed client key.
        </li>
        <li>
          Use a D-ID Studio embed client key in{" "}
          <code className="text-[11px]">NEXT_PUBLIC_DID_CLIENT_KEY</code>, not a
          server API key.
        </li>
        <li>
          Test in real Chrome; Cursor embedded browser may block WebRTC/CORS.
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
      {onContinueTranscriptOnly ? (
        <button
          type="button"
          className="mt-2 w-full rounded-md bg-[var(--sakura-petal-500)] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          onClick={onContinueTranscriptOnly}
        >
          Continue transcript-only interview
        </button>
      ) : null}
    </div>
  );
}

export function DidAgentStage({
  agentId,
  clientKey,
  personaId,
  connectTimeoutMs = DID_CONNECT_TIMEOUT_MS,
  onPhaseChange,
  onError,
  onConnected,
  hidden = false,
  onContinueTranscriptOnly,
}: Props & { onContinueTranscriptOnly?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const managerRef = useRef<AgentManager | null>(null);
  const mountMsRef = useRef<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<DidPhase>("idle");
  const [greetingLatencyMs, setGreetingLatencyMs] = useState<number | null>(
    null,
  );
  const connectedRef = useRef(false);
  const onPhaseChangeRef = useRef(onPhaseChange);
  const onErrorRef = useRef(onError);
  const onConnectedRef = useRef(onConnected);
  onPhaseChangeRef.current = onPhaseChange;
  onErrorRef.current = onError;
  onConnectedRef.current = onConnected;

  const setPhaseSafe = (next: DidPhase) => {
    setPhase(next);
    onPhaseChangeRef.current?.(next);
  };

  const reportError = (msg: string) => {
    setError(msg);
    setPhaseSafe("error");
    onErrorRef.current?.(msg);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: reconnect only when agent/key changes; callbacks use refs
  useEffect(() => {
    if (!agentId || !clientKey || hidden) return;

    let cancelled = false;
    mountMsRef.current = performance.now();

    const basePayload = () => ({
      personaId,
      agentId,
      elapsedMs: Math.round(performance.now() - mountMsRef.current),
    });

    const timeoutId = window.setTimeout(() => {
      if (cancelled || connectedRef.current) return;
      reportError(
        `D-ID connect timed out after ${connectTimeoutMs / 1000}s. Use transcript-only mode to continue.`,
      );
      trackDidEvent("did_error", {
        ...basePayload(),
        error: "connect_timeout",
      });
    }, connectTimeoutMs);

    void (async () => {
      try {
        setPhaseSafe("connecting");
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
                .catch(() => {});
            },
            onError(err) {
              const msg = err?.message ?? String(err);
              reportError(msg);
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
        window.clearTimeout(timeoutId);
        connectedRef.current = true;
        setPhaseSafe("connected");
        onConnectedRef.current?.();
        trackDidEvent("did_connected", basePayload());
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : String(e);
          reportError(msg);
          trackDidEvent("did_error", { ...basePayload(), error: msg });
        }
      }
    })();

    return () => {
      cancelled = true;
      connectedRef.current = false;
      window.clearTimeout(timeoutId);
      trackDidEvent("did_disconnected", basePayload());
      const m = managerRef.current;
      managerRef.current = null;
      void m?.disconnect?.();
      const el = videoRef.current;
      if (el) {
        el.srcObject = null;
      }
    };
  }, [agentId, clientKey, personaId, connectTimeoutMs, hidden]);

  if (hidden) return null;

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
      {phase === "error" && error ? (
        <DidErrorPanel
          message={error}
          onContinueTranscriptOnly={onContinueTranscriptOnly}
        />
      ) : null}
    </div>
  );
}
