import { NextResponse } from "next/server";
import { didAuthHeader } from "@/lib/did/auth";

export const dynamic = "force-dynamic";

/** Server-side proxy for D-ID agent metadata (avoids browser CORS on api.d-id.com). */
export async function GET(
  _req: Request,
  { params }: { params: { agentId: string } },
) {
  const { agentId } = params;
  const clientKey = (
    process.env.DID_API_BASIC_KEY ??
    process.env.NEXT_PUBLIC_DID_CLIENT_KEY ??
    ""
  ).trim();

  if (!agentId || !clientKey) {
    return NextResponse.json(
      { ok: false, error: "missing_credentials" },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(`https://api.d-id.com/agents/${agentId}`, {
      method: "GET",
      headers: {
        Authorization: didAuthHeader(clientKey),
        Accept: "application/json",
      },
      cache: "no-store",
    });
    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 502 },
    );
  }
}
