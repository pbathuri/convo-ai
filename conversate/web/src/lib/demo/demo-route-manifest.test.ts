import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";

const WEB_ROOT = join(__dirname, "..", "..", "..");

/** Demo-path pages that must exist for checklist items 1–8. */
const DEMO_ROUTE_FILES = [
  "src/app/page.tsx",
  "src/app/personas/page.tsx",
  "src/app/chat/page.tsx",
  "src/app/sessions/page.tsx",
  "src/app/progress/page.tsx",
  "src/app/admin/page.tsx",
  "src/app/api/health/route.ts",
  "src/app/api/did/agent/[agentId]/route.ts",
] as const;

describe("demo route manifest", () => {
  for (const rel of DEMO_ROUTE_FILES) {
    it(`exists: ${rel}`, () => {
      expect(existsSync(join(WEB_ROOT, rel))).toBe(true);
    });
  }
});
