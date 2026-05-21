import type { AnalyticsEvent, DidAnalyticsEventName } from "./types";

async function sendEvent(event: AnalyticsEvent): Promise<void> {
  try {
    await fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
  } catch {
    /* non-fatal */
  }
}

export function trackDidEvent(
  name: DidAnalyticsEventName,
  payload?: AnalyticsEvent["payload"],
): void {
  void sendEvent({
    name,
    payload,
    ts: new Date().toISOString(),
  });
}

export function trackPageEvent(
  name: AnalyticsEvent["name"],
  payload?: AnalyticsEvent["payload"],
): void {
  void sendEvent({ name, payload, ts: new Date().toISOString() });
}
