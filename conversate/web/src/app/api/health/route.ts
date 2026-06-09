import { NextResponse } from "next/server";
import { getEnvHealth } from "@/lib/env-check";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks = await getEnvHealth();
  const ok =
    checks.didClientKey &&
    checks.liveEmbeddedAgentReady &&
    (!checks.database || checks.databaseReachable);
  // liveEmbeddedAgentReady now requires resolved ck_ embed key

  return NextResponse.json({
    ok,
    service: "conversate-web",
    checks,
  });
}
