export default function AnalyticsPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Analytics seam</h1>
      <p className="text-sm text-muted-foreground">
        The <code className="text-xs">AnalyticsBridge</code> client component is
        mounted from the root layout and emits lightweight page-view events to{" "}
        <code className="text-xs">/api/analytics/event</code> (optionally
        buffered in Upstash Redis).
      </p>
      <p className="text-xs text-muted-foreground">
        The bridge is already active globally from{" "}
        <code className="text-xs">src/app/layout.tsx</code> — navigate between
        routes and watch devtools for POST{" "}
        <code className="text-xs">/api/analytics/event</code>.
      </p>
    </div>
  );
}
