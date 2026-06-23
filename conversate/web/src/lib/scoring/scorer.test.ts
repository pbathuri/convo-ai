import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { scoreTranscript } from "./scorer";

vi.mock("@/lib/llm/router", () => ({
  generateJsonWithFallback: vi.fn().mockResolvedValue(null),
  probeLlmProviders: vi.fn(),
}));

describe("scoreTranscript", () => {
  const transcript =
    "I led a project to reduce latency by forty percent using caching and profiling.";

  beforeEach(() => {
    vi.stubEnv("GOOGLE_AI_STUDIO_KEY", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns degraded heuristic when Gemini key missing", async () => {
    const r = await scoreTranscript({
      personaId: "amazon-l5-bar-raiser",
      transcript,
    });
    expect(r.degraded).toBe(true);
    expect(r.degradedReason).toBe("missing_key");
    expect(r.modelName).toBe("local-heuristic");
    expect(r.output.overallScore).toBeGreaterThan(0);
  });

  it("throws on empty transcript", async () => {
    await expect(
      scoreTranscript({
        personaId: "amazon-l5-bar-raiser",
        transcript: "   ",
      }),
    ).rejects.toThrow("EMPTY_TRANSCRIPT");
  });
});
