import posthog from "posthog-js";

let initialized = false;

export function isPostHogConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim());
}

export function initPostHog(): void {
  if (initialized || typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  if (!key) return;
  posthog.init(key, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() ??
      "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false,
  });
  initialized = true;
}

export function capturePostHogEvent(
  name: string,
  properties?: Record<string, string | number | boolean>,
): void {
  if (!initialized) initPostHog();
  if (!isPostHogConfigured()) return;
  posthog.capture(name, properties);
}

export { posthog };
