import { describe, expect, it } from "vitest";
import { emotionFromReadiness } from "./schema";

describe("emotionFromReadiness", () => {
  it("returns five traits in range", () => {
    const t = emotionFromReadiness(80);
    expect(t.confidence).toBeGreaterThan(0);
    expect(t.confidence).toBeLessThanOrEqual(10);
    expect(t.insight).toBeTruthy();
  });

  it("gives higher scores for high readiness", () => {
    const low = emotionFromReadiness(40);
    const high = emotionFromReadiness(90);
    expect(high.confidence).toBeGreaterThan(low.confidence);
  });
});
