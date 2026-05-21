export default function AdminCostPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Cost</h1>
      <p className="text-sm text-muted-foreground">
        D-ID minutes, Gemini scoring, embedding jobs. Budget:
        DID_DAILY_MINUTE_BUDGET.
      </p>
    </div>
  );
}
