import { resolveDidEmbedCredentials } from "@/lib/did/embed-config";
import {
  defaultLivePersonaId,
  isPersonaLiveEmbedded,
  type PersonaId,
  personaAgentIdForLive,
  personaIdSchema,
} from "@/lib/personas";
import { ChatExperience } from "./chat-experience";

export const dynamic = "force-dynamic";

function resolvePersonaId(raw: string | undefined): PersonaId {
  const v = raw ?? defaultLivePersonaId();
  const p = personaIdSchema.safeParse(v);
  return p.success ? p.data : defaultLivePersonaId();
}

export default async function ChatPage({
  searchParams,
}: {
  searchParams: { persona?: string };
}) {
  const personaId = resolvePersonaId(searchParams.persona);
  const agentId = personaAgentIdForLive(personaId) ?? "";
  const embed = agentId
    ? await resolveDidEmbedCredentials(agentId)
    : { agentId: "", clientKey: "", source: "env_legacy" as const };

  return (
    <ChatExperience
      personaId={personaId}
      agentId={embed.agentId || agentId}
      clientKey={embed.clientKey}
      embedKeySource={embed.source}
      liveEmbedded={isPersonaLiveEmbedded(personaId)}
      useOfficialEmbed={embed.clientKey.startsWith("ck_")}
    />
  );
}
