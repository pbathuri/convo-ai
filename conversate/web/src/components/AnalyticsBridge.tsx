"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { initAnalytics, trackEvent } from "@/lib/analytics/init";
import {
  capturePostHogEvent,
  initPostHog,
} from "@/lib/observability/posthog-client";
import type { AnalyticsEvent } from "@/lib/analytics/types";

async function sendLocal(event: AnalyticsEvent) {
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

export function AnalyticsBridge() {
  const pathname = usePathname();

  useEffect(() => {
    initPostHog();
    initAnalytics();
  }, []);

  useEffect(() => {
    if (!pathname) return;
    const event: AnalyticsEvent = {
      name: "page_view",
      payload: { path: pathname },
      ts: new Date().toISOString(),
    };
    void sendLocal(event);
    capturePostHogEvent("page_view", { path: pathname });
    void trackEvent(event);
  }, [pathname]);

  return null;
}
