import { NextResponse } from "next/server";
import { PERSONAS } from "@/lib/personas";

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
    agentId: process.env[p.didAgentEnvKey] ?? "",
  }));
  return NextResponse.json({ personas });
}
