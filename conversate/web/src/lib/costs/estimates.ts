const DID_COST_PER_MINUTE_USD = 0.12;
const GEMINI_COST_PER_SCORE_USD = 0.002;

export function estimateSessionCostUsd(
  minutes: number,
  scored: boolean,
): number {
  let total = minutes * DID_COST_PER_MINUTE_USD;
  if (scored) total += GEMINI_COST_PER_SCORE_USD;
  return Math.round(total * 1000) / 1000;
}
