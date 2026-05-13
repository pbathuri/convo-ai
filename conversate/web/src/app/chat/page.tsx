import { generateOpeningLine } from "@/lib/llm";
import {
  type PersonaSlug,
  personaAgentId,
  personaLabel,
  personaSlugSchema,
} from "@/lib/personas";
import { ChatExperience } from "./chat-experience";

export const dynamic = "force-dynamic";

function resolveSlug(raw: string | undefined): PersonaSlug {
  const v = raw ?? "coach";
  const p = personaSlugSchema.safeParse(v);
  return p.success ? p.data : "coach";
}

export default async function ChatPage({
  searchParams,
}: {
  searchParams: { persona?: string };
}) {
  const slug = resolveSlug(searchParams.persona);
  const agentId = personaAgentId(slug);
  const clientKey = process.env.NEXT_PUBLIC_DID_CLIENT_KEY ?? "";
  let openingLine = `Hi — I'm your ${personaLabel(slug)}. Tell me what you'd like to practice.`;
  try {
    openingLine = await generateOpeningLine(personaLabel(slug));
  } catch {
    /* missing GOOGLE_AI_STUDIO_KEY or upstream error — keep fallback */
  }

  return (
    <ChatExperience
      slug={slug}
      personaLabel={personaLabel(slug)}
      agentId={agentId ?? ""}
      clientKey={clientKey}
      openingLine={openingLine}
    />
  );
}
