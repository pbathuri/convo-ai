import Link from "next/link";
import { EmotionRadar } from "@/components/insights/EmotionRadar";
import { ScoreTrendChart } from "@/components/insights/ScoreTrendChart";
import { SkillTreeMap } from "@/components/insights/SkillTreeMap";
import { GlassCard, ScoreBar } from "@/components/ui/interview-room";
import {
  PremiumCTA,
  SakuraHero,
  SakuraPageShell,
} from "@/components/ui/sakura";
import { getAuthUser } from "@/lib/auth/supabase";
import { syncUserProfile } from "@/lib/auth/sync-profile";
import { isDatabaseConfigured } from "@/lib/db";
import { emotionFromReadiness } from "@/lib/emotion/schema";
import { getInsightsSnapshot } from "@/lib/insights/metrics";
import { getProgressSnapshot } from "@/lib/progress/service";
import { getSkillTree } from "@/lib/skill-tree/data";
import type { SkillTree } from "@/lib/skill-tree/schema";

export const dynamic = "force-dynamic";

async function loadSkillTree(): Promise<SkillTree> {
  try {
    const base =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
      "http://localhost:3000";
    const res = await fetch(`${base}/api/skill-tree`, { cache: "no-store" });
    if (!res.ok) return getSkillTree();
    const data = (await res.json()) as { tree?: SkillTree };
    return data.tree ?? getSkillTree();
  } catch {
    return getSkillTree();
  }
}

export default async function ProgressPage() {
  const authUser = await getAuthUser();
  let profileId: string | undefined;
  if (authUser && isDatabaseConfigured()) {
    profileId = await syncUserProfile(authUser);
  }

  const [progress, insights, skillTree] = await Promise.all([
    getProgressSnapshot(profileId),
    getInsightsSnapshot(profileId),
    Promise.resolve(loadSkillTree()),
  ]);

  const emotion = emotionFromReadiness(
    insights.averageReadiness ?? progress.averageScore ?? 65,
  );

  return (
    <SakuraPageShell className="space-y-8 py-8">
      <SakuraHero
        eyebrow="Insights"
        title="Interview readiness"
        subtitle="Scores, practice time, and trends from your live sessions — not static zeros."
      />

      {progress.mode === "demo" || insights.mode === "demo" ? (
        <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800">
          Demo data — complete and score sessions to see live insights.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <GlassCard>
          <p className="text-xs text-muted-foreground">Sessions completed</p>
          <p className="text-3xl font-semibold text-[var(--sakura-plum)]">
            {insights.sessionsCompleted}
          </p>
        </GlassCard>
        <GlassCard>
          {insights.averageReadiness != null ? (
            <ScoreBar
              label="Avg interview readiness"
              score={Math.round(insights.averageReadiness)}
            />
          ) : (
            <>
              <p className="text-xs text-muted-foreground">Avg readiness</p>
              <p className="text-sm text-muted-foreground">Score a session first</p>
            </>
          )}
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Minutes practiced</p>
          <p className="text-3xl font-semibold text-[var(--sakura-plum)]">
            {insights.minutesPracticed}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Questions answered</p>
          <p className="text-3xl font-semibold text-[var(--sakura-plum)]">
            {insights.questionsAnswered}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Total XP earned</p>
          <p className="text-3xl font-semibold text-[var(--sakura-plum)]">
            {progress.totalXp}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Practice streak</p>
          <p className="text-3xl font-semibold text-[var(--sakura-plum)]">
            {progress.practiceStreak} day{progress.practiceStreak === 1 ? "" : "s"}
          </p>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="text-sm font-medium text-[var(--sakura-plum)]">
          Readiness trend
        </h3>
        <div className="mt-4">
          <ScoreTrendChart points={insights.scoreTrend} />
        </div>
        {insights.latestScoredSessionId ? (
          <Link
            href={`/sessions/${insights.latestScoredSessionId}`}
            className="mt-4 inline-block text-sm text-[var(--sakura-petal-500)] hover:underline"
          >
            View latest coaching report →
          </Link>
        ) : null}
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h3 className="text-sm font-medium text-[var(--sakura-plum)]">
            Communication radar
          </h3>
          <EmotionRadar traits={emotion} className="mt-4" />
        </GlassCard>
        <GlassCard>
          <h3 className="text-sm font-medium text-[var(--sakura-plum)]">
            Skill curriculum
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Duolingo-style paths — interview + legacy coaching domains.
          </p>
          <div className="mt-4 max-h-96 overflow-y-auto">
            <SkillTreeMap tree={skillTree} />
          </div>
        </GlassCard>
      </div>

      {progress.weaknessClusters.length > 0 ? (
        <GlassCard>
          <h3 className="text-sm font-medium">Recurring gaps</h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {progress.weaknessClusters.map((w) => (
              <li key={w.label}>
                {w.label} <span className="text-xs">×{w.count}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      ) : null}

      <GlassCard>
        <h3 className="text-sm font-medium">Recommended next drill</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {progress.nextDrill.drill}
        </p>
        {progress.nextDrill.basedOn ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Based on: {progress.nextDrill.basedOn}
          </p>
        ) : null}
        <div className="mt-4">
          <PremiumCTA href={`/chat?persona=${progress.nextDrill.personaId}`}>
            Practice drill
          </PremiumCTA>
        </div>
      </GlassCard>

      <Link
        href="/sessions"
        className="text-sm text-[var(--sakura-petal-500)] hover:underline"
      >
        View all sessions →
      </Link>
    </SakuraPageShell>
  );
}
