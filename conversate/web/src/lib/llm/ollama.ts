const DEFAULT_BASE = "http://127.0.0.1:11434";
const DEFAULT_MODEL = "gemma2:9b";

export function ollamaConfig(): { baseUrl: string; model: string } {
  return {
    baseUrl: (process.env.OLLAMA_BASE_URL ?? DEFAULT_BASE).replace(/\/$/, ""),
    model: process.env.OLLAMA_MODEL ?? DEFAULT_MODEL,
  };
}

export async function isOllamaAvailable(): Promise<boolean> {
  const { baseUrl } = ollamaConfig();
  try {
    const res = await fetch(`${baseUrl}/api/tags`, {
      signal: AbortSignal.timeout(2500),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function ollamaGenerateJson<T>(opts: {
  prompt: string;
  parse: (raw: unknown) => T;
}): Promise<{ data: T; model: string; latencyMs: number }> {
  const { baseUrl, model } = ollamaConfig();
  const start = Date.now();
  const res = await fetch(`${baseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt: opts.prompt,
      stream: false,
      format: "json",
    }),
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) {
    throw new Error(`ollama ${res.status}`);
  }
  const body = (await res.json()) as { response?: string };
  const text = body.response?.trim();
  if (!text) throw new Error("ollama empty response");
  const parsed = JSON.parse(text) as unknown;
  return {
    data: opts.parse(parsed),
    model,
    latencyMs: Date.now() - start,
  };
}
