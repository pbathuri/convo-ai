import { AdminEnvPanel } from "@/components/admin/AdminEnvPanel";
import { ScaffoldBanner } from "@/components/admin/ScaffoldBanner";
import { getEnvHealth } from "@/lib/env-check";

export const dynamic = "force-dynamic";

export default async function AdminScoringPage() {
  const health = await getEnvHealth();

  return (
    <div className="space-y-4">
      {!health.gemini ? (
        <ScaffoldBanner
          feature="Live Gemini scoring"
          activatesWhen="GOOGLE_AI_STUDIO_KEY set on server"
        />
      ) : null}
      <h1 className="text-2xl font-semibold">Scoring quality</h1>
      <p className="text-sm text-muted-foreground">
        Model runs, confidence, invalid JSON count. When Gemini is unavailable,
        sessions use local heuristics with a visible degraded banner.
      </p>
      <AdminEnvPanel />
      <div className="rounded-lg border p-4 text-sm">
        <p>
          <strong>Primary model:</strong> gemini-2.0-flash (JSON mode)
        </p>
        <p className="mt-1 text-muted-foreground">
          <strong>Fallback:</strong> local-heuristic — quota, missing key, or
          API errors
        </p>
      </div>
    </div>
  );
}
