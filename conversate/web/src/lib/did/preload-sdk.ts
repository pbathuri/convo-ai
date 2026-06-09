let preloadPromise: Promise<typeof import("@d-id/client-sdk")> | null = null;

/** Warm the D-ID SDK bundle once per tab (cuts connect latency). */
export function preloadDidSdk(): Promise<typeof import("@d-id/client-sdk")> {
  if (!preloadPromise) {
    preloadPromise = import("@d-id/client-sdk");
  }
  return preloadPromise;
}
