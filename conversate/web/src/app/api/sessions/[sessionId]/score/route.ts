import { NextResponse } from "next/server";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { personaIdSchema, type PersonaId } from "@/lib/personas";
import { retrieveContextForScoring } from "@/lib/kb/retrieval";
import { rerankChunks } from "@/lib/kb/rerank";
import { buildFeedbackReport } from "@/lib/scoring/feedback-engine";
import { getRubricForPersona } from "@/lib/scoring/rubrics";
import { scoreTranscript } from "@/lib/scoring/scorer";
import { listMessages } from "@/lib/transcripts/service";

export async function POST(
  _req: Request,
  { params }: { params: { sessionId: string } },
) {
  const messages = await listMessages(params.sessionId);
  const transcript = messages.map((m) => `${m.role}: ${m.content}`).join("\n");
  const personaId = (messages[0] as { personaId?: string } | undefined)?.personaId;

  const session = isDatabaseConfigured()
    ? await prisma.session.findUnique({ where: { id: params.sessionId } })
    : null;
  const pid = (session?.personaId ?? "amazon-l5-bar-raiser") as PersonaId;
  const parsedPersona = personaIdSchema.safeParse(pid);
  if (!parsedPersona.success) {
    return NextResponse.json({ error: "Invalid persona" }, { status: 400 });
  }

  const rawChunks = await retrieveContextForScoring(
    parsedPersona.data,
    session?.interviewMode ?? "behavioral",
    transcript,
  );
  const ranked = rerankChunks(rawChunks);
  const kbContext = ranked.map((c) => c.content);
  const rubric = getRubricForPersona(parsedPersona.data);

  const { output, modelName, latencyMs } = await scoreTranscript({
    personaId: parsedPersona.data,
    transcript: transcript || "(empty transcript — paste or capture messages first)",
    kbContext,
  });

  const report = buildFeedbackReport(output);
  const retrievalTrace = {
    chunkIds: ranked.map((c) => c.id),
    scores: ranked.map((c) => c.score),
    sources: ranked.map((c) => c.sourceId),
  };

  if (isDatabaseConfigured() && !params.sessionId.startsWith("local-")) {
    const scoreRow = await prisma.score.create({
      data: {
        sessionId: params.sessionId,
        personaId: parsedPersona.data,
        rubricVersion: rubric.version,
        overallScore: output.overallScore,
        dimensions: output.dimensions,
        strengths: output.strengths,
        weaknesses: output.weaknesses,
        actionItems: output.actionItems,
        evidence: output.evidence,
        confidence: output.confidence,
      },
    });
    await prisma.modelRun.create({
      data: {
        sessionId: params.sessionId,
        scoreId: scoreRow.id,
        personaId: parsedPersona.data,
        modelProvider: "google",
        modelName,
        rubricVersion: rubric.version,
        inputHash: String(transcript.length),
        outputJson: output,
        confidence: output.confidence,
        latencyMs,
        retrievalTrace,
      },
    });
  }

  return NextResponse.json({ report, output, retrievalTrace });
}
