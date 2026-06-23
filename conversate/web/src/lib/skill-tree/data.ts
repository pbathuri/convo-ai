import progression from "@/data/learning_progression.json";
import { type SkillTree, skillTreeSchema } from "./schema";

export function getSkillTree(): SkillTree {
  return skillTreeSchema.parse(progression);
}

export function countUnlockedDomains(tree: SkillTree): number {
  return Object.values(tree).filter((d) =>
    d.skills.some((s) => s.status === "completed" || s.status === "unlocked"),
  ).length;
}
