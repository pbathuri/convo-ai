import Link from "next/link";
import { GlassCard, ScoreBar } from "@/components/ui/interview-room";
import {
  PremiumCTA,
  SakuraHero,
  SakuraPageShell,
} from "@/components/ui/sakura";
import { getProgressSnapshot } from "@/lib/progress/service";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const progress = await getProgressSnapshot();

  return (
    <SakuraPageShell className="space-y-8 py-8">
      <SakuraHero
        eyebrow="Your trajectory"
        title="Progress"
        subtitle="Sessions completed, score trends, recurring gaps, and your next drill."
      />

      {progress.mode === "demo" ? (
        <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800">
          Demo data — complete and score sessions to see live progress.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <GlassCard>
          <p className="text-xs text-muted-foreground">Sessions completed</p>
          <p className="text-3xl font-semibold text-[var(--sakura-plum)]">
            {progress.sessionsCompleted}
          </p>
        </GlassCard>
        <GlassCard>
          {progress.averageScore != null ? (
            <ScoreBar
              label="Average readiness"
              score={Math.round(progress.averageScore)}
            />
          ) : (
            <>
              <p className="text-xs text-muted-foreground">Average score</p>
              <p className="text-sm text-muted-foreground">
                Score at least one session
              </p>
            </>
          )}
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
