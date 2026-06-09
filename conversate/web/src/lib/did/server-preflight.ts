import { didAuthHeader } from "@/lib/did/auth";
import { resolveDidEmbedCredentials } from "@/lib/did/embed-config";
import { EMBEDDED_DID_AGENT_ID } from "@/lib/personas";

export type DidPreflightResult = {
  ok: boolean;
  agentId: string;
  status: number;
  error?: string;
  hint?: string;
};

export async function didAgentPreflight(
  agentId: string,
  clientKey: string,
): Promise<DidPreflightResult> {
  if (!agentId || !clientKey) {
    return {
      ok: false,
      agentId,
      status: 0,
      error: "missing_credentials",
      hint: "Set NEXT_PUBLIC_DID_CLIENT_KEY and DID_PERSONA_AMAZON_L5 on Vercel.",
    };
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

    if (res.ok) {
      return { ok: true, agentId, status: res.status };
    }

    const body = await res.text().catch(() => "");
    return {
      ok: false,
      agentId,
      status: res.status,
      error: body.slice(0, 200) || res.statusText,
      hint:
        res.status === 401 || res.status === 403
          ? "Invalid D-ID embed client key — use Studio embed key, not server API key."
          : "Agent ID may not match your D-ID account.",
    };
  } catch (e) {
    return {
      ok: false,
      agentId,
      status: 0,
      error: e instanceof Error ? e.message : String(e),
      hint: "Server could not reach api.d-id.com.",
    };
  }
}

export async function didEmbeddedPreflight(): Promise<
  DidPreflightResult & { embedClientKeyReady?: boolean }
> {
  const agentId =
    process.env.DID_PERSONA_AMAZON_L5 ?? EMBEDDED_DID_AGENT_ID;
  const serverAuth = (
    process.env.DID_API_BASIC_KEY ??
    process.env.NEXT_PUBLIC_DID_CLIENT_KEY ??
    ""
  ).trim();
  const embed = await resolveDidEmbedCredentials(agentId);
  const api = await didAgentPreflight(agentId, serverAuth);
  const embedClientKeyReady = embed.clientKey.startsWith("ck_");
  return {
    ...api,
    ok: api.ok && embedClientKeyReady,
    embedClientKeyReady,
    hint: embedClientKeyReady
      ? api.ok
        ? undefined
        : api.hint
      : "Could not resolve ck_ embed client key from agent.",
  };
}
