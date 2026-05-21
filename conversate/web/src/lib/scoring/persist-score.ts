import { isDatabaseConfigured, prisma } from "@/lib/db";
import type { PersonaId } from "@/lib/personas";
import { getRubricForPersona } from "./rubrics";
import type { ScoreOutput } from "./schema";

export async function persistScoreResult(opts: {
  sessionId: string;
  personaId: PersonaId;
  output: ScoreOutput;
  modelName: string;
  latencyMs: number;
  degraded: boolean;
  retrievalTrace: {
    chunkIds: string[];
    scores: number[];
    sources: string[];
  };
  inputHash?: string;
}): Promise<void> {
  if (!isDatabaseConfigured() || opts.sessionId.startsWith("local-")) return;

  const rubric = getRubricForPersona(opts.personaId);
  const scoreRow = await prisma.score.create({
    data: {
      sessionId: opts.sessionId,
      personaId: opts.personaId,
      rubricVersion: rubric.version,
      overallScore: opts.output.overallScore,
      dimensions: opts.output.dimensions,
      strengths: opts.output.strengths,
      weaknesses: opts.output.weaknesses,
      actionItems: opts.output.actionItems,
      evidence: opts.output.evidence,
      confidence: opts.output.confidence,
    },
  });
  await prisma.modelRun.create({
    data: {
      sessionId: opts.sessionId,
      scoreId: scoreRow.id,
      personaId: opts.personaId,
      modelProvider: opts.degraded ? "local" : "google",
      modelName: opts.modelName,
      rubricVersion: rubric.version,
      inputHash: opts.inputHash ?? String(opts.output.overallScore),
      outputJson: opts.output,
      confidence: opts.output.confidence,
      latencyMs: opts.latencyMs,
      retrievalTrace: opts.retrievalTrace,
    },
  });
}
