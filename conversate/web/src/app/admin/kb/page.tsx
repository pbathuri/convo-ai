import { AdminEnvPanel } from "@/components/admin/AdminEnvPanel";
import { ScaffoldBanner } from "@/components/admin/ScaffoldBanner";
import { getAdminMetrics } from "@/lib/admin/metrics";
import { isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminKbPage() {
  const metrics = await getAdminMetrics();
  const db = isDatabaseConfigured();

  return (
    <div className="space-y-4">
      {!db ? (
        <ScaffoldBanner
          feature="KB approval queue"
          activatesWhen="DATABASE_URL configured"
        />
      ) : null}
      <h1 className="text-2xl font-semibold">Knowledge base</h1>
      <p className="text-sm text-muted-foreground">
        Pending / approved / rejected queue. Scraped chunks never auto-approve.
      </p>
      <AdminEnvPanel />
      {db ? (
        <dl className="grid gap-2 rounded-lg border p-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Sources</dt>
            <dd className="text-lg font-semibold">{metrics.kbSources ?? 0}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Pending approval</dt>
            <dd className="text-lg font-semibold">{metrics.kbPending ?? 0}</dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}
