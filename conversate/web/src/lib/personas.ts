import { z } from "zod";

export type PersonaId =
  | "amazon-l5-bar-raiser"
  | "google-l4-swe"
  | "mckinsey-em-behavioral"
  | "goldman-vp-banking"
  | "microsoft-prin-pm";

export type InterviewMode = "behavioral" | "technical" | "case" | "mixed";
export type Difficulty = "easy" | "medium" | "hard";

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
  interviewModes: InterviewMode[];
  primaryRubricId: string;
  defaultDurationMinutes: number;
  defaultDifficulty: Difficulty;
  openingQuestion: string;
  candidateInstructions: string;
  forbiddenBehavior: string;
  fallbackBehavior: string;
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
    interviewModes: ["behavioral", "technical"],
    primaryRubricId: "rubric-amazon-l5-v1",
    defaultDurationMinutes: 30,
    defaultDifficulty: "medium",
    openingQuestion:
      "Tell me about a time you had to make a high-stakes technical decision with incomplete data.",
    candidateInstructions:
      "Use STAR. Quantify impact. Show ownership and customer obsession.",
    forbiddenBehavior:
      "Do not ask for salary or benefits in the first 10 minutes.",
    fallbackBehavior:
      "If the candidate is vague, ask for metrics, trade-offs, and what they would do differently.",
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
    interviewModes: ["behavioral", "technical"],
    primaryRubricId: "rubric-google-l4-v1",
    defaultDurationMinutes: 45,
    defaultDifficulty: "medium",
    openingQuestion:
      "Walk me through a system you designed end-to-end. What were the key trade-offs?",
    candidateInstructions:
      "Think aloud. Clarify requirements. Discuss scalability and failure modes.",
    forbiddenBehavior: "Do not jump to code without clarifying constraints.",
    fallbackBehavior: "Probe depth on one subsystem if answers stay shallow.",
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
    interviewModes: ["behavioral", "case"],
    primaryRubricId: "rubric-mckinsey-em-v1",
    defaultDurationMinutes: 30,
    defaultDifficulty: "hard",
    openingQuestion:
      "Tell me about a time you influenced a senior stakeholder who disagreed with your recommendation.",
    candidateInstructions:
      "Structure answers: situation, complication, resolution, learning. Be concise.",
    forbiddenBehavior: "Do not ramble beyond 2 minutes per story.",
    fallbackBehavior:
      "Ask for the recommendation, pushback, and measurable outcome.",
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
    interviewModes: ["behavioral", "case", "mixed"],
    primaryRubricId: "rubric-goldman-vp-v1",
    defaultDurationMinutes: 25,
    defaultDifficulty: "hard",
    openingQuestion:
      "Why this group, why now, and what deal or market trend are you following closely?",
    candidateInstructions:
      "Be crisp. Show market awareness. Tie answers to client impact.",
    forbiddenBehavior:
      "Do not discuss confidential deal names without anonymizing.",
    fallbackBehavior: "Redirect to public comps and industry drivers if stuck.",
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
    interviewModes: ["behavioral", "mixed"],
    primaryRubricId: "rubric-msft-pm-v1",
    defaultDurationMinutes: 35,
    defaultDifficulty: "medium",
    openingQuestion:
      "Describe a product bet you championed that failed. What did you learn?",
    candidateInstructions:
      "Show customer empathy, cross-functional leadership, and data-informed decisions.",
    forbiddenBehavior: "Do not blame other teams without owning your role.",
    fallbackBehavior:
      "Ask what signal they missed and how they changed their process.",
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

export const interviewModeSchema = z.enum([
  "behavioral",
  "technical",
  "case",
  "mixed",
]);
export const difficultySchema = z.enum(["easy", "medium", "hard"]);

export function getPersona(id: string): PersonaDefinition | undefined {
  return PERSONAS.find((p) => p.id === id);
}

/** D-ID agent with Studio embed + production domain allowlist configured */
export const EMBEDDED_DID_AGENT_ID = "v2_agt_4pjSCal7";

/** Personas that have a live embedded D-ID interviewer (others are in progress) */
export const LIVE_EMBEDDED_PERSONA_IDS: PersonaId[] = ["amazon-l5-bar-raiser"];

export type PersonaLiveStatus = "live" | "in_progress";

export function isPersonaLiveEmbedded(personaId: PersonaId): boolean {
  return LIVE_EMBEDDED_PERSONA_IDS.includes(personaId);
}

export function getPersonaLiveStatus(personaId: PersonaId): PersonaLiveStatus {
  return isPersonaLiveEmbedded(personaId) ? "live" : "in_progress";
}

/** Agent id for D-ID embed — only returned for live-embedded personas */
export function personaAgentIdForLive(personaId: PersonaId): string | undefined {
  if (!isPersonaLiveEmbedded(personaId)) return undefined;
  return personaAgentId(personaId);
}

export function personaAgentId(personaId: PersonaId): string | undefined {
  const p = getPersona(personaId);
  if (!p) return undefined;
  return process.env[p.didAgentEnvKey];
}

export function defaultPersonaId(): PersonaId {
  return LIVE_EMBEDDED_PERSONA_IDS[0] ?? "amazon-l5-bar-raiser";
}

export function defaultLivePersonaId(): PersonaId {
  return defaultPersonaId();
}
