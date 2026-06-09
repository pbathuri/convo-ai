import { getEnvHealth } from "@/lib/env-check";
import { getAdminMetrics } from "@/lib/admin/metrics";

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${ok ? "bg-emerald-500" : "bg-amber-500"}`}
      aria-hidden
    />
  );
}

export async function AdminEnvPanel() {
  const [health, metrics] = await Promise.all([
    getEnvHealth(),
    getAdminMetrics(),
  ]);

  const rows = [
    {
      label: "Database",
      ok: health.databaseReachable,
      detail: health.database
        ? health.databaseReachable
          ? "reachable"
          : "configured but unreachable"
        : "not configured",
    },
    {
      label: "D-ID client key",
      ok: health.didClientKey,
      detail: health.liveEmbeddedAgentReady
        ? "embed ready (Amazon L5)"
        : "configure ck_ + agent id",
    },
    {
      label: "Gemini scoring",
      ok: health.gemini,
      detail: health.gemini
        ? "live API path available"
        : "heuristic fallback only",
    },
    {
      label: "Upstash",
      ok: health.upstash,
      detail: health.upstash ? "configured" : "optional — in-memory fallback",
    },
    {
      label: "Local D-ID proxy",
      ok: process.env.DID_USE_LOCAL_PROXY === "1",
      detail:
        process.env.DID_USE_LOCAL_PROXY === "1"
          ? "DID_USE_LOCAL_PROXY=1"
          : "set for server-side CORS bypass",
    },
  ];

  return (
    <div className="rounded-xl border border-[var(--sakura-glass-border)] bg-[var(--sakura-glass-bg)] p-4 shadow-[var(--sakura-shadow-soft)]">
      <h2 className="text-sm font-medium text-[var(--sakura-plum)]">
        Service health
      </h2>
      <ul className="mt-3 space-y-2 text-sm">
        {rows.map((r) => (
          <li key={r.label} className="flex items-start gap-2">
            <StatusDot ok={r.ok} />
            <span>
              <strong>{r.label}:</strong> {r.detail}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        Sessions: {metrics.sessionCount ?? "—"} · KB sources:{" "}
        {metrics.kbSources ?? "—"} · pending approval:{" "}
        {metrics.kbPending ?? "—"} · last score latency:{" "}
        {metrics.lastScoringLatencyMs != null
          ? `${metrics.lastScoringLatencyMs} ms`
          : "—"}
      </p>
    </div>
  );
}
