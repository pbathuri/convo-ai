"use client";

export function DailyGoalRing({
  progress,
  goal,
}: {
  progress: number;
  goal: number;
}) {
  const pct = goal > 0 ? Math.min(100, (progress / goal) * 100) : 0;
  const r = 22;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  return (
    <div className="flex items-center gap-3">
      <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90 flex-shrink-0">
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="5"
        />
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke="#58cc02"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          className="transition-all duration-500"
        />
      </svg>
      <div className="text-xs leading-tight text-text-dark-secondary">
        <div className="font-bold text-text-dark-primary">Daily goal</div>
        <div>
          {progress}/{goal} min
        </div>
      </div>
    </div>
  );
}
