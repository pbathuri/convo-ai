"use client";

import Image from "next/image";
import { useEffect } from "react";
import { DidAgentStage } from "@/components/did/DidAgentStage";
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

  useEffect(() => {
    setPersona(personaId);
  }, [personaId, setPersona]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">Session</h1>
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground">{headline}</span>
          {subtitle ? <span className="block">{subtitle}</span> : null}
        </p>
        {p ? (
          <div className="relative h-40 w-full max-w-sm overflow-hidden rounded-lg border bg-muted">
            <Image src={p.photoUrl} alt={p.displayName} fill className="object-cover" sizes="320px" />
          </div>
        ) : null}
        {canStream ? (
          <DidAgentStage agentId={agentId} clientKey={clientKey} />
        ) : (
          <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            Set <code className="text-xs">NEXT_PUBLIC_DID_CLIENT_KEY</code> and the matching{" "}
            <code className="text-xs">DID_PERSONA_*</code> env var for this persona.
          </p>
        )}
      </section>
      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-lg font-medium">How to use this session</h2>
        <p className="text-sm text-muted-foreground">
          V1 uses your D-ID Agent for speech recognition, reasoning (GPT-4.1 in Studio), voice, and
          lip-sync. Speak naturally after the stream connects; this app does not send your words
          through our Next.js API.
        </p>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>Allow microphone access when the browser prompts you.</li>
          <li>Use Chrome or Edge for the most reliable WebRTC + SDK path.</li>
          <li>Greeting and persona behavior are configured in D-ID Studio for this agent.</li>
        </ul>
      </section>
    </div>
  );
}
