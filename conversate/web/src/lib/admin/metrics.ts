import { isDatabaseConfigured, prisma } from "@/lib/db";
import { PERSONAS } from "@/lib/personas";

export type AdminMetrics = {
  personaCount: number;
  kbSources: number | null;
  kbPending: number | null;
  sessionCount: number | null;
  lastScoringLatencyMs: number | null;
};

export async function getAdminMetrics(): Promise<AdminMetrics> {
  const base: AdminMetrics = {
    personaCount: PERSONAS.length,
    kbSources: null,
    kbPending: null,
    sessionCount: null,
    lastScoringLatencyMs: null,
  };

  if (!isDatabaseConfigured()) return base;

  const [kbSources, kbPending, sessionCount, lastRun] = await Promise.all([
    prisma.kbSource.count(),
    prisma.kbSource.count({ where: { approvalStatus: "pending" } }),
    prisma.session.count(),
    prisma.modelRun.findFirst({
      orderBy: { createdAt: "desc" },
      select: { latencyMs: true },
    }),
  ]);

  return {
    personaCount: PERSONAS.length,
    kbSources,
    kbPending,
    sessionCount,
    lastScoringLatencyMs: lastRun?.latencyMs ?? null,
  };
}
