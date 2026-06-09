/**
 * Demo-readiness checklist — CI smoke (browser steps remain manual).
 * Validates checklist items + critical route files on disk.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

const WEB_ROOT = join(__dirname, "..");

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
  "/api/health — service flags, no secrets",
] as const;

const REQUIRED_FILES = [
  "src/app/page.tsx",
  "src/app/api/health/route.ts",
  "src/components/did/DidOfficialEmbed.tsx",
  "src/components/feedback/FeedbackReport.tsx",
  "src/lib/scoring/scorer.ts",
] as const;

function main(): void {
  for (const item of CHECKLIST) {
    if (!item.trim()) throw new Error("empty checklist item");
  }
  for (const rel of REQUIRED_FILES) {
    const p = join(WEB_ROOT, rel);
    if (!existsSync(p)) {
      throw new Error(`demo smoke: missing required file ${rel}`);
    }
  }
  console.info(`demo-checklist-smoke: ${CHECKLIST.length} items documented`);
  console.info(`demo-checklist-smoke: ${REQUIRED_FILES.length} critical files present`);
  console.info(
    "Manual Chrome verification still required per docs/implementation/demo-readiness-checklist.md",
  );
}

main();
