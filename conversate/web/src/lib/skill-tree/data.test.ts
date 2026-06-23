import { describe, expect, it } from "vitest";
import { countUnlockedDomains, getSkillTree } from "./data";

describe("skill tree", () => {
  it("loads progression data", () => {
    const tree = getSkillTree();
    expect(Object.keys(tree).length).toBeGreaterThanOrEqual(2);
  });

  it("counts unlocked domains", () => {
    const tree = getSkillTree();
    expect(countUnlockedDomains(tree)).toBeGreaterThan(0);
  });
});
