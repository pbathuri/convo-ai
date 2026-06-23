import { z } from "zod";

export const skillNodeSchema = z.object({
  name: z.string(),
  status: z.enum(["completed", "unlocked", "locked", "milestone"]),
  xp: z.number().optional(),
  streak: z.number().optional(),
  milestone: z.boolean().optional(),
  xp_required: z.number().optional(),
  challenge: z.string().optional(),
});

export const domainSchema = z.object({
  icon: z.string(),
  color: z.string(),
  skills: z.array(skillNodeSchema),
});

export const skillTreeSchema = z.record(z.string(), domainSchema);

export type SkillNode = z.infer<typeof skillNodeSchema>;
export type SkillDomain = z.infer<typeof domainSchema>;
export type SkillTree = z.infer<typeof skillTreeSchema>;
