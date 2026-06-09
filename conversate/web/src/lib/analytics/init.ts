import type { AnalyticsEvent } from "./types";
import { trackConsoleEvent } from "./console-provider";

/**
 * Stub seam: wire to Segment/GA/PostHog/etc. without coupling call sites.
 */
export function initAnalytics(): void {
  if (process.env.NODE_ENV === "development") {
    console.info("[analytics] init stub (no-op)");
  }
}

export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  trackConsoleEvent(event);
}
