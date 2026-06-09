import { didAuthHeader } from "@/lib/did/auth";

export type DidEmbedCredentials = {
  agentId: string;
  clientKey: string;
  source: "agent_client_key" | "env_ck" | "env_legacy";
};

/**
 * Studio allowlist is bound to the agent's `client_key` (ck_...), not the legacy Basic API secret.
 * Resolve ck_ from the Agents API when env only has the server Basic payload.
 */
export async function resolveDidEmbedCredentials(
  agentId: string,
): Promise<DidEmbedCredentials> {
  const envKey = (process.env.NEXT_PUBLIC_DID_CLIENT_KEY ?? "").trim();
  if (envKey.startsWith("ck_")) {
    return { agentId, clientKey: envKey, source: "env_ck" };
  }

  const serverAuth = (
    process.env.DID_API_BASIC_KEY ??
    process.env.NEXT_PUBLIC_DID_CLIENT_KEY ??
    ""
  ).trim();

  if (!serverAuth) {
    return { agentId, clientKey: "", source: "env_legacy" };
  }

  try {
    const res = await fetch(`https://api.d-id.com/agents/${agentId}`, {
      method: "GET",
      headers: {
        Authorization: didAuthHeader(serverAuth),
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return { agentId, clientKey: envKey, source: "env_legacy" };
    }

    const data = (await res.json()) as { client_key?: string };
    const clientKey = data.client_key?.trim();
    if (clientKey?.startsWith("ck_")) {
      return { agentId, clientKey, source: "agent_client_key" };
    }
  } catch {
    /* fall through */
  }

  return { agentId, clientKey: envKey, source: "env_legacy" };
}
