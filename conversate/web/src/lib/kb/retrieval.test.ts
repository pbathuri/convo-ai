import { beforeEach, describe, expect, it, vi } from "vitest";
import { retrieveContextForScoring } from "./retrieval";

vi.mock("@/lib/db", () => ({
  isDatabaseConfigured: vi.fn(() => true),
  prisma: {
    kbChunk: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/db";

describe("retrieveContextForScoring", () => {
  beforeEach(() => {
    vi.mocked(prisma.kbChunk.findMany).mockReset();
  });

  it("ranks chunks by keyword overlap", async () => {
    vi.mocked(prisma.kbChunk.findMany).mockResolvedValue([
      {
        id: "a",
        content: "latency optimization for distributed systems",
        sourceId: "s1",
        personaId: "amazon-l5-bar-raiser",
        approvalStatus: "approved",
        source: { approvalStatus: "approved", allowedUsage: "rag_only_no_display" },
      },
      {
        id: "b",
        content: "unrelated marketing copy",
        sourceId: "s2",
        personaId: "amazon-l5-bar-raiser",
        approvalStatus: "approved",
        source: { approvalStatus: "approved", allowedUsage: "rag_only_no_display" },
      },
    ] as never);

    const hits = await retrieveContextForScoring(
      "amazon-l5-bar-raiser",
      "behavioral",
      "tell me about latency optimization",
      2,
    );
    expect(hits).toHaveLength(2);
    expect(hits[0]?.id).toBe("a");
    expect(hits[0]?.score).toBeGreaterThan(hits[1]?.score ?? 0);
  });

  it("returns empty when DB not configured", async () => {
    const { isDatabaseConfigured } = await import("@/lib/db");
    vi.mocked(isDatabaseConfigured).mockReturnValueOnce(false);
    const hits = await retrieveContextForScoring(
      "amazon-l5-bar-raiser",
      "behavioral",
      "query",
    );
    expect(hits).toEqual([]);
  });
});
