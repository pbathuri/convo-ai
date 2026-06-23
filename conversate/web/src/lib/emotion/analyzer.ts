import { backendPost } from "@/lib/backend/client";
import { buildEmotionAnalysisPrompt } from "@/lib/emotion/prompt";
import {
  type EmotionTraits,
  emotionFromReadiness,
  emotionTraitsSchema,
} from "@/lib/emotion/schema";
import { generateJsonWithFallback } from "@/lib/llm/router";
import { isOllamaAvailable } from "@/lib/llm/ollama";
import { traceLlmCall } from "@/lib/observability/trace";

export type EmotionAnalysisResult = {
  traits: EmotionTraits;
  degraded: boolean;
  source: "gemini" | "ollama" | "heuristic";
};

export function extractLastUserUtterance(transcript: string): string {
  const lines = transcript
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    if (/^user:/i.test(line)) {
      return line.replace(/^user:\s*/i, "").trim();
    }
  }
  return lines.at(-1) ?? transcript.slice(0, 2000);
}

async function resolvePrompt(
  userInput: string,
  goal: string,
): Promise<string> {
  try {
    const { prompt } = await backendPost<{ prompt: string }>("/emotion/prompt", {
      user_input: userInput,
      goal,
    });
    if (prompt?.trim()) return prompt;
  } catch {
    /* use local prompt */
  }
  return buildEmotionAnalysisPrompt(userInput, goal);
}

export async function analyzeEmotionTraits(opts: {
  user_input: string;
  goal: string;
  readiness_score?: number;
}): Promise<EmotionAnalysisResult> {
  const fallback = (): EmotionAnalysisResult => ({
    traits: emotionFromReadiness(opts.readiness_score ?? 65),
    degraded: true,
    source: "heuristic",
  });

  const apiKey = process.env.GOOGLE_AI_STUDIO_KEY?.trim();
  if (!opts.user_input.trim()) return fallback();
  if (
    !apiKey &&
    !(await isOllamaAvailable())
  ) {
    return fallback();
  }

  try {
    const prompt = await resolvePrompt(opts.user_input, opts.goal);
    const llm = await generateJsonWithFallback({
      prompt,
      parse: (raw) => emotionTraitsSchema.parse(raw),
    });
    if (!llm) return fallback();
    void traceLlmCall({
      name: "emotion_analyze",
      metadata: { provider: llm.provider, model: llm.modelName },
      latencyMs: llm.latencyMs,
    });
    return {
      traits: llm.data,
      degraded: llm.provider === "ollama",
      source: llm.provider === "ollama" ? "ollama" : "gemini",
    };
  } catch {
    return fallback();
  }
}
