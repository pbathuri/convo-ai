"use client";

import { useEffect, useState } from "react";
import { GlassCard, PersonaBadge, ReadinessIndicator } from "@/components/ui/interview-room";
import type { PersonaId } from "@/lib/personas";

type Props = {
  personaId: PersonaId;
  micReady: boolean;
  browserOk: boolean;
  agentConfigured: boolean;
};

export function SessionReadinessCard({
  personaId,
  micReady,
  browserOk,
  agentConfigured,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const micStatus = !mounted ? "pending" : micReady ? "ready" : "pending";
  const browserStatus = !mounted ? "pending" : browserOk ? "ready" : "warning";
  const agentStatus = !mounted ? "pending" : agentConfigured ? "ready" : "error";

  return (
    <GlassCard className="space-y-4">
      <PersonaBadge personaId={personaId} />
      <div className="space-y-2">
        <ReadinessIndicator label="Microphone" status={micStatus} />
        <ReadinessIndicator label="Browser (Chrome/Edge)" status={browserStatus} />
        <ReadinessIndicator label="D-ID agent configured" status={agentStatus} />
      </div>
    </GlassCard>
  );
}
