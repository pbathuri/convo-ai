"use client";

import { useEffect, useState } from "react";
import { DOMAINS } from "@/lib/constants";
import { SkillMap, type SkillNode } from "@/components/learn/SkillMap";
import { useAppStore } from "@/lib/app-store";

export default function LearnDashboardPage() {
  const { domain, xp, streak, hearts, daily_goal, daily_progress } = useAppStore();
  const [skills, setSkills] = useState<SkillNode[]>([]);

  useEffect(() => {
    fetch("/api/skills")
      .then((r) => r.json())
      .then((d: { skills: { id: string; name: string; status: string; milestone?: boolean }[] }) => {
        setSkills(
          d.skills.map((s) => ({
            id: s.id,
            name: s.name,
            status: s.status as SkillNode["status"],
            milestone: s.milestone,
          }))
        );
      })
      .catch(() =>
        setSkills([
          { id: "intro", name: "Introduction", status: "completed" },
          { id: "basics", name: "Basic Concepts", status: "active" },
          { id: "intermediate", name: "Intermediate", status: "locked" },
          { id: "advanced", name: "Advanced", status: "locked" },
          { id: "mastery", name: "Mastery", status: "locked", milestone: true },
        ])
      );
  }, []);

  const domainLabel = DOMAINS.find((x) => x.key === domain)?.label ?? domain;

  return (
    <div className="px-4 pb-12 pt-16 md:px-10 md:pt-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border-light pb-4">
        <select
          className="rounded-input border border-border-light bg-white px-3 py-2 font-semibold"
          value={domain}
          onChange={(e) =>
            useAppStore.getState().setProfile({ domain: e.target.value })
          }
        >
          {DOMAINS.map((d) => (
            <option key={d.key} value={d.key}>
              {d.label}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
          <span className="text-brand-gold">XP {xp}</span>
          <span className="text-brand-orange">
            {"\u{1F525}"} {streak}
          </span>
          <span className="text-brand-red">{"\u2764\uFE0F"} {hearts}</span>
          <span className="text-text-secondary">
            Daily {daily_progress}/{daily_goal}
          </span>
        </div>
      </header>
      <h1 className="mb-2 font-heading text-2xl font-bold text-text-primary">
        Skill map
      </h1>
      <p className="mb-6 text-text-secondary">{domainLabel}</p>
      <SkillMap skills={skills} />
    </div>
  );
}
