"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DidAgentStage } from "@/components/did/DidAgentStage";
import { PostSessionActions } from "@/components/session/PostSessionActions";
import { SessionObjectiveCard } from "@/components/session/SessionObjectiveCard";
import { SessionReadinessCard } from "@/components/session/SessionReadinessCard";
import { SessionStatusBar } from "@/components/session/SessionStatusBar";
import { SpeechTranscriptCapture } from "@/components/session/SpeechTranscriptCapture";
import { TranscriptPanel } from "@/components/session/TranscriptPanel";
import { PersonaBadge } from "@/components/ui/interview-room";
import { InterviewRoomPanel, SakuraPageShell } from "@/components/ui/sakura";
import type { PersonaId } from "@/lib/personas";
import type { SpeechSegment } from "@/lib/speech/types";
import { useSessionStore } from "@/stores/session-store";

type Props = {
  personaId: PersonaId;
  agentId: string;
  clientKey: string;
};

type SessionLifecycle =
  | "idle"
  | "creating"
  | "ready"
  | "local_fallback"
  | "error";

const SESSION_TIMEOUT_MS = 12_000;

export function ChatExperience({ personaId, agentId, clientKey }: Props) {
  const setPersona = useSessionStore((s) => s.setPersona);
  const canStream = Boolean(agentId && clientKey);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionLifecycle, setSessionLifecycle] =
    useState<SessionLifecycle>("idle");
  const [phase, setPhase] = useState("preflight");
  const [micReady, setMicReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [speechSegments, setSpeechSegments] = useState<SpeechSegment[]>([]);
  const inflightRef = useRef<Promise<void> | null>(null);

  const onSpeechSegmentFinal = useCallback((segment: SpeechSegment) => {
    if (!segment.isFinal) return;
    setSpeechSegments((prev) => {
      if (prev.some((s) => s.id === segment.id)) return prev;
      return [...prev, segment];
    });
  }, []);

  useEffect(() => {
    setPersona(personaId);
  }, [personaId, setPersona]);

  useEffect(() => {
    setSessionId(null);
    setSessionLifecycle("creating");
    setPhase("preflight");
    setSpeechSegments([]);
    setToast(null);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      SESSION_TIMEOUT_MS,
    );

    const run = async () => {
      try {
        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ personaId }),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { session: { id: string } };
        if (controller.signal.aborted) return;
        const id = data.session.id;
        setSessionId(id);
        setSessionLifecycle(
          id.startsWith("local-") ? "local_fallback" : "ready",
        );
        setPhase("connecting");
      } catch (err) {
        if (
          controller.signal.aborted &&
          !(err instanceof Error && err.message.includes("HTTP"))
        ) {
          setToast("Session creation timed out — using local mode");
        } else if (!controller.signal.aborted) {
          setToast("Could not create session — using local mode");
        } else {
          return;
        }
        setSessionId(`local-${Date.now()}`);
        setSessionLifecycle("local_fallback");
        setPhase("connecting");
      } finally {
        window.clearTimeout(timeoutId);
      }
    };

    inflightRef.current = run();
    void inflightRef.current;

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [personaId]);

  useEffect(() => {
    if (!canStream) return;
    void navigator.mediaDevices
      ?.getUserMedia({ audio: true })
      .then(() => setMicReady(true))
      .catch(() => {
        setMicReady(false);
        setToast("Microphone permission denied");
      });
  }, [canStream]);

  const endSession = useCallback(async () => {
    if (!sessionId) return;
    setPhase("ending");
    await fetch(`/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" }),
    });
    setPhase("completed");
  }, [sessionId]);

  const showCapture = Boolean(sessionId);
  const preparing = sessionLifecycle === "creating" && !sessionId;

  return (
    <SakuraPageShell wide className="py-6">
      <InterviewRoomPanel>
        <div className="grid gap-6 lg:grid-cols-[280px_1fr_300px]">
          <aside className="space-y-4">
            <SessionReadinessCard
              personaId={personaId}
              micReady={micReady}
              browserOk={typeof window !== "undefined"}
              agentConfigured={canStream}
            />
            <SessionObjectiveCard personaId={personaId} />
          </aside>

          <main className="space-y-4">
            <SessionStatusBar
              phase={phase}
              sessionId={sessionId ?? undefined}
              sessionLifecycle={sessionLifecycle}
            />
            <PersonaBadge personaId={personaId} />
            {canStream ? (
              <DidAgentStage
                agentId={agentId}
                clientKey={clientKey}
                personaId={personaId}
              />
            ) : (
              <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                Set <code className="text-xs">NEXT_PUBLIC_DID_CLIENT_KEY</code>{" "}
                and the matching <code className="text-xs">DID_PERSONA_*</code>{" "}
                env var for this persona.
              </p>
            )}
            {sessionId ? (
              <PostSessionActions
                sessionId={sessionId}
                onEnd={() => void endSession()}
              />
            ) : null}
            {toast ? <p className="text-sm text-amber-600">{toast}</p> : null}
          </main>

          <aside className="space-y-4">
            {showCapture && sessionId ? (
              <>
                {sessionLifecycle === "local_fallback" ? (
                  <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-xs text-amber-800 dark:text-amber-200">
                    Session degraded (local mode) — speech saves may not persist
                    to history until the database is available.
                  </p>
                ) : null}
                <SpeechTranscriptCapture
                  sessionId={sessionId}
                  onSegmentFinal={onSpeechSegmentFinal}
                  onPersistError={(msg) => setToast(msg)}
                />
                <TranscriptPanel
                  sessionId={sessionId}
                  speechSegments={speechSegments}
                />
              </>
            ) : preparing ? (
              <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                Creating session…
              </p>
            ) : (
              <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                Preparing session…
              </p>
            )}
            <section className="rounded-lg border border-[var(--sakura-glass-border)] bg-[var(--sakura-glass-bg)] p-4 text-xs text-muted-foreground">
              <p>
                V1 uses your D-ID Agent for speech, reasoning, and lip-sync.
                Allow the microphone when prompted.
              </p>
            </section>
          </aside>
        </div>
      </InterviewRoomPanel>
    </SakuraPageShell>
  );
}
