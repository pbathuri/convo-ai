import { NextResponse } from "next/server";
import { backendGet } from "@/lib/backend/client";
import { captureException } from "@/lib/observability/sentry";

export const dynamic = "force-dynamic";

/** Deepgram agent settings for future real-time voice UI. */
export async function GET() {
  try {
    const data = await backendGet<{ configured: boolean; agent: unknown }>(
      "/voice/agent-config",
    );
    return NextResponse.json(data);
  } catch (e) {
    captureException(e, { route: "voice-agent-config" });
    return NextResponse.json(
      { configured: false, agent: {}, degraded: true },
      { status: 503 },
    );
  }
}
