type Props = { label: string; score: number; max?: number };

export function ScoreBar({ label, score, max = 100 }: Props) {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  const color =
    pct >= 75 ? "var(--ir-score-high)" : pct >= 50 ? "var(--ir-score-mid)" : "var(--ir-score-low)";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span>{Math.round(score)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
