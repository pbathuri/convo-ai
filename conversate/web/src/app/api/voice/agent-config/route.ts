import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { backendGet } from "@/lib/backend/client";
import { captureException } from "@/lib/observability/sentry";

export const dynamic = "force-dynamic";

function localAgentConfig(): { configured: boolean; agent: unknown; source: string } {
  try {
    const path = join(process.cwd(), "..", "..", "backend", "config", "deepgram_agent.json");
    const agent = JSON.parse(readFileSync(path, "utf8")) as unknown;
    return {
      configured: Boolean(process.env.DEEPGRAM_API_KEY),
      agent,
      source: "local",
    };
  } catch {
    return { configured: false, agent: {}, source: "local" };
  }
}

/** Deepgram agent settings for future real-time voice UI. */
export async function GET() {
  try {
    const data = await backendGet<{ configured: boolean; agent: unknown }>(
      "/voice/agent-config",
    );
    return NextResponse.json({ ...data, source: "backend" });
  } catch (e) {
    captureException(e, { route: "voice-agent-config" });
    return NextResponse.json({ ...localAgentConfig(), degraded: true });
  }
}
