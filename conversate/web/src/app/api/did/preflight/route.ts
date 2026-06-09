import { NextResponse } from "next/server";
import {
  didAgentPreflight,
  didEmbeddedPreflight,
} from "@/lib/did/server-preflight";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const origin = req.headers.get("origin") ?? req.headers.get("referer") ?? "";
  const { searchParams } = new URL(req.url);
  const agentIdParam = searchParams.get("agentId");
  const clientKey = process.env.NEXT_PUBLIC_DID_CLIENT_KEY ?? "";
  const result = agentIdParam
    ? await didAgentPreflight(agentIdParam, clientKey)
    : await didEmbeddedPreflight();
  return NextResponse.json({
    ...result,
    browserOrigin: origin || null,
    allowlistHint:
      "In D-ID Studio → your embed client key → Allowed origins, add this exact URL (no trailing slash):",
    suggestedOrigins: [
      "https://web-delta-three-73.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
  });
}
