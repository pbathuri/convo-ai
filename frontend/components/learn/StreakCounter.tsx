"use client";

export function StreakCounter({ streak }: { streak: number }) {
  return (
    <div className="flex items-center gap-2 text-sm font-bold text-brand-orange">
      <span aria-hidden>{"\u{1F525}"}</span>
      <span>{streak} day streak</span>
    </div>
  );
}
