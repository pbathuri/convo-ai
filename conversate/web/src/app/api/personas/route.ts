import { NextResponse } from "next/server";
import {
  PERSONAS,
  getPersonaLiveStatus,
  personaAgentIdForLive,
} from "@/lib/personas";

export const dynamic = "force-dynamic";

export function GET() {
  const personas = PERSONAS.map((p) => ({
    id: p.id,
    displayName: p.displayName,
    companyName: p.companyName,
    role: p.role,
    seniority: p.seniority,
    voiceLabel: p.voiceLabel,
    photoUrl: p.photoUrl,
    didAgentEnvKey: p.didAgentEnvKey,
    liveStatus: getPersonaLiveStatus(p.id),
    agentId: personaAgentIdForLive(p.id) ?? "",
  }));
  return NextResponse.json({ personas });
}
