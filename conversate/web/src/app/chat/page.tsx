import {
  defaultPersonaId,
  getPersona,
  personaAgentId,
  personaIdSchema,
  type PersonaId,
} from "@/lib/personas";
import { ChatExperience } from "./chat-experience";

export const dynamic = "force-dynamic";

function resolvePersonaId(raw: string | undefined): PersonaId {
  const v = raw ?? defaultPersonaId();
  const p = personaIdSchema.safeParse(v);
  return p.success ? p.data : defaultPersonaId();
}

export default function ChatPage({
  searchParams,
}: {
  searchParams: { persona?: string };
}) {
  const personaId = resolvePersonaId(searchParams.persona);
  const persona = getPersona(personaId);
  const agentId = personaAgentId(personaId) ?? "";
  const clientKey = process.env.NEXT_PUBLIC_DID_CLIENT_KEY ?? "";
  return (
    <ChatExperience personaId={personaId} agentId={agentId} clientKey={clientKey} />
  );
}
