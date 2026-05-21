"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { DidAgentStage } from "@/components/did/DidAgentStage";
import { PostSessionActions } from "@/components/session/PostSessionActions";
import { SessionObjectiveCard } from "@/components/session/SessionObjectiveCard";
import { SessionReadinessCard } from "@/components/session/SessionReadinessCard";
import { SessionStatusBar } from "@/components/session/SessionStatusBar";
import { TranscriptPanel } from "@/components/session/TranscriptPanel";
import type { PersonaId } from "@/lib/personas";
import { getPersona } from "@/lib/personas";
import { useSessionStore } from "@/stores/session-store";

type Props = {
  personaId: PersonaId;
  headline: string;
  subtitle: string;
  agentId: string;
  clientKey: string;
};

export function ChatExperience({
  personaId,
  headline,
  subtitle,
  agentId,
  clientKey,
}: Props) {
  const setPersona = useSessionStore((s) => s.setPersona);
  const p = getPersona(personaId);
  const canStream = Boolean(agentId && clientKey);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [phase, setPhase] = useState("preflight");
  const [micReady, setMicReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setPersona(personaId);
  }, [personaId, setPersona]);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ personaId }),
        });
        const data = (await res.json()) as { session: { id: string } };
        setSessionId(data.session.id);
        setPhase("connecting");
      } catch {
        setToast("Could not create session — using local mode");
        setSessionId(`local-${Date.now()}`);
      }
    })();
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

  return (
    <div className="interview-room grid gap-6 lg:grid-cols-[280px_1fr_300px]">
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
        <SessionStatusBar phase={phase} sessionId={sessionId ?? undefined} />
        <h1 className="text-2xl font-semibold">Interview room</h1>
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground">{headline}</span>
          {subtitle ? <span className="block">{subtitle}</span> : null}
        </p>
        {p ? (
          <div className="relative mx-auto h-48 w-full max-w-md overflow-hidden rounded-lg border bg-muted">
            <Image src={p.photoUrl} alt={p.displayName} fill className="object-cover" sizes="400px" />
          </div>
        ) : null}
        {canStream ? (
          <DidAgentStage agentId={agentId} clientKey={clientKey} personaId={personaId} />
        ) : (
          <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            Set <code className="text-xs">NEXT_PUBLIC_DID_CLIENT_KEY</code> and the matching{" "}
            <code className="text-xs">DID_PERSONA_*</code> env var for this persona.
          </p>
        )}
        {sessionId ? (
          <PostSessionActions sessionId={sessionId} onEnd={() => void endSession()} />
        ) : null}
        {toast ? <p className="text-sm text-amber-600">{toast}</p> : null}
      </main>

      <aside className="space-y-4">
        {sessionId ? <TranscriptPanel sessionId={sessionId} /> : null}
        <section className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
          <p>
            V1 uses your D-ID Agent for speech, reasoning, and lip-sync. Allow the microphone when
            prompted.
          </p>
        </section>
      </aside>
    </div>
  );
}
