import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Returns whether server-side Deepgram is configured for agent WebSocket.
 * Token minting for browser clients is a follow-up (never expose raw API key).
 */
export async function GET() {
  const configured = Boolean(process.env.DEEPGRAM_API_KEY?.trim());
  return NextResponse.json({
    configured,
    wsUrl: "wss://agent.deepgram.com/v1/agent/converse",
    status: configured ? "server_ready" : "unconfigured",
    note: configured
      ? "Agent WebSocket scaffold ready — browser token proxy pending"
      : "Set DEEPGRAM_API_KEY on Vercel for voice agent",
  });
}
