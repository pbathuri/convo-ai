import { describe, expect, it } from "vitest";
import { calculateXp } from "@/lib/gamification/xp";

describe("awardXpForScore rules", () => {
  it("maps score bands to XP like backend gamification", () => {
    expect(calculateXp(95)).toBe(50);
    expect(calculateXp(85)).toBe(40);
    expect(calculateXp(55)).toBe(10);
  });
});
