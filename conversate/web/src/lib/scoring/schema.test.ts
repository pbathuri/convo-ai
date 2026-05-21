import { describe, expect, it } from "vitest";
import { scoreOutputSchema } from "./schema";

describe("scoreOutputSchema", () => {
  it("parses valid score output", () => {
    const parsed = scoreOutputSchema.parse({
      overallScore: 80,
      dimensions: [{ name: "Ownership", score: 75, rationale: "ok" }],
      strengths: ["Clear"],
      weaknesses: ["Metrics"],
      actionItems: ["Add metrics"],
      evidence: [{ quote: "user: hello", dimension: "Ownership" }],
      confidence: 0.8,
    });
    expect(parsed.overallScore).toBe(80);
  });

  it("rejects invalid overall score", () => {
    expect(() =>
      scoreOutputSchema.parse({
        overallScore: 200,
        dimensions: [],
        strengths: [],
        weaknesses: [],
        actionItems: ["x"],
        evidence: [],
      }),
    ).toThrow();
  });
});
