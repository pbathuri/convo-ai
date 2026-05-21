import { describe, expect, it } from "vitest";
import {
  scoreTranscriptHeuristic,
  transcriptHasScorableContent,
} from "./local-heuristics";

describe("transcriptHasScorableContent", () => {
  it("rejects empty transcript", () => {
    expect(transcriptHasScorableContent("")).toBe(false);
  });

  it("accepts user lines", () => {
    expect(
      transcriptHasScorableContent("user: I improved latency by 40%"),
    ).toBe(true);
  });
});

describe("scoreTranscriptHeuristic", () => {
  it("returns variable scores for metric-rich transcript", () => {
    const out = scoreTranscriptHeuristic({
      personaId: "amazon-l5-bar-raiser",
      transcript:
        "user: Situation: outage. Action: I led fix. Result: 40% latency drop for 2M users.",
      degradedReason: "test",
    });
    expect(out.overallScore).toBeGreaterThan(60);
    expect(out.strengths.length).toBeGreaterThan(0);
    expect(out.evidence[0]?.quote).toContain("40%");
  });
});
