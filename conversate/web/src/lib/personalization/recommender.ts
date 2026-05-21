import type { PersonaId } from "@/lib/personas";
import { getPersona } from "@/lib/personas";

export function recommendNextDrill(opts: {
  personaId: PersonaId;
  weaknesses: string[];
}): { personaId: PersonaId; drill: string } {
  const p = getPersona(opts.personaId);
  return {
    personaId: opts.personaId,
    drill: p?.openingQuestion ?? "Practice your opening story with metrics.",
  };
}
