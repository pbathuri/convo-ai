import { isDatabaseConfigured, prisma } from "@/lib/db";

export type ScoreTrendPoint = {
  label: string;
  score: number;
  sessionId: string;
};

export type InsightsSnapshot = {
  mode: "live" | "demo";
  sessionsCompleted: number;
  averageReadiness: number | null;
  minutesPracticed: number;
  questionsAnswered: number;
  scoreTrend: ScoreTrendPoint[];
  latestScoredSessionId: string | null;
};

const DEMO: InsightsSnapshot = {
  mode: "demo",
  sessionsCompleted: 3,
  averageReadiness: 68,
  minutesPracticed: 42,
  questionsAnswered: 12,
  scoreTrend: [
    { label: "Week 1", score: 62, sessionId: "demo-1" },
    { label: "Week 2", score: 65, sessionId: "demo-2" },
    { label: "Week 3", score: 68, sessionId: "demo-3" },
  ],
  latestScoredSessionId: null,
};

export function minutesBetween(
  startedAt: Date | null,
  endedAt: Date | null,
): number {
  if (!startedAt || !endedAt) return 0;
  const ms = endedAt.getTime() - startedAt.getTime();
  return ms > 0 ? Math.round(ms / 60_000) : 0;
}

export function averageReadiness(scores: number[]): number | null {
  if (scores.length === 0) return null;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function buildScoreTrend(
  sessions: {
    id: string;
    createdAt: Date;
    scores: { overallScore: number }[];
  }[],
  maxPoints = 8,
): ScoreTrendPoint[] {
  const scored = sessions
    .filter((s) => s.scores[0] != null)
    .slice(0, maxPoints)
    .reverse();
  return scored.map((s, i) => ({
    label: `Session ${i + 1}`,
    score: Math.round(s.scores[0].overallScore),
    sessionId: s.id,
  }));
}

export async function getInsightsSnapshot(): Promise<InsightsSnapshot> {
  if (!isDatabaseConfigured()) return DEMO;

  const sessions = await prisma.session.findMany({
    where: { status: "completed" },
    orderBy: { createdAt: "desc" },
    take: 30,
    include: {
      scores: { take: 1, orderBy: { createdAt: "desc" } },
      messages: { where: { role: "user" }, select: { id: true } },
    },
  });

  if (sessions.length === 0) return DEMO;

  const scores = sessions
    .map((s) => s.scores[0]?.overallScore)
    .filter((n): n is number => typeof n === "number");

  const minutesPracticed = sessions.reduce(
    (sum, s) => sum + minutesBetween(s.startedAt, s.endedAt),
    0,
  );

  const questionsAnswered = sessions.reduce(
    (sum, s) => sum + s.messages.length,
    0,
  );

  const latestScored = sessions.find((s) => s.scores[0] != null);

  return {
    mode: "live",
    sessionsCompleted: sessions.length,
    averageReadiness: averageReadiness(scores),
    minutesPracticed,
    questionsAnswered,
    scoreTrend: buildScoreTrend(sessions),
    latestScoredSessionId: latestScored?.id ?? null,
  };
}
