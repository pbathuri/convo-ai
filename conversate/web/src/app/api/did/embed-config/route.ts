import { NextResponse } from "next/server";
import { resolveDidEmbedCredentials } from "@/lib/did/embed-config";
import { EMBEDDED_DID_AGENT_ID } from "@/lib/personas";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const agentId =
    searchParams.get("agentId") ??
    process.env.DID_PERSONA_AMAZON_L5 ??
    EMBEDDED_DID_AGENT_ID;
  const embed = await resolveDidEmbedCredentials(agentId);
  return NextResponse.json({
    ...embed,
    ok: embed.clientKey.startsWith("ck_"),
    hint: embed.clientKey.startsWith("ck_")
      ? "Use this ck_ key in the browser — it matches your Studio allowlist."
      : "Could not resolve ck_ embed key from agent. Check DID_API_BASIC_KEY or legacy env auth.",
  });
}
