import { isDatabaseConfigured, prisma } from "@/lib/db";
import { getPersona } from "@/lib/personas";
import type {
  CreateSessionInput,
  SessionStatus,
  SessionSummary,
} from "./types";

function toSummary(row: {
  id: string;
  personaId: string;
  status: string;
  interviewMode: string;
  difficulty: string;
  createdAt: Date;
  startedAt: Date | null;
  endedAt: Date | null;
}): SessionSummary {
  return {
    id: row.id,
    personaId: row.personaId,
    status: row.status as SessionStatus,
    interviewMode: row.interviewMode,
    difficulty: row.difficulty,
    createdAt: row.createdAt.toISOString(),
    startedAt: row.startedAt?.toISOString() ?? null,
    endedAt: row.endedAt?.toISOString() ?? null,
  };
}

export async function createSession(
  input: CreateSessionInput,
): Promise<SessionSummary> {
  const persona = getPersona(input.personaId);
  if (!persona) throw new Error("Unknown persona");

  if (!isDatabaseConfigured()) {
    return {
      id: `local-${Date.now()}`,
      personaId: input.personaId,
      status: "created",
      interviewMode: input.interviewMode ?? "behavioral",
      difficulty: input.difficulty ?? persona.defaultDifficulty,
      createdAt: new Date().toISOString(),
      startedAt: null,
      endedAt: null,
    };
  }

  const row = await prisma.session.create({
    data: {
      personaId: input.personaId,
      userId: input.userId,
      status: "created",
      interviewMode: input.interviewMode ?? "behavioral",
      difficulty: input.difficulty ?? persona.defaultDifficulty,
      rubricVersion: persona.primaryRubricId,
    },
  });
  return toSummary(row);
}

export async function updateSessionStatus(
  sessionId: string,
  status: SessionStatus,
): Promise<SessionSummary | null> {
  if (!isDatabaseConfigured() || sessionId.startsWith("local-")) {
    return null;
  }
  const data: { status: SessionStatus; startedAt?: Date; endedAt?: Date } = {
    status,
  };
  if (status === "live") data.startedAt = new Date();
  if (status === "completed" || status === "failed" || status === "abandoned") {
    data.endedAt = new Date();
  }
  const row = await prisma.session.update({ where: { id: sessionId }, data });
  return toSummary(row);
}

export type SessionListItem = SessionSummary & {
  messageCount: number;
  overallScore: number | null;
};

export async function listSessions(userId?: string): Promise<SessionSummary[]> {
  const enriched = await listSessionsEnriched(userId);
  return enriched;
}

export async function listSessionsEnriched(
  userId?: string,
): Promise<SessionListItem[]> {
  if (!isDatabaseConfigured()) return [];
  const rows = await prisma.session.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      _count: { select: { messages: true } },
      scores: { take: 1, orderBy: { createdAt: "desc" } },
    },
  });
  return rows.map((row) => ({
    ...toSummary(row),
    messageCount: row._count.messages,
    overallScore: row.scores[0]?.overallScore ?? null,
  }));
}

export async function getSession(sessionId: string) {
  if (!isDatabaseConfigured() || sessionId.startsWith("local-")) return null;
  return prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      messages: { orderBy: { sequence: "asc" } },
      scores: { orderBy: { createdAt: "desc" }, take: 1 },
      modelRuns: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
}
