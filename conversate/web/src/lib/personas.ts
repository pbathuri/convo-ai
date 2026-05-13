import { z } from "zod";

export type PersonaId =
  | "amazon-l5-bar-raiser"
  | "google-l4-swe"
  | "mckinsey-em-behavioral"
  | "goldman-vp-banking"
  | "microsoft-prin-pm";

export type PersonaDefinition = {
  id: PersonaId;
  displayName: string;
  companyName: string;
  role: string;
  seniority: string;
  didAgentEnvKey:
    | "DID_PERSONA_AMAZON_L5"
    | "DID_PERSONA_GOOGLE_L4"
    | "DID_PERSONA_MCKINSEY_EM"
    | "DID_PERSONA_GOLDMAN_VP"
    | "DID_PERSONA_MSFT_PM";
  voiceLabel: string;
  photoUrl: string;
};

export const PERSONAS: PersonaDefinition[] = [
  {
    id: "amazon-l5-bar-raiser",
    displayName: "Sarah Chen",
    companyName: "Amazon",
    role: "Senior Engineering Manager (L6)",
    seniority: "L6",
    didAgentEnvKey: "DID_PERSONA_AMAZON_L5",
    voiceLabel: "calm-pragmatic",
    photoUrl: "/personas/amazon-l5.jpg",
  },
  {
    id: "google-l4-swe",
    displayName: "David Park",
    companyName: "Google",
    role: "Senior Software Engineer (L5)",
    seniority: "L5",
    didAgentEnvKey: "DID_PERSONA_GOOGLE_L4",
    voiceLabel: "warm-curious",
    photoUrl: "/personas/google-l4.jpg",
  },
  {
    id: "mckinsey-em-behavioral",
    displayName: "Priya Sharma",
    companyName: "McKinsey & Company",
    role: "Engagement Manager",
    seniority: "EM",
    didAgentEnvKey: "DID_PERSONA_MCKINSEY_EM",
    voiceLabel: "polished-structured",
    photoUrl: "/personas/mckinsey-em.jpg",
  },
  {
    id: "goldman-vp-banking",
    displayName: "Marcus Wei",
    companyName: "Goldman Sachs",
    role: "Vice President, Investment Banking (TMT)",
    seniority: "VP",
    didAgentEnvKey: "DID_PERSONA_GOLDMAN_VP",
    voiceLabel: "polished-fast",
    photoUrl: "/personas/goldman-vp.jpg",
  },
  {
    id: "microsoft-prin-pm",
    displayName: "Jamie Ortiz",
    companyName: "Microsoft",
    role: "Principal Program Manager",
    seniority: "Principal",
    didAgentEnvKey: "DID_PERSONA_MSFT_PM",
    voiceLabel: "warm-reflective",
    photoUrl: "/personas/msft-prin-pm.jpg",
  },
];

const PERSONA_ID_TUPLE = [
  "amazon-l5-bar-raiser",
  "google-l4-swe",
  "mckinsey-em-behavioral",
  "goldman-vp-banking",
  "microsoft-prin-pm",
] as const;

export const personaIdSchema = z.enum(PERSONA_ID_TUPLE);

export function getPersona(id: string): PersonaDefinition | undefined {
  return PERSONAS.find((p) => p.id === id);
}

/** Resolve D-ID agent id from server env for this persona. */
export function personaAgentId(personaId: PersonaId): string | undefined {
  const p = getPersona(personaId);
  if (!p) return undefined;
  return process.env[p.didAgentEnvKey];
}

export function defaultPersonaId(): PersonaId {
  return "amazon-l5-bar-raiser";
}
