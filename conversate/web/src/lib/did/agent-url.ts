/** When set, server-side D-ID agent fetches use the local Next proxy route. */
export function resolveDidAgentApiUrl(agentId: string, origin?: string): string {
  if (process.env.DID_USE_LOCAL_PROXY === "1" && origin) {
    return `${origin.replace(/\/$/, "")}/api/did/agent/${agentId}`;
  }
  return `https://api.d-id.com/agents/${agentId}`;
}
