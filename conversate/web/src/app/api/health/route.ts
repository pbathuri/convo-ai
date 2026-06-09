import { NextResponse } from "next/server";
import { getEnvHealth } from "@/lib/env-check";

export const dynamic = "force-dynamic";

/** Non-secret health flags for ops / demo preflight. */
export async function GET() {
  const h = await getEnvHealth();
  return NextResponse.json({
    ok: true,
    database: h.databaseReachable,
    did: h.didClientKey,
    didEmbedReady: h.liveEmbeddedAgentReady,
    gemini: h.gemini,
    upstash: h.upstash,
    localDidProxy: process.env.DID_USE_LOCAL_PROXY === "1",
    personaAgentsConfigured: h.allPersonaAgentsConfigured,
  });
}
