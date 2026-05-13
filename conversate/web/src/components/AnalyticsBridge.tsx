"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { initAnalytics } from "@/lib/analytics/init";
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
    initAnalytics();
  }, []);

  useEffect(() => {
    if (!pathname) return;
    void sendLocal({
      name: "page_view",
      payload: { path: pathname },
      ts: new Date().toISOString(),
    });
  }, [pathname]);

  return null;
}
