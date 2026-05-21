import { isDatabaseConfigured, prisma } from "@/lib/db";
import type { PersonaId } from "@/lib/personas";

export type RetrievedChunk = {
  id: string;
  content: string;
  score: number;
  sourceId: string;
  allowedUsage: string;
};

export async function retrieveContextForScoring(
  personaId: PersonaId,
  _interviewMode: string,
  query: string,
  limit = 5,
): Promise<RetrievedChunk[]> {
  if (!isDatabaseConfigured()) return [];

  const chunks = await prisma.kbChunk.findMany({
    where: {
      personaId,
      approvalStatus: "approved",
    },
    include: { source: true },
    take: 50,
  });

  const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 3);
  const scored = chunks.map((c) => {
    const text = c.content.toLowerCase();
    const keyword =
      terms.length === 0 ? 0 : terms.filter((t) => text.includes(t)).length / terms.length;
    const srcQ = c.source.approvalStatus === "approved" ? 1 : 0.3;
    const score = 0.25 * keyword + 0.1 * srcQ;
    return {
      id: c.id,
      content: c.content,
      score,
      sourceId: c.sourceId,
      allowedUsage: c.source.allowedUsage,
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}
