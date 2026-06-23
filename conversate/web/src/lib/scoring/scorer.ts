import type { PersonaId } from "@/lib/personas";
import { getPersona } from "@/lib/personas";
import { generateJsonWithFallback } from "@/lib/llm/router";
import { traceLlmCall } from "@/lib/observability/trace";
import {
  scoreTranscriptHeuristic,
  transcriptHasScorableContent,
} from "./local-heuristics";
import { getRubricForPersona } from "./rubrics";
import { wrapRetrievedContext } from "./safety-preamble";
import { type ScoreOutput, scoreOutputSchema } from "./schema";

export type DegradedReason =
  | "missing_key"
  | "quota"
  | "parse_error"
  | "api_error";

export async function scoreTranscript(opts: {
  personaId: PersonaId;
  transcript: string;
  kbContext?: string[];
}): Promise<{
  output: ScoreOutput;
  modelName: string;
  latencyMs: number;
  degraded?: boolean;
  degradedReason?: DegradedReason;
}> {
  const apiKey = process.env.GOOGLE_AI_STUDIO_KEY;
  const persona = getPersona(opts.personaId);
  const rubric = getRubricForPersona(opts.personaId);
  const start = Date.now();

  if (!transcriptHasScorableContent(opts.transcript)) {
    throw new Error("EMPTY_TRANSCRIPT");
  }

  if (!apiKey) {
    const llm = await generateJsonWithFallback({
      prompt: buildScorePrompt(opts, persona, rubric),
      parse: (raw) => scoreOutputSchema.parse(raw),
    });
    if (llm) {
      void traceLlmCall({
        name: "score_transcript",
        metadata: { provider: llm.provider, model: llm.modelName, personaId: opts.personaId },
        latencyMs: llm.latencyMs,
      });
      return {
        output: llm.data,
        modelName: llm.modelName,
        latencyMs: llm.latencyMs,
        degraded: llm.provider === "ollama",
        degradedReason: llm.provider === "ollama" ? "api_error" : undefined,
      };
    }
    const output = scoreTranscriptHeuristic({
      personaId: opts.personaId,
      transcript: opts.transcript,
      degradedReason: "LLM unavailable",
    });
    return {
      output,
      modelName: "local-heuristic",
      latencyMs: Date.now() - start,
      degraded: true,
      degradedReason: "missing_key",
    };
  }

  try {
    const prompt = buildScorePrompt(opts, persona, rubric);
    const llm = await generateJsonWithFallback({
      prompt,
      parse: (raw) => scoreOutputSchema.parse(raw),
    });
    if (!llm) throw new Error("LLM chain exhausted");
    void traceLlmCall({
      name: "score_transcript",
      metadata: { provider: llm.provider, model: llm.modelName, personaId: opts.personaId },
      latencyMs: llm.latencyMs,
    });
    return {
      output: llm.data,
      modelName: llm.modelName,
      latencyMs: llm.latencyMs,
      degraded: llm.provider === "ollama",
      degradedReason: llm.provider === "ollama" ? "api_error" : undefined,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const isQuota = /429|quota|rate/i.test(msg);
    const reason: DegradedReason = isQuota ? "quota" : "api_error";
    const output = scoreTranscriptHeuristic({
      personaId: opts.personaId,
      transcript: opts.transcript,
      degradedReason: isQuota
        ? "Gemini quota exceeded"
        : "Gemini API unavailable",
    });
    return {
      output,
      modelName: "local-heuristic",
      latencyMs: Date.now() - start,
      degraded: true,
      degradedReason: reason,
    };
  }
}

function buildScorePrompt(
  opts: { personaId: PersonaId; transcript: string; kbContext?: string[] },
  persona: ReturnType<typeof getPersona>,
  rubric: ReturnType<typeof getRubricForPersona>,
): string {
  const contextBlock = opts.kbContext?.length
    ? wrapRetrievedContext(opts.kbContext)
    : "";
  return `You are an interview coach scoring a practice session for ${persona?.companyName} (${persona?.role}).

Rubric dimensions: ${JSON.stringify(rubric.dimensions)}

Transcript:
${opts.transcript}

${contextBlock}

Return JSON matching: overallScore (0-100), dimensions[{name,score,rationale}], strengths[], weaknesses[], actionItems[3 items], evidence[{quote,dimension}], confidence (0-1), nextDrill (string).`;
}
