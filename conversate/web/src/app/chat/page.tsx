import { generateOpeningLine } from "@/lib/llm";
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

export default async function ChatPage({
  searchParams,
}: {
  searchParams: { persona?: string };
}) {
  const personaId = resolvePersonaId(searchParams.persona);
  const persona = getPersona(personaId);
  const agentId = personaAgentId(personaId) ?? "";
  const clientKey = process.env.NEXT_PUBLIC_DID_CLIENT_KEY ?? "";
  const label = persona ? `${persona.displayName} (${persona.companyName})` : personaId;
  let openingLine = `Hi — I'm ${label}. Tell me what you'd like to practice.`;
  try {
    openingLine = await generateOpeningLine(label);
  } catch {
    /* missing GOOGLE_AI_STUDIO_KEY or upstream */
  }

  return (
    <ChatExperience
      personaId={personaId}
      headline={label}
      subtitle={persona?.role ?? ""}
      agentId={agentId}
      clientKey={clientKey}
      openingLine={openingLine}
    />
  );
}
