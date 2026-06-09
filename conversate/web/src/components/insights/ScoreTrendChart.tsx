import type { ScoreTrendPoint } from "@/lib/insights/metrics";

type Props = {
  points: ScoreTrendPoint[];
  emptyLabel?: string;
};

export function ScoreTrendChart({
  points,
  emptyLabel = "Complete and score sessions to see your trend.",
}: Props) {
  if (points.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        {emptyLabel}
      </p>
    );
  }

  const max = Math.max(...points.map((p) => p.score), 100);

  return (
    <div className="space-y-3">
      <div className="flex h-40 items-end gap-2 border-b border-[var(--sakura-glass-border)] pb-2">
        {points.map((p) => {
          const h = Math.max(8, Math.round((p.score / max) * 100));
          return (
            <div
              key={p.sessionId}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <span className="text-[10px] font-medium text-[var(--sakura-plum)]">
                {p.score}%
              </span>
              <div
                className="w-full max-w-[48px] rounded-t-md bg-[var(--sakura-petal-400)] transition-all"
                style={{ height: `${h}%` }}
                title={`${p.label}: ${p.score}%`}
              />
              <span className="text-[9px] text-muted-foreground truncate w-full text-center">
                {p.label}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Interview readiness by session (most recent on the right)
      </p>
    </div>
  );
}
