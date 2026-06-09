"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { PersonaId } from "@/lib/personas";
import { DID_CONNECT_TIMEOUT_MS } from "@/lib/session/interview-phase";

export type DidOfficialPhase = "loading" | "connected" | "error";

type Props = {
  agentId: string;
  clientKey: string;
  personaId?: PersonaId;
  onPhaseChange?: (phase: DidOfficialPhase) => void;
  onConnected?: () => void;
  onError?: (message: string) => void;
  onContinueTranscriptOnly?: () => void;
  connectTimeoutMs?: number;
};

const SCRIPT_SRC = "https://agent.d-id.com/v2/index.js";

export function DidOfficialEmbed({
  agentId,
  clientKey,
  onPhaseChange,
  onConnected,
  onError,
  onContinueTranscriptOnly,
  connectTimeoutMs = DID_CONNECT_TIMEOUT_MS,
}: Props) {
  const reactId = useId();
  const containerId = `did-agent-${reactId.replace(/:/g, "")}`;
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const [phase, setPhase] = useState<DidOfficialPhase>("loading");
  const [error, setError] = useState<string | null>(null);
  const connectedRef = useRef(false);

  const setPhaseSafe = (next: DidOfficialPhase) => {
    setPhase(next);
    onPhaseChange?.(next);
  };

  useEffect(() => {
    if (!agentId || !clientKey.startsWith("ck_")) {
      setError("Missing D-ID embed client key (ck_…).");
      setPhaseSafe("error");
      onError?.("missing_ck_client_key");
      return;
    }

    let cancelled = false;
    connectedRef.current = false;
    setPhaseSafe("loading");
    setError(null);

    const timeoutId = window.setTimeout(() => {
      if (cancelled || connectedRef.current) return;
      const msg = `D-ID embed timed out after ${connectTimeoutMs / 1000}s.`;
      setError(msg);
      setPhaseSafe("error");
      onError?.(msg);
    }, connectTimeoutMs);

    const script = document.createElement("script");
    script.type = "module";
    script.src = SCRIPT_SRC;
    script.setAttribute("data-mode", "full");
    script.setAttribute("data-target-id", containerId);
    script.setAttribute("data-client-key", clientKey);
    script.setAttribute("data-agent-id", agentId);
    script.setAttribute("data-auto-connect", "true");
    script.setAttribute("data-orientation", "horizontal");
    script.setAttribute("data-open-mode", "expanded");
    script.setAttribute("data-show-restart-button", "false");
    script.async = true;

    script.onload = () => {
      if (cancelled) return;
      const poll = window.setInterval(() => {
        const el = document.getElementById(containerId);
        const hasVideo =
          el &&
          (el.querySelector("video") ?? el.querySelector("iframe"));
        if (hasVideo && !connectedRef.current) {
          connectedRef.current = true;
          window.clearTimeout(timeoutId);
          window.clearInterval(poll);
          setPhaseSafe("connected");
          onConnected?.();
        }
      }, 400);
      window.setTimeout(() => window.clearInterval(poll), connectTimeoutMs);
    };

    script.onerror = () => {
      if (cancelled) return;
      const msg = "Failed to load D-ID embed script.";
      setError(msg);
      setPhaseSafe("error");
      onError?.(msg);
    };

    document.body.appendChild(script);
    scriptRef.current = script;

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      script.remove();
      scriptRef.current = null;
      const el = document.getElementById(containerId);
      if (el) el.innerHTML = "";
    };
  }, [
    agentId,
    clientKey,
    containerId,
    connectTimeoutMs,
    onConnected,
    onError,
  ]);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="space-y-2">
      <div
        id={containerId}
        className="relative min-h-[360px] w-full max-w-3xl overflow-hidden rounded-lg border bg-black"
      >
        {phase === "loading" ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 text-white">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <p className="mt-3 text-sm">Starting live interviewer…</p>
          </div>
        ) : null}
      </div>
      <p className="text-xs text-muted-foreground">
        D-ID official embed · {phase}
        {clientKey.startsWith("ck_") ? " · domain-allowlisted key" : ""}
      </p>
      {phase === "error" && error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
          <p className="font-medium text-destructive">{error}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Allowlisted origin: <code>{origin}</code>
          </p>
          {onContinueTranscriptOnly ? (
            <button
              type="button"
              className="mt-3 w-full rounded-md bg-[var(--sakura-petal-500)] px-3 py-2 text-sm font-medium text-white"
              onClick={onContinueTranscriptOnly}
            >
              Continue transcript-only interview
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
