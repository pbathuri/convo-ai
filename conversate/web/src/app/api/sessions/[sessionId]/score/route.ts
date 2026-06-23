import { NextResponse } from "next/server";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { rerankChunks } from "@/lib/kb/rerank";
import { retrieveContextForScoring } from "@/lib/kb/retrieval";
import { type PersonaId, personaIdSchema } from "@/lib/personas";
import { getPersona } from "@/lib/personas";
import {
  analyzeEmotionTraits,
  extractLastUserUtterance,
} from "@/lib/emotion/analyzer";
import { buildFeedbackReport } from "@/lib/scoring/feedback-engine";
import {
  scoreTranscriptHeuristic,
  transcriptHasScorableContent,
} from "@/lib/scoring/local-heuristics";
import { persistScoreResult } from "@/lib/scoring/persist-score";
import { scoreTranscript } from "@/lib/scoring/scorer";
import { listMessages } from "@/lib/transcripts/service";

export async function POST(
  _req: Request,
  { params }: { params: { sessionId: string } },
) {
  const messages = await listMessages(params.sessionId);
  const transcript = messages.map((m) => `${m.role}: ${m.content}`).join("\n");

  const session = isDatabaseConfigured()
    ? await prisma.session.findUnique({ where: { id: params.sessionId } })
    : null;
  const pid = (session?.personaId ?? "amazon-l5-bar-raiser") as PersonaId;
  const parsedPersona = personaIdSchema.safeParse(pid);
  if (!parsedPersona.success) {
    return NextResponse.json({ error: "Invalid persona" }, { status: 400 });
  }

  try {
    const rawChunks = await retrieveContextForScoring(
      parsedPersona.data,
      session?.interviewMode ?? "behavioral",
      transcript,
    );
    const ranked = rerankChunks(rawChunks);
    const kbContext = ranked.map((c) => c.content);
    const { output, modelName, latencyMs, degraded, degradedReason } =
      await scoreTranscript({
        personaId: parsedPersona.data,
        transcript,
        kbContext,
      });

    const report = buildFeedbackReport(output);
    const persona = getPersona(parsedPersona.data);
    const emotion = await analyzeEmotionTraits({
      user_input: extractLastUserUtterance(transcript),
      goal: `Practice ${persona?.role ?? "interview"} at ${persona?.companyName ?? "target company"}`,
      readiness_score: output.overallScore,
    });
    const retrievalTrace = {
      chunkIds: ranked.map((c) => c.id),
      scores: ranked.map((c) => c.score),
      sources: ranked.map((c) => c.sourceId),
    };

    await persistScoreResult({
      sessionId: params.sessionId,
      personaId: parsedPersona.data,
      output,
      modelName,
      latencyMs,
      degraded: degraded ?? false,
      retrievalTrace,
      inputHash: String(transcript.length),
      emotionTraits: emotion.traits,
    });

    return NextResponse.json({
      report,
      output,
      retrievalTrace,
      degraded: degraded ?? false,
      degradedReason: degradedReason ?? null,
      emotionTraits: emotion.traits,
      emotionDegraded: emotion.degraded,
      emotionSource: emotion.source,
    });
  } catch (e) {
    if (e instanceof Error && e.message === "EMPTY_TRANSCRIPT") {
      return NextResponse.json(
        {
          error:
            "No transcript to score. Capture speech or paste user:/agent: lines in the interview room first.",
        },
        { status: 400 },
      );
    }

    if (transcriptHasScorableContent(transcript)) {
      const start = Date.now();
      const output = scoreTranscriptHeuristic({
        personaId: parsedPersona.data,
        transcript,
        degradedReason: "Scoring service unavailable",
      });
      const report = buildFeedbackReport(output);
      const retrievalTrace = {
        chunkIds: [] as string[],
        scores: [] as number[],
        sources: [] as string[],
      };
      const latencyMs = Date.now() - start;
      await persistScoreResult({
        sessionId: params.sessionId,
        personaId: parsedPersona.data,
        output,
        modelName: "local-heuristic",
        latencyMs,
        degraded: true,
        retrievalTrace,
        inputHash: String(transcript.length),
      });
      return NextResponse.json({
        report,
        output,
        retrievalTrace,
        degraded: true,
        degradedReason: "api_error",
      });
    }

    return NextResponse.json(
      {
        error:
          e instanceof Error
            ? e.message
            : "Scoring failed. Add transcript content and retry.",
      },
      { status: 503 },
    );
  }
}
