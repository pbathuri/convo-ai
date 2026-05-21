export default function AdminOverviewPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="text-sm text-muted-foreground">
        ToolJet-style operator console. Mutation APIs require <code>ADMIN_EMAILS</code> and{" "}
        <code>x-admin-email</code> header in dev.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard title="Personas" value="5" />
        <MetricCard title="KB chunks" value="—" hint="Seed or import" />
        <MetricCard title="Sessions" value="—" hint="After alpha" />
      </div>
    </div>
  );
}

function MetricCard({ title, value, hint }: { title: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
