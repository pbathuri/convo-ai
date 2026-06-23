import { describe, expect, it } from "vitest";
import {
  banditSelectDrill,
  buildBanditObservations,
  DRILL_ARMS,
} from "@/lib/personalization/bandit";

describe("RL drill bandit", () => {
  it("maps session history to observations", () => {
    const obs = buildBanditObservations([
      { weaknesses: ["Needs more quantified impact"], score: 72 },
      { weaknesses: ["Structure could be tighter"], score: 81 },
    ]);
    expect(obs.length).toBe(2);
    expect(obs[0]?.armKey).toBe("quantif");
    expect(obs[1]?.armKey).toBe("structure");
  });

  it("exploits best arm when epsilon=0", () => {
    const observations = [
      { armKey: "metric", reward: 90 },
      { armKey: "metric", reward: 88 },
      { armKey: "structure", reward: 60 },
    ];
    const pick = banditSelectDrill({
      weaknesses: ["vague answer"],
      observations,
      fallbackDrill: "fallback",
      rng: () => 0.99,
    });
    expect(pick.strategy).toBe("exploit");
    expect(pick.armKey).toBe("metric");
    expect(DRILL_ARMS.some((a) => a.drill === pick.drill)).toBe(true);
  });

  it("explores when epsilon triggers", () => {
    const pick = banditSelectDrill({
      weaknesses: [],
      observations: [{ armKey: "metric", reward: 80 }],
      fallbackDrill: "fallback",
      rng: () => 0.01,
    });
    expect(pick.strategy).toBe("explore");
  });
});
