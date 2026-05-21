import { PrismaClient } from "@prisma/client";
import { PERSONAS } from "../src/lib/personas";

const prisma = new PrismaClient();

async function main() {
  const devUser = await prisma.userProfile.upsert({
    where: { email: "dev@conversate.local" },
    update: {},
    create: { email: "dev@conversate.local", name: "Dev User", role: "admin" },
  });

  await prisma.consent.upsert({
    where: { id: "consent-dev-v1" },
    update: {},
    create: {
      id: "consent-dev-v1",
      userId: devUser.id,
      policyVersion: "v1",
    },
  });

  for (const p of PERSONAS) {
    await prisma.persona.upsert({
      where: { id: p.id },
      update: {
        displayName: p.displayName,
        companyName: p.companyName,
        role: p.role,
        seniority: p.seniority,
        didAgentEnvKey: p.didAgentEnvKey,
        primaryRubricId: p.primaryRubricId,
        defaultDurationMinutes: p.defaultDurationMinutes,
        defaultDifficulty: p.defaultDifficulty,
        openingQuestion: p.openingQuestion,
        candidateInstructions: p.candidateInstructions,
        forbiddenBehavior: p.forbiddenBehavior,
        fallbackBehavior: p.fallbackBehavior,
        interviewModes: p.interviewModes,
      },
      create: {
        id: p.id,
        displayName: p.displayName,
        companyName: p.companyName,
        role: p.role,
        seniority: p.seniority,
        didAgentEnvKey: p.didAgentEnvKey,
        primaryRubricId: p.primaryRubricId,
        defaultDurationMinutes: p.defaultDurationMinutes,
        defaultDifficulty: p.defaultDifficulty,
        openingQuestion: p.openingQuestion,
        candidateInstructions: p.candidateInstructions,
        forbiddenBehavior: p.forbiddenBehavior,
        fallbackBehavior: p.fallbackBehavior,
        interviewModes: p.interviewModes,
      },
    });
    await prisma.rubric.upsert({
      where: { id: p.primaryRubricId },
      update: {},
      create: {
        id: p.primaryRubricId,
        personaId: p.id,
        version: "v1",
        dimensions: [],
      },
    });
  }

  const session = await prisma.session.upsert({
    where: { id: "seed-session-completed" },
    update: {},
    create: {
      id: "seed-session-completed",
      userId: devUser.id,
      personaId: "amazon-l5-bar-raiser",
      status: "completed",
      interviewMode: "behavioral",
      difficulty: "medium",
      rubricVersion: "rubric-amazon-l5-v1",
      startedAt: new Date(),
      endedAt: new Date(),
    },
  });

  await prisma.message.deleteMany({ where: { sessionId: session.id } });
  await prisma.message.createMany({
    data: [
      {
        sessionId: session.id,
        role: "agent",
        content: "Tell me about a time you owned a critical decision.",
        sequence: 0,
      },
      {
        sessionId: session.id,
        role: "user",
        content: "I led a launch that improved conversion by 12% over six weeks.",
        sequence: 1,
      },
    ],
  });

  await prisma.score.upsert({
    where: { id: "seed-score-1" },
    update: {},
    create: {
      id: "seed-score-1",
      sessionId: session.id,
      personaId: "amazon-l5-bar-raiser",
      rubricVersion: "v1",
      overallScore: 72,
      dimensions: [{ name: "Ownership", score: 75, rationale: "Clear ownership" }],
      strengths: ["Structured answer"],
      weaknesses: ["Needs customer impact detail"],
      actionItems: ["Add customer metric", "Shorten opening", "Prepare follow-up"],
      evidence: [{ quote: "conversion by 12%", dimension: "Ownership" }],
      confidence: 0.7,
    },
  });

  const source = await prisma.kbSource.upsert({
    where: { id: "seed-source-manual" },
    update: {},
    create: {
      id: "seed-source-manual",
      sourceType: "manual_uploads",
      captureMethod: "manual",
      licenseStatus: "internal_use_only",
      robotsStatus: "not_checked",
      allowedUsage: "rag_only_no_display",
      piiStatus: "none",
      approvalStatus: "approved",
    },
  });

  const doc = await prisma.kbDocument.upsert({
    where: { id: "seed-doc-1" },
    update: {},
    create: { id: "seed-doc-1", sourceId: source.id, title: "Sample drills" },
  });

  await prisma.kbChunk.deleteMany({ where: { sourceId: source.id } });
  await prisma.kbChunk.createMany({
    data: [
      {
        documentId: doc.id,
        sourceId: source.id,
        personaId: "amazon-l5-bar-raiser",
        content: "Strong answers quantify impact and show customer obsession.",
        approvalStatus: "approved",
        qualityScore: 0.9,
      },
    ],
  });

  console.info("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
