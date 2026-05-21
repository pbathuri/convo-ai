import { ScaffoldBanner } from "@/components/admin/ScaffoldBanner";

export default function AdminKbPage() {
  return (
    <div className="space-y-4">
      <ScaffoldBanner feature="KB admin UI" />
      <h1 className="text-2xl font-semibold">Knowledge base</h1>
      <p className="text-sm text-muted-foreground">
        Pending / approved / rejected queue. Scraped chunks never auto-approve.
      </p>
    </div>
  );
}
