import { NextResponse } from "next/server";
import { probeLlmProviders } from "@/lib/llm/router";

export const dynamic = "force-dynamic";

/** LLM routing status — Gemini cloud + Ollama local inference chain. */
export async function GET() {
  const providers = await probeLlmProviders();
  const chain = [
    providers.gemini ? "gemini" : null,
    providers.ollama ? `ollama:${providers.ollamaModel}` : null,
    "heuristic",
  ].filter(Boolean);

  return NextResponse.json({
    mode: "v2-scoring",
    llmRoute: chain.join(" → "),
    providers,
    detail:
      "Post-session scoring and emotion use Gemini → Ollama → heuristic. Live interview brain remains D-ID Studio.",
  });
}
