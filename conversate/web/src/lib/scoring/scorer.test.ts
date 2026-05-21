import { afterEach, describe, expect, it } from "vitest";
import { scoreTranscript } from "./scorer";

describe("scoreTranscript", () => {
  const prevKey = process.env.GOOGLE_AI_STUDIO_KEY;

  afterEach(() => {
    if (prevKey === undefined) delete process.env.GOOGLE_AI_STUDIO_KEY;
    else process.env.GOOGLE_AI_STUDIO_KEY = prevKey;
  });

  it("returns degraded heuristic when Gemini key is missing", async () => {
    delete process.env.GOOGLE_AI_STUDIO_KEY;
    const result = await scoreTranscript({
      personaId: "amazon-l5-bar-raiser",
      transcript:
        "user: Situation: outage. Action: rollback. Result: 40% latency improvement for 2M users.",
    });
    expect(result.degraded).toBe(true);
    expect(result.degradedReason).toBe("missing_key");
    expect(result.output.strengths.length).toBeGreaterThan(0);
    expect(result.output.weaknesses.length).toBeGreaterThan(0);
    expect(result.output.actionItems.length).toBeGreaterThan(0);
    expect(result.output.evidence.length).toBeGreaterThan(0);
    expect(result.output.nextDrill).toBeTruthy();
  });

  it("throws EMPTY_TRANSCRIPT for blank input", async () => {
    await expect(
      scoreTranscript({
        personaId: "google-l4-swe",
        transcript: "   \n  ",
      }),
    ).rejects.toThrow("EMPTY_TRANSCRIPT");
  });
});
