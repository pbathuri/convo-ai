/** XP rules ported from app/services/gamification_engine.py */

export function calculateXp(score: number): number {
  if (score >= 90) return 50;
  if (score >= 80) return 40;
  if (score >= 70) return 30;
  if (score >= 60) return 20;
  return 10;
}

export function totalXpFromScores(scores: number[]): number {
  return scores.reduce((sum, s) => sum + calculateXp(s), 0);
}

export function estimateStreak(sessionDates: Date[]): number {
  if (sessionDates.length === 0) return 0;
  const days = new Set(
    sessionDates.map((d) => d.toISOString().slice(0, 10)),
  );
  let streak = 1;
  const sorted = Array.from(days).sort().reverse();
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86_400_000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}
