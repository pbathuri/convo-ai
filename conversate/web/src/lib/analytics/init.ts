import type { AnalyticsEvent } from "./types";

/**
 * Stub seam: wire to Segment/GA/PostHog/etc. without coupling call sites.
 */
export function initAnalytics(): void {
  if (process.env.NODE_ENV === "development") {
    console.info("[analytics] init stub (no-op)");
  }
}

export async function trackEvent(_event: AnalyticsEvent): Promise<void> {
  /* reserved for server-side fan-out or client batching */
}
