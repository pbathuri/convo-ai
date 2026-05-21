import { GoogleGenerativeAI } from "@google/generative-ai";
import type { PersonaId } from "@/lib/personas";
import { getPersona } from "@/lib/personas";
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
    const output = scoreTranscriptHeuristic({
      personaId: opts.personaId,
      transcript: opts.transcript,
      degradedReason: "Gemini key unavailable",
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
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const contextBlock = opts.kbContext?.length
      ? wrapRetrievedContext(opts.kbContext)
      : "";

    const prompt = `You are an interview coach scoring a practice session for ${persona?.companyName} (${persona?.role}).

Rubric dimensions: ${JSON.stringify(rubric.dimensions)}

Transcript:
${opts.transcript}

${contextBlock}

Return JSON matching: overallScore (0-100), dimensions[{name,score,rationale}], strengths[], weaknesses[], actionItems[3 items], evidence[{quote,dimension}], confidence (0-1), nextDrill (string).`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = scoreOutputSchema.parse(JSON.parse(text));
    return {
      output: parsed,
      modelName: "gemini-2.0-flash",
      latencyMs: Date.now() - start,
      degraded: false,
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
