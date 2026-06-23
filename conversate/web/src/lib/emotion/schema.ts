import { z } from "zod";

export const emotionTraitsSchema = z.object({
  confidence: z.number().min(0).max(10),
  empathy: z.number().min(0).max(10),
  clarity: z.number().min(0).max(10),
  assertiveness: z.number().min(0).max(10),
  positivity: z.number().min(0).max(10),
  insight: z.string().optional(),
});

export type EmotionTraits = z.infer<typeof emotionTraitsSchema>;

export const EMOTION_TRAIT_KEYS = [
  "confidence",
  "empathy",
  "clarity",
  "assertiveness",
  "positivity",
] as const;

/** Heuristic emotion profile from score dimensions when LLM unavailable. */
export function emotionFromReadiness(score: number): EmotionTraits {
  const base = Math.round((score / 100) * 8);
  return {
    confidence: Math.min(10, base + 1),
    empathy: Math.min(10, base),
    clarity: Math.min(10, base),
    assertiveness: Math.min(10, Math.max(3, base - 1)),
    positivity: Math.min(10, base),
    insight:
      score >= 75
        ? "Strong presence — keep quantifying outcomes."
        : "Add one metric per story to boost clarity and confidence.",
  };
}
