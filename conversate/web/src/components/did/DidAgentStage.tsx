"use client";

import type { AgentManager } from "@d-id/client-sdk";
import { useEffect, useRef, useState } from "react";
import { trackDidEvent } from "@/lib/analytics/client";
import { classifyDidError } from "@/lib/did/error-classify";
import { preloadDidSdk } from "@/lib/did/preload-sdk";
import type { PersonaId } from "@/lib/personas";
import { DID_CONNECT_TIMEOUT_MS } from "@/lib/session/interview-phase";

export type DidPhase = "idle" | "preflight" | "connecting" | "connected" | "error";

type Props = {
  agentId: string;
  clientKey: string;
  personaId?: PersonaId;
  connectTimeoutMs?: number;
  onPhaseChange?: (phase: DidPhase) => void;
  onError?: (message: string) => void;
  onConnected?: () => void;
  hidden?: boolean;
  onContinueTranscriptOnly?: () => void;
};

function DidErrorPanel({
  message,
  onContinueTranscriptOnly,
}: {
  message: string;
  onContinueTranscriptOnly?: () => void;
}) {
  const kind = classifyDidError(message);
  const origin =
    typeof window !== "undefined" ? window.location.origin : "your-app-url";

  return (
    <div
      className="space-y-2 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm"
      role="alert"
    >
      <p className="font-medium text-destructive">
        D-ID stream could not connect.
      </p>
      <p className="text-xs text-muted-foreground">{message}</p>
      <div className="rounded-md bg-muted/60 px-2 py-1.5 font-mono text-[11px] break-all">
        Allowlist in D-ID Studio: <strong>{origin}</strong>
      </div>
      <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
        <li>
          D-ID Studio → embed client key → <strong>Allowed origins</strong> → add{" "}
          <code className="text-[10px]">{origin}</code> (and localhost for dev).
        </li>
        <li>Use a D-ID Studio embed client key, not a server API key.</li>
        <li>Open in Google Chrome (not embedded IDE browsers).</li>
        {kind === "cors" || kind === "fetch" ? (
          <li>
            This is almost always a missing production URL on the allowlist —
            keys can be valid while the browser still blocks the stream.
          </li>
        ) : null}
      </ul>
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
}: Props) {
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
        `D-ID connect timed out after ${connectTimeoutMs / 1000}s. Add ${typeof window !== "undefined" ? window.location.origin : "this site"} to D-ID Studio allowlist, then refresh.`,
      );
      trackDidEvent("did_error", {
        ...basePayload(),
        error: "connect_timeout",
      });
    }, connectTimeoutMs);

    void (async () => {
      try {
        setPhaseSafe("preflight");
        setError(null);

        const preflight = await fetch(
          `/api/did/preflight?agentId=${encodeURIComponent(agentId)}`,
          { cache: "no-store" },
        ).catch(() => null);

        if (preflight) {
          const data = (await preflight.json()) as {
            ok?: boolean;
            hint?: string;
            error?: string;
          };
          if (!data.ok) {
            reportError(
              data.hint ??
              data.error ??
              "D-ID credentials failed server check — fix env vars on Vercel.",
            );
            return;
          }
        }

        if (cancelled) return;

        setPhaseSafe("connecting");
        trackDidEvent("did_sdk_import_start", basePayload());
        const importStart = performance.now();
        const sdk = await preloadDidSdk();
        trackDidEvent("did_sdk_import_complete", {
          ...basePayload(),
          phaseMs: Math.round(performance.now() - importStart),
        });

        trackDidEvent("did_manager_create_start", basePayload());
        const createStart = performance.now();
        const manager = await sdk.createAgentManager(agentId, {
          auth: { type: "key", clientKey },
          streamOptions: {
            compatibilityMode: "on",
            streamWarmup: true,
          },
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
          const kind = classifyDidError(msg);
          const origin =
            typeof window !== "undefined" ? window.location.origin : "";
          const extra =
            kind === "cors" || kind === "fetch"
              ? ` Add ${origin} to D-ID Studio allowed origins.`
              : "";
          reportError(msg + extra);
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

  const showVideo = phase === "connected" || phase === "connecting";

  return (
    <div className="space-y-2">
      {showVideo ? (
        <div className="relative aspect-video w-full max-w-xl overflow-hidden rounded-lg border bg-black">
          {phase === "connecting" ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 text-white">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <p className="mt-3 text-sm font-medium">Live stream connecting…</p>
            </div>
          ) : null}
          {/* biome-ignore lint/a11y/useMediaCaption: D-ID agent stream is synchronized A/V */}
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            playsInline
            autoPlay
            muted={phase !== "connected"}
            controls={phase === "connected"}
          />
        </div>
      ) : phase === "preflight" ? (
        <div className="flex min-h-[200px] max-w-xl items-center justify-center rounded-lg border bg-muted/30 text-sm text-muted-foreground">
          Verifying D-ID credentials…
        </div>
      ) : null}
      <p className="text-xs text-muted-foreground">
        Stream: {phase}
        {greetingLatencyMs != null
          ? ` · ready in ${(greetingLatencyMs / 1000).toFixed(1)}s`
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
