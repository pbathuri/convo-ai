import { isDatabaseConfigured, prisma } from "@/lib/db";
import {
  estimateStreak,
  totalXpFromScores,
} from "@/lib/gamification/xp";
import {
  clusterWeaknesses,
  recommendNextDrill,
} from "@/lib/personalization/recommender";
import {
  buildBanditObservations,
} from "@/lib/personalization/bandit";
import type { PersonaId } from "@/lib/personas";
import { personaIdSchema } from "@/lib/personas";

export type ProgressSnapshot = {
  mode: "live" | "demo";
  sessionsCompleted: number;
  averageScore: number | null;
  totalXp: number;
  practiceStreak: number;
  weaknessClusters: { label: string; count: number }[];
  nextDrill: { personaId: PersonaId; drill: string; basedOn?: string; rlStrategy?: string };
};

const DEMO: ProgressSnapshot = {
  mode: "demo",
  sessionsCompleted: 3,
  averageScore: 68,
  totalXp: 90,
  practiceStreak: 2,
  weaknessClusters: [
    { label: "Needs more quantified impact", count: 2 },
    { label: "Structure could be tighter", count: 1 },
  ],
  nextDrill: {
    personaId: "amazon-l5-bar-raiser",
    drill:
      "Tell me about a time you had to make a high-stakes technical decision with incomplete data.",
    basedOn: "Demo data",
  },
};

export async function getProgressSnapshot(
  userId?: string,
): Promise<ProgressSnapshot> {
  if (!isDatabaseConfigured()) return DEMO;

  const sessions = await prisma.session.findMany({
    where: {
      status: "completed",
      ...(userId ? { userId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 30,
    include: { scores: { take: 1, orderBy: { createdAt: "desc" } } },
  });

  if (sessions.length === 0) return DEMO;

  const scores = sessions.flatMap((s) => s.scores.map((sc) => sc.overallScore));
  const averageScore =
    scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : null;

  const allWeaknesses = sessions.flatMap((s) => {
    const w = s.scores[0]?.weaknesses;
    return Array.isArray(w) ? (w as string[]) : [];
  });

  const latest = sessions[0];
  const pid = personaIdSchema.safeParse(latest?.personaId);
  const personaId = pid.success
    ? pid.data
    : ("amazon-l5-bar-raiser" as PersonaId);
  const weaknesses = Array.isArray(latest?.scores[0]?.weaknesses)
    ? (latest.scores[0].weaknesses as string[])
    : [];

  const banditObservations = buildBanditObservations(
    sessions
      .filter((s) => s.scores[0])
      .map((s) => ({
        weaknesses: Array.isArray(s.scores[0]?.weaknesses)
          ? (s.scores[0].weaknesses as string[])
          : [],
        score: s.scores[0]?.overallScore ?? 0,
      })),
  );

  return {
    mode: "live",
    sessionsCompleted: sessions.length,
    averageScore,
    totalXp: totalXpFromScores(scores),
    practiceStreak: estimateStreak(
      sessions.map((s) => s.createdAt),
    ),
    weaknessClusters: clusterWeaknesses(allWeaknesses),
    nextDrill: recommendNextDrill({
      personaId,
      weaknesses,
      banditObservations,
    }),
  };
}
