import { GoogleGenerativeAI } from "@google/generative-ai";
import { isOllamaAvailable, ollamaGenerateJson } from "@/lib/llm/ollama";

export type LlmProvider = "gemini" | "ollama" | "none";

export type LlmJsonResult<T> = {
  data: T;
  provider: LlmProvider;
  modelName: string;
  latencyMs: number;
};

export async function generateJsonWithFallback<T>(opts: {
  prompt: string;
  parse: (raw: unknown) => T;
  geminiModel?: string;
}): Promise<LlmJsonResult<T> | null> {
  const apiKey = process.env.GOOGLE_AI_STUDIO_KEY?.trim();
  const geminiModel = opts.geminiModel ?? "gemini-2.0-flash";

  if (apiKey) {
    const start = Date.now();
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: geminiModel,
        generationConfig: { responseMimeType: "application/json" },
      });
      const result = await model.generateContent(opts.prompt);
      const text = result.response.text();
      return {
        data: opts.parse(JSON.parse(text)),
        provider: "gemini",
        modelName: geminiModel,
        latencyMs: Date.now() - start,
      };
    } catch {
      /* fall through to ollama */
    }
  }

  if (await isOllamaAvailable()) {
    try {
      const result = await ollamaGenerateJson({
        prompt: opts.prompt,
        parse: opts.parse,
      });
      return {
        data: result.data,
        provider: "ollama",
        modelName: `ollama/${result.model}`,
        latencyMs: result.latencyMs,
      };
    } catch {
      return null;
    }
  }

  return null;
}

export async function probeLlmProviders(): Promise<{
  gemini: boolean;
  ollama: boolean;
  ollamaModel?: string;
}> {
  const gemini = Boolean(process.env.GOOGLE_AI_STUDIO_KEY?.trim());
  const ollama = await isOllamaAvailable();
  return {
    gemini,
    ollama,
    ollamaModel: ollama ? process.env.OLLAMA_MODEL ?? "gemma2:9b" : undefined,
  };
}
