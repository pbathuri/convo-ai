"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/learn/Sidebar";
import { useAppStore } from "@/lib/app-store";

/** CURSOR_PROMPT: hydrate once per tab session (not on every navigation within the tab). */
const USER_API_TAB_SESSION_KEY = "convo-user-api-tab-hydrated";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(USER_API_TAB_SESSION_KEY)) return;
    sessionStorage.setItem(USER_API_TAB_SESSION_KEY, "1");
    let cancelled = false;
    fetch("/api/user")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        useAppStore.getState().hydrateFromUserApi(d);
      })
      .catch(() => { });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <main className="md:pl-[280px]">{children}</main>
    </div>
  );
}
