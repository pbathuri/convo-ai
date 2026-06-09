/**
 * Demo-readiness checklist — static smoke for CI (browser steps remain manual).
 * Run: npx tsx scripts/demo-checklist-smoke.ts
 */
const CHECKLIST = [
  "/ — landing loads, persona cards visible",
  "/personas — five personas, links to chat",
  "/chat?persona=amazon-l5-bar-raiser — session creates within 8s",
  "D-ID connects OR transcript-only fallback works",
  "/sessions — completed session listed",
  "/sessions/[id] — transcript visible, generate score",
  "Score without Gemini — degraded banner, useful coaching report",
  "/progress — real data or labeled demo banner",
  "/admin — metrics, no secret values displayed",
] as const;

function main(): void {
  for (const item of CHECKLIST) {
    if (!item.trim()) throw new Error("empty checklist item");
  }
  console.info(`demo-checklist-smoke: ${CHECKLIST.length} items documented`);
  console.info("Manual Chrome verification still required per docs/implementation/demo-readiness-checklist.md");
}

main();
