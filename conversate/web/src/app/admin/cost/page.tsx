import { AdminEnvPanel } from "@/components/admin/AdminEnvPanel";
import { ScaffoldBanner } from "@/components/admin/ScaffoldBanner";

export const dynamic = "force-dynamic";

export default function AdminCostPage() {
  const budget = process.env.DID_DAILY_MINUTE_BUDGET ?? "600";

  return (
    <div className="space-y-4">
      <ScaffoldBanner
        feature="Billing export dashboard"
        activatesWhen="cost telemetry wired to provider APIs"
      />
      <h1 className="text-2xl font-semibold">Cost</h1>
      <p className="text-sm text-muted-foreground">
        D-ID minutes, Gemini scoring, embedding jobs.
      </p>
      <AdminEnvPanel />
      <div className="rounded-lg border p-4 text-sm">
        <p>
          <strong>D-ID daily minute budget:</strong> {budget} (env{" "}
          <code>DID_DAILY_MINUTE_BUDGET</code>)
        </p>
        <p className="mt-2 text-muted-foreground">
          Gemini usage is per score request — monitor via admin scoring latency
          and provider console when keyed.
        </p>
      </div>
    </div>
  );
}
