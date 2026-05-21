import { ScaffoldBanner } from "@/components/admin/ScaffoldBanner";

export default function AdminScraperRunsPage() {
  return (
    <div className="space-y-4">
      <ScaffoldBanner feature="Scraper runs UI" />
      <h1 className="text-2xl font-semibold">Scraper runs</h1>
      <p className="text-sm text-muted-foreground">
        Trigger <code>pipelines/scraper/run.py</code> — output lands in approval
        queue, not live KB.
      </p>
    </div>
  );
}
