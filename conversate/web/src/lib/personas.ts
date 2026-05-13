import { z } from "zod";

export const PERSONA_SLUGS = [
  "coach",
  "interviewer",
  "debater",
  "engineer",
  "executive",
] as const;
export type PersonaSlug = (typeof PERSONA_SLUGS)[number];

const slugToEnv: Record<PersonaSlug, string> = {
  coach: "DID_PERSONA_COACH",
  interviewer: "DID_PERSONA_INTERVIEWER",
  debater: "DID_PERSONA_DEBATER",
  engineer: "DID_PERSONA_ENGINEER",
  executive: "DID_PERSONA_EXECUTIVE",
};

const labels: Record<PersonaSlug, string> = {
  coach: "Communication coach",
  interviewer: "Hiring interviewer",
  debater: "Debate partner",
  engineer: "Staff engineer",
  executive: "Executive advisor",
};

export function personaLabel(slug: PersonaSlug): string {
  return labels[slug];
}

export function personaAgentId(slug: PersonaSlug): string | undefined {
  const key = slugToEnv[slug];
  return process.env[key];
}

export const personaSlugSchema = z.enum(PERSONA_SLUGS);
