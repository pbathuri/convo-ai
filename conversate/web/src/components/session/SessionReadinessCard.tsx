"use client";

import { GlassCard, PersonaBadge, ReadinessIndicator } from "@/components/ui/interview-room";
import type { PersonaId } from "@/lib/personas";

type Props = {
  personaId: PersonaId;
  micReady: boolean;
  browserOk: boolean;
  agentConfigured: boolean;
};

export function SessionReadinessCard({ personaId, micReady, browserOk, agentConfigured }: Props) {
  return (
    <GlassCard className="space-y-4">
      <PersonaBadge personaId={personaId} />
      <div className="space-y-2">
        <ReadinessIndicator label="Microphone" status={micReady ? "ready" : "pending"} />
        <ReadinessIndicator label="Browser (Chrome/Edge)" status={browserOk ? "ready" : "warning"} />
        <ReadinessIndicator
          label="D-ID agent configured"
          status={agentConfigured ? "ready" : "error"}
        />
      </div>
    </GlassCard>
  );
}
