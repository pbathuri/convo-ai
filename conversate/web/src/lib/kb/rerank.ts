import type { RetrievedChunk } from "./retrieval";

/** Hybrid score: 0.45·vec + 0.25·keyword + 0.15·persona_rel + 0.10·src_q − 0.05·stale */
export function hybridScore(chunk: RetrievedChunk & { vectorSim?: number; stale?: boolean }): number {
  const vec = chunk.vectorSim ?? chunk.score;
  const keyword = chunk.score;
  const personaRel = 0.15;
  const srcQ = 0.1;
  const stale = chunk.stale ? 0.05 : 0;
  return 0.45 * vec + 0.25 * keyword + personaRel + srcQ - stale;
}

export function rerankChunks(
  chunks: (RetrievedChunk & { vectorSim?: number; stale?: boolean })[],
): RetrievedChunk[] {
  return [...chunks]
    .map((c) => ({ ...c, score: hybridScore(c) }))
    .sort((a, b) => b.score - a.score);
}
