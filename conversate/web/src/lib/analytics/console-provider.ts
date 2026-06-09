import type { AnalyticsEvent } from "./types";

/** Debug provider — enable with ANALYTICS_DEBUG=1 */
export function trackConsoleEvent(event: AnalyticsEvent): void {
  if (process.env.ANALYTICS_DEBUG !== "1") return;
  console.info("[analytics]", event.name, event.payload ?? {});
}
