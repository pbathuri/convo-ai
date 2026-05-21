import { ScaffoldBanner } from "@/components/admin/ScaffoldBanner";

export default function AdminScoringPage() {
  return (
    <div className="space-y-4">
      <ScaffoldBanner feature="Scoring quality dashboard" />
      <h1 className="text-2xl font-semibold">Scoring quality</h1>
      <p className="text-sm text-muted-foreground">
        Model runs, confidence, invalid JSON count.
      </p>
    </div>
  );
}
