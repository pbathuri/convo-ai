import { z } from "zod";
import { difficultySchema, interviewModeSchema, personaIdSchema } from "@/lib/personas";

export const personaDefinitionSchema = z.object({
  id: personaIdSchema,
  displayName: z.string().min(1),
  companyName: z.string().min(1),
  role: z.string().min(1),
  seniority: z.string().min(1),
  didAgentEnvKey: z.string().min(1),
  voiceLabel: z.string().min(1),
  photoUrl: z.string().min(1),
  interviewModes: z.array(interviewModeSchema).min(1),
  primaryRubricId: z.string().min(1),
  defaultDurationMinutes: z.number().int().positive(),
  defaultDifficulty: difficultySchema,
  openingQuestion: z.string().min(1),
  candidateInstructions: z.string().min(1),
  forbiddenBehavior: z.string().min(1),
  fallbackBehavior: z.string().min(1),
});
