"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DidAgentStage, type DidPhase } from "@/components/did/DidAgentStage";
import {
  DidOfficialEmbed,
  type DidOfficialPhase,
} from "@/components/did/DidOfficialEmbed";
import { InterviewConnectOverlay } from "@/components/did/InterviewConnectOverlay";
import { preloadDidSdk } from "@/lib/did/preload-sdk";
import type { DidEmbedCredentials } from "@/lib/did/embed-config";
import { PostSessionActions } from "@/components/session/PostSessionActions";
import { SessionObjectiveCard } from "@/components/session/SessionObjectiveCard";
import { SessionReadinessCard } from "@/components/session/SessionReadinessCard";
import { SessionStatusBar } from "@/components/session/SessionStatusBar";
import { SpeechTranscriptCapture } from "@/components/session/SpeechTranscriptCapture";
import { TranscriptPanel } from "@/components/session/TranscriptPanel";
import { TranscriptStatusSummary } from "@/components/session/TranscriptStatusSummary";
import { PersonaBadge } from "@/components/ui/interview-room";
import { InterviewRoomPanel, SakuraPageShell } from "@/components/ui/sakura";
import { trackPageEvent } from "@/lib/analytics/client";
import { defaultLivePersonaId, type PersonaId } from "@/lib/personas";
import Link from "next/link";
import {
  clearSessionInflight,
  getOrCreateSessionId,
} from "@/lib/session/create-session";
import {
  type AvatarMode,
  type InterviewPhase,
  interviewPhaseHint,
  interviewPhaseLabel,
  SESSION_CREATE_TIMEOUT_MS,
} from "@/lib/session/interview-phase";
import type { SpeechSegment } from "@/lib/speech/types";
import { useSessionStore } from "@/stores/session-store";

type Props = {
  personaId: PersonaId;
  agentId: string;
  clientKey: string;
  liveEmbedded: boolean;
  useOfficialEmbed?: boolean;
  embedKeySource?: DidEmbedCredentials["source"];
};

export function ChatExperience({
  personaId,
  agentId,
  clientKey,
  liveEmbedded,
  useOfficialEmbed = false,
  embedKeySource,
}: Props) {
  const setPersona = useSessionStore((s) => s.setPersona);
  const canStream = Boolean(agentId && clientKey);
  const mountMsRef = useRef(performance.now());

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [interviewPhase, setInterviewPhase] =
    useState<InterviewPhase>("initializing");
  const [avatarMode, setAvatarMode] = useState<AvatarMode>(
    canStream ? "pending" : "skipped",
  );
  const [micReady, setMicReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [speechSegments, setSpeechSegments] = useState<SpeechSegment[]>([]);
  const [savedSpeechCount, setSavedSpeechCount] = useState(0);
  const [unsavedSpeechCount, setUnsavedSpeechCount] = useState(0);
  const [manualEntryCount, setManualEntryCount] = useState(0);
  const [didPhase, setDidPhase] = useState<DidPhase>("idle");
  const prevPersonaRef = useRef<PersonaId | null>(null);

  useEffect(() => {
    if (liveEmbedded && canStream && !useOfficialEmbed) void preloadDidSdk();
  }, [liveEmbedded, canStream, useOfficialEmbed]);

  const trackPhase = useCallback(
    (phase: InterviewPhase) => {
      trackPageEvent("session_lifecycle", {
        personaId,
        path: phase,
        elapsedMs: Math.round(performance.now() - mountMsRef.current),
      });
    },
    [personaId],
  );

  const setPhase = useCallback(
    (phase: InterviewPhase) => {
      setInterviewPhase(phase);
      trackPhase(phase);
    },
    [trackPhase],
  );

  const enterTranscriptOnly = useCallback(() => {
    setAvatarMode("skipped");
    setPhase("transcript_only");
    setToast(null);
  }, [setPhase]);

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
    if (!canStream) {
      setAvatarMode("skipped");
      setPhase("transcript_only");
    }
  }, [canStream, setPhase]);

  useEffect(() => {
    if (prevPersonaRef.current && prevPersonaRef.current !== personaId) {
      clearSessionInflight(prevPersonaRef.current);
    }
    prevPersonaRef.current = personaId;

    let cancelled = false;
    setSessionId(null);
    setPhase("creating_session");
    setSpeechSegments([]);
    setSavedSpeechCount(0);
    setUnsavedSpeechCount(0);
    setManualEntryCount(0);
    setToast(null);
    if (canStream) {
      setAvatarMode("pending");
    } else {
      setAvatarMode("skipped");
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      SESSION_CREATE_TIMEOUT_MS,
    );

    void getOrCreateSessionId(personaId, controller.signal)
      .then((id) => {
        if (cancelled) return;
        setSessionId(id);
        if (id.startsWith("local-")) {
          setToast("Session degraded (local mode) — history may not persist.");
        }
        setPhase(canStream ? "avatar_connecting" : "transcript_only");
      })
      .catch((err) => {
        if (cancelled) return;
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
        setPhase(canStream ? "avatar_connecting" : "transcript_only");
      })
      .finally(() => {
        window.clearTimeout(timeoutId);
      });

    return () => {
      cancelled = true;
    };
  }, [personaId, canStream, setPhase]);

  useEffect(() => {
    if (!canStream || avatarMode === "skipped") return;
    void navigator.mediaDevices
      ?.getUserMedia({ audio: true })
      .then(() => setMicReady(true))
      .catch(() => {
        setMicReady(false);
        setToast("Microphone permission denied — use manual transcript");
      });
  }, [canStream, avatarMode]);

  const handleDidPhaseChange = useCallback(
    (nextDidPhase: DidPhase) => {
      setDidPhase(nextDidPhase);
      if (avatarMode === "skipped") return;
      if (nextDidPhase === "preflight" || nextDidPhase === "connecting") {
        setPhase("avatar_connecting");
      }
      if (nextDidPhase === "connected") {
        setAvatarMode("connected");
        setPhase("live");
      }
      if (nextDidPhase === "error") {
        setAvatarMode("failed");
        setPhase("avatar_failed");
      }
    },
    [avatarMode, setPhase],
  );

  const handleOfficialPhaseChange = useCallback(
    (nextPhase: DidOfficialPhase) => {
      if (avatarMode === "skipped") return;
      if (nextPhase === "loading") setPhase("avatar_connecting");
      if (nextPhase === "connected") {
        setAvatarMode("connected");
        setPhase("live");
      }
      if (nextPhase === "error") {
        setAvatarMode("failed");
        setPhase("avatar_failed");
      }
    },
    [avatarMode, setPhase],
  );

  const endSession = useCallback(async () => {
    if (!sessionId) return;
    setPhase("ending");
    await fetch(`/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" }),
    });
    setPhase("completed");
  }, [sessionId, setPhase]);

  const showCapture = Boolean(sessionId);
  const showAvatar =
    canStream &&
    liveEmbedded &&
    avatarMode !== "skipped" &&
    interviewPhase !== "transcript_only";
  const preparing = interviewPhase === "creating_session" && !sessionId;
  const connectingLive =
    showAvatar &&
    !useOfficialEmbed &&
    avatarMode !== "failed" &&
    didPhase !== "connected" &&
    didPhase !== "error" &&
    interviewPhase !== "live";

  const connectSteps = [
    {
      id: "session",
      label: "Interview session",
      state: (sessionId ? "done" : "active") as "done" | "active" | "pending",
    },
    {
      id: "preflight",
      label: "Verify D-ID credentials",
      state: (didPhase === "preflight"
        ? "active"
        : didPhase === "idle"
          ? sessionId
            ? "active"
            : "pending"
          : "done") as "done" | "active" | "pending",
    },
    {
      id: "sdk",
      label: "Load live interviewer",
      state: (didPhase === "connecting"
        ? "active"
        : ["connected", "error"].includes(didPhase)
          ? "done"
          : "pending") as "done" | "active" | "pending",
    },
    {
      id: "stream",
      label: "Start video stream",
      state: (didPhase === "connected"
        ? "done"
        : didPhase === "connecting"
          ? "active"
          : "pending") as "done" | "active" | "pending",
    },
  ];

  const hint = interviewPhaseHint(interviewPhase);

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
              phase={interviewPhaseLabel(interviewPhase)}
              hint={hint}
              sessionId={sessionId ?? undefined}
              interviewPhase={interviewPhase}
            />
            <PersonaBadge personaId={personaId} />

            {!liveEmbedded ? (
              <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
                <p className="font-medium text-amber-900">
                  This interviewer is in progress
                </p>
                <p className="mt-1 text-xs text-amber-800">
                  Only the Amazon room (Sarah Chen) has a live embedded D-ID
                  agent right now. Use transcript-only here, or switch to the
                  live room.
                </p>
                <Link
                  href={`/chat?persona=${defaultLivePersonaId()}`}
                  className="mt-2 inline-block text-xs font-medium text-[var(--sakura-petal-500)] hover:underline"
                >
                  Open live Amazon room →
                </Link>
              </div>
            ) : !canStream ? (
              <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  Transcript-only interview
                </p>
                <p className="mt-1 text-xs">
                  D-ID keys are not configured. Set{" "}
                  <code className="text-xs">NEXT_PUBLIC_DID_CLIENT_KEY</code>{" "}
                  and <code className="text-xs">DID_PERSONA_AMAZON_L5</code> to
                  enable the avatar, or continue with browser speech and manual
                  transcript.
                </p>
              </div>
            ) : null}

            {embedKeySource === "agent_client_key" ? (
              <p className="text-xs text-emerald-700">
                Using your Studio allowlisted embed key (ck_…).
              </p>
            ) : null}

            <div className="relative max-w-3xl space-y-2">
              {connectingLive ? (
                <InterviewConnectOverlay
                  subtitle="First connect may take a few seconds."
                  steps={connectSteps}
                />
              ) : null}

              {showAvatar && useOfficialEmbed ? (
                <DidOfficialEmbed
                  agentId={agentId}
                  clientKey={clientKey}
                  personaId={personaId}
                  onPhaseChange={handleOfficialPhaseChange}
                  onConnected={() => {
                    setAvatarMode("connected");
                    setPhase("live");
                  }}
                  onError={() => {
                    setAvatarMode("failed");
                    setPhase("avatar_failed");
                  }}
                  onContinueTranscriptOnly={enterTranscriptOnly}
                />
              ) : null}

              {showAvatar && !useOfficialEmbed ? (
                <div className={connectingLive ? "sr-only h-0 overflow-hidden" : ""}>
                  <DidAgentStage
                    agentId={agentId}
                    clientKey={clientKey}
                    personaId={personaId}
                    onPhaseChange={handleDidPhaseChange}
                    onContinueTranscriptOnly={enterTranscriptOnly}
                  />
                </div>
              ) : null}
            </div>

            {avatarMode === "skipped" ||
              interviewPhase === "transcript_only" ? (
              <p className="rounded-md border border-[var(--sakura-glass-border)] bg-[var(--sakura-glass-bg)] px-3 py-2 text-xs text-muted-foreground">
                Transcript-only mode — capture your answers on the right. End
                session when finished to generate coaching feedback.
              </p>
            ) : null}

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
                {sessionId.startsWith("local-") ? (
                  <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-xs text-amber-800 dark:text-amber-200">
                    Session degraded (local mode) — speech saves may not persist
                    to history until the database is available.
                  </p>
                ) : null}
                <TranscriptStatusSummary
                  savedCount={savedSpeechCount + manualEntryCount}
                  unsavedCount={unsavedSpeechCount}
                  manualCount={manualEntryCount}
                  browserSpeechCount={speechSegments.length}
                />
                <SpeechTranscriptCapture
                  sessionId={sessionId}
                  onSegmentFinal={onSpeechSegmentFinal}
                  onPersistError={(msg) => setToast(msg)}
                  onPersistSuccess={() => setSavedSpeechCount((n) => n + 1)}
                  onUnsavedCountChange={setUnsavedSpeechCount}
                />
                <TranscriptPanel
                  sessionId={sessionId}
                  speechSegments={speechSegments}
                  onManualSaved={(count) => setManualEntryCount(count)}
                />
              </>
            ) : preparing ? (
              <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                Creating session…
              </p>
            ) : null}
            <section className="rounded-lg border border-[var(--sakura-glass-border)] bg-[var(--sakura-glass-bg)] p-4 text-xs text-muted-foreground">
              <p>
                V1 uses your D-ID Agent for speech and reasoning when connected.
                In transcript-only mode, use browser speech or manual paste.
              </p>
            </section>
          </aside>
        </div>
      </InterviewRoomPanel>
    </SakuraPageShell>
  );
}
