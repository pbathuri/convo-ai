import { describe, expect, it } from "vitest";
import {
  averageReadiness,
  buildScoreTrend,
  minutesBetween,
} from "./metrics";

describe("insights metrics", () => {
  it("minutesBetween returns rounded minutes", () => {
    const start = new Date("2026-01-01T10:00:00Z");
    const end = new Date("2026-01-01T10:25:30Z");
    expect(minutesBetween(start, end)).toBe(26);
    expect(minutesBetween(null, end)).toBe(0);
  });

  it("averageReadiness handles empty and values", () => {
    expect(averageReadiness([])).toBeNull();
    expect(averageReadiness([60, 80])).toBe(70);
  });

  it("buildScoreTrend orders oldest to newest labels", () => {
    const trend = buildScoreTrend([
      {
        id: "c",
        createdAt: new Date(),
        scores: [{ overallScore: 70 }],
      },
      {
        id: "b",
        createdAt: new Date(),
        scores: [{ overallScore: 65 }],
      },
      {
        id: "a",
        createdAt: new Date(),
        scores: [{ overallScore: 60 }],
      },
    ]);
    expect(trend).toHaveLength(3);
    expect(trend[0].score).toBe(60);
    expect(trend[2].score).toBe(70);
  });
});
