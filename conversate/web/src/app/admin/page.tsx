import Link from "next/link";
import { SakuraPageShell } from "@/components/ui/sakura";
import { getAdminMetrics } from "@/lib/admin/metrics";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const m = await getAdminMetrics();

  return (
    <SakuraPageShell className="space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--sakura-plum)]">
          Admin
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Operator console. Mutation APIs require <code>ADMIN_EMAILS</code> and{" "}
          <code>x-admin-email</code> header in dev.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Personas"
          value={String(m.personaCount)}
          hint="Configured in code"
        />
        <MetricCard
          title="KB sources"
          value={m.kbSources != null ? String(m.kbSources) : "—"}
          hint={
            m.kbPending != null
              ? `${m.kbPending} pending approval`
              : "DB unavailable"
          }
        />
        <MetricCard
          title="Sessions"
          value={m.sessionCount != null ? String(m.sessionCount) : "—"}
          hint="All statuses"
        />
        <MetricCard
          title="Last score latency"
          value={
            m.lastScoringLatencyMs != null
              ? `${m.lastScoringLatencyMs} ms`
              : "—"
          }
          hint="Post-session Gemini"
        />
      </div>
      <ul className="flex flex-wrap gap-3 text-sm">
        <Link
          href="/admin/personas"
          className="text-[var(--sakura-petal-500)] hover:underline"
        >
          Personas
        </Link>
        <Link
          href="/admin/kb"
          className="text-[var(--sakura-petal-500)] hover:underline"
        >
          KB governance
        </Link>
        <Link
          href="/admin/scoring"
          className="text-[var(--sakura-petal-500)] hover:underline"
        >
          Scoring
        </Link>
        <Link
          href="/admin/cost"
          className="text-[var(--sakura-petal-500)] hover:underline"
        >
          Cost
        </Link>
      </ul>
    </SakuraPageShell>
  );
}

function MetricCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--sakura-glass-border)] bg-[var(--sakura-glass-bg)] p-4 shadow-[var(--sakura-shadow-soft)]">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-2xl font-semibold text-[var(--sakura-plum)]">
        {value}
      </p>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
