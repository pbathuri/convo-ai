import { z } from "zod";

export const scoreDimensionSchema = z.object({
  name: z.string(),
  score: z.number().min(0).max(100),
  rationale: z.string(),
});

export const scoreOutputSchema = z.object({
  overallScore: z.number().min(0).max(100),
  dimensions: z.array(scoreDimensionSchema),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  actionItems: z.array(z.string()).min(1).max(5),
  evidence: z.array(
    z.object({
      quote: z.string(),
      dimension: z.string().optional(),
    }),
  ),
  confidence: z.number().min(0).max(1).optional(),
  nextDrill: z.string().optional(),
});

export type ScoreOutput = z.infer<typeof scoreOutputSchema>;
