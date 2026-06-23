import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();

export function isSentryConfigured(): boolean {
  return Boolean(SENTRY_DSN);
}

export function captureException(
  error: unknown,
  context?: Record<string, string>,
): void {
  if (!isSentryConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.error("[sentry]", error, context);
    }
    return;
  }
  Sentry.captureException(error, { extra: context });
}
