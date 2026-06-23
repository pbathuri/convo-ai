import type { SkillDomain, SkillTree } from "@/lib/skill-tree/schema";
import { GlassCard } from "@/components/ui/interview-room";

function statusStyles(status: string): string {
  switch (status) {
    case "completed":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-800";
    case "unlocked":
      return "border-[var(--sakura-petal-400)] bg-[var(--sakura-petal-400)]/10";
    case "milestone":
      return "border-amber-500/40 bg-amber-500/10 text-amber-900";
    default:
      return "border-muted opacity-60";
  }
}

function DomainColumn({
  name,
  domain,
}: {
  name: string;
  domain: SkillDomain;
}) {
  return (
    <GlassCard className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden>
          {domain.icon}
        </span>
        <h3
          className="text-sm font-semibold"
          style={{ color: domain.color }}
        >
          {name}
        </h3>
      </div>
      <ul className="space-y-2">
        {domain.skills.map((skill) => (
          <li
            key={skill.name}
            className={`rounded-md border px-3 py-2 text-xs ${statusStyles(skill.status)}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{skill.name}</span>
              {skill.milestone ? (
                <span className="text-[10px] uppercase tracking-wide">
                  Milestone
                </span>
              ) : skill.xp != null && skill.status !== "locked" ? (
                <span className="text-[10px] text-muted-foreground">
                  {skill.xp} XP
                </span>
              ) : null}
            </div>
            {skill.challenge ? (
              <p className="mt-1 text-[10px] text-muted-foreground">
                {skill.challenge}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

export function SkillTreeMap({ tree }: { tree: SkillTree }) {
  const entries = Object.entries(tree);
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {entries.map(([name, domain]) => (
        <DomainColumn key={name} name={name} domain={domain} />
      ))}
    </div>
  );
}
