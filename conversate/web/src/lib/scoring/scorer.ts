import { GoogleGenerativeAI } from "@google/generative-ai";
import type { PersonaId } from "@/lib/personas";
import { getPersona } from "@/lib/personas";
import { wrapRetrievedContext } from "./safety-preamble";
import { getRubricForPersona } from "./rubrics";
import { scoreOutputSchema, type ScoreOutput } from "./schema";

function buildStubScore(opts: {
  personaId: PersonaId;
  transcript: string;
  rationale?: string;
}): ScoreOutput {
  const persona = getPersona(opts.personaId);
  const rubric = getRubricForPersona(opts.personaId);
  return {
    overallScore: 72,
    dimensions: rubric.dimensions.map((d) => ({
      name: d.name,
      score: 70,
      rationale: opts.rationale ?? "Stub score — set GOOGLE_AI_STUDIO_KEY for live scoring.",
    })),
    strengths: ["Clear structure"],
    weaknesses: ["Needs more quantified impact"],
    actionItems: [
      "Add metrics to your opening story",
      "Practice a 90-second concise version",
      "Prepare one follow-up depth answer",
    ],
    evidence: [
      { quote: opts.transcript.slice(0, 120) || "(no transcript)", dimension: "Sample" },
    ],
    confidence: 0.5,
    nextDrill: persona?.openingQuestion,
  };
}

export async function scoreTranscript(opts: {
  personaId: PersonaId;
  transcript: string;
  kbContext?: string[];
}): Promise<{ output: ScoreOutput; modelName: string; latencyMs: number; degraded?: boolean }> {
  const apiKey = process.env.GOOGLE_AI_STUDIO_KEY;
  const persona = getPersona(opts.personaId);
  const rubric = getRubricForPersona(opts.personaId);
  const start = Date.now();

  if (!apiKey) {
    const stub: ScoreOutput = buildStubScore({
      personaId: opts.personaId,
      transcript: opts.transcript,
    });
    return { output: stub, modelName: "stub", latencyMs: Date.now() - start, degraded: true };
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
  } catch {
    const stub = buildStubScore({
      personaId: opts.personaId,
      transcript: opts.transcript,
      rationale: "Live scoring unavailable (quota or API error) — showing coaching stub.",
    });
    return {
      output: stub,
      modelName: "stub-degraded",
      latencyMs: Date.now() - start,
      degraded: true,
    };
  }
}

