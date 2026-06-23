import { describe, expect, it } from "vitest";
import { calculateXp, estimateStreak, totalXpFromScores } from "./xp";

describe("gamification xp", () => {
  it("awards tiered xp", () => {
    expect(calculateXp(95)).toBe(50);
    expect(calculateXp(55)).toBe(10);
  });

  it("sums session scores", () => {
    expect(totalXpFromScores([95, 55])).toBe(60);
  });

  it("estimates consecutive day streak", () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    expect(estimateStreak([today, yesterday])).toBe(2);
  });
});
