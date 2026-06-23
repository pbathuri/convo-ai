/**
 * Visual demo audit — cognitive-graph computer-vision workflow.
 * Captures golden-path screenshots for human/vision review.
 *
 * Usage: npm run demo:visual-audit
 * Requires: npm run build && npm run start:standalone (or PLAYWRIGHT_BASE_URL)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const OUT = join(__dirname, "..", "..", "..", "docs", "demos", "screenshots");

const ROUTES = [
  { path: "/", name: "home" },
  { path: "/personas", name: "personas" },
  { path: "/domains", name: "domains" },
  { path: "/progress", name: "progress" },
  { path: "/pricing", name: "pricing" },
  { path: "/chat?persona=amazon-l5-bar-raiser", name: "chat-amazon" },
] as const;

async function main(): Promise<void> {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const manifest: { route: string; file: string; capturedAt: string }[] = [];

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route.path}`, { waitUntil: "networkidle" });
    const file = `${route.name}.png`;
    await page.screenshot({ path: join(OUT, file), fullPage: true });
    manifest.push({
      route: route.path,
      file,
      capturedAt: new Date().toISOString(),
    });
    console.info(`captured ${route.path} → ${file}`);
  }

  writeFileSync(
    join(OUT, "manifest.json"),
    JSON.stringify({ baseUrl: BASE, shots: manifest }, null, 2),
  );
  await browser.close();
  console.info(`visual-demo-audit: ${manifest.length} screenshots in ${OUT}`);
}

void main().catch((e) => {
  console.error(e);
  process.exit(1);
});
