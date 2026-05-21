import type { PersonaId } from "@/lib/personas";
import { getPersona } from "@/lib/personas";

export type RubricDimension = {
  name: string;
  weight: number;
  description: string;
};

export type Rubric = {
  id: string;
  personaId: PersonaId;
  version: string;
  dimensions: RubricDimension[];
};

const RUBRICS: Rubric[] = [
  {
    id: "rubric-amazon-l5-v1",
    personaId: "amazon-l5-bar-raiser",
    version: "v1",
    dimensions: [
      {
        name: "Ownership",
        weight: 0.25,
        description: "End-to-end accountability",
      },
      {
        name: "Customer focus",
        weight: 0.25,
        description: "Working backwards from customer",
      },
      {
        name: "Bias for action",
        weight: 0.25,
        description: "Speed with judgment",
      },
      { name: "Dive deep", weight: 0.25, description: "Data and details" },
    ],
  },
  {
    id: "rubric-google-l4-v1",
    personaId: "google-l4-swe",
    version: "v1",
    dimensions: [
      {
        name: "Problem solving",
        weight: 0.3,
        description: "Structured approach",
      },
      {
        name: "Technical depth",
        weight: 0.35,
        description: "Systems and trade-offs",
      },
      { name: "Collaboration", weight: 0.2, description: "Cross-team work" },
      { name: "Googleyness", weight: 0.15, description: "Values alignment" },
    ],
  },
  {
    id: "rubric-mckinsey-em-v1",
    personaId: "mckinsey-em-behavioral",
    version: "v1",
    dimensions: [
      { name: "Structure", weight: 0.3, description: "MECE, crisp storyline" },
      {
        name: "Leadership",
        weight: 0.3,
        description: "Influence without authority",
      },
      { name: "Impact", weight: 0.25, description: "Measurable outcomes" },
      {
        name: "Presence",
        weight: 0.15,
        description: "Executive communication",
      },
    ],
  },
  {
    id: "rubric-goldman-vp-v1",
    personaId: "goldman-vp-banking",
    version: "v1",
    dimensions: [
      {
        name: "Market awareness",
        weight: 0.3,
        description: "Sector and deal context",
      },
      {
        name: "Technical finance",
        weight: 0.25,
        description: "Valuation and modeling fluency",
      },
      {
        name: "Client focus",
        weight: 0.25,
        description: "Judgment under pressure",
      },
      { name: "Fit", weight: 0.2, description: "Motivation and teamwork" },
    ],
  },
  {
    id: "rubric-msft-pm-v1",
    personaId: "microsoft-prin-pm",
    version: "v1",
    dimensions: [
      {
        name: "Customer empathy",
        weight: 0.3,
        description: "User and partner needs",
      },
      {
        name: "Strategy",
        weight: 0.25,
        description: "Prioritization and bets",
      },
      {
        name: "Execution",
        weight: 0.25,
        description: "Shipping and learning loops",
      },
      { name: "Influence", weight: 0.2, description: "Stakeholder alignment" },
    ],
  },
];

export function getRubricForPersona(personaId: PersonaId): Rubric {
  const p = getPersona(personaId);
  const found = RUBRICS.find((r) => r.id === p?.primaryRubricId);
  if (!found) throw new Error(`No rubric for persona ${personaId}`);
  return found;
}
