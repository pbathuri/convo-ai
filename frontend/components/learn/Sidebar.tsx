"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, MessageCircle, BarChart2, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/lib/app-store";
import { cn } from "@/lib/cn";
import { XPBar } from "./XPBar";
import { StreakCounter } from "./StreakCounter";
import { DailyGoalRing } from "./DailyGoalRing";

const NAV = [
  { href: "/learn", label: "Home", icon: Home },
  { href: "/learn", label: "Skill Map", icon: Map },
  { href: "/learn/chat", label: "Practice", icon: MessageCircle },
  { href: "/learn", label: "Stats", icon: BarChart2 },
  { href: "/learn", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { xp, streak, daily_goal, daily_progress } = useAppStore();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-50 rounded-lg bg-bg-dark-card p-2 text-white md:hidden"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          aria-label="Close menu backdrop"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed bottom-0 left-0 top-0 z-40 flex w-[280px] flex-col border-r border-border-dark bg-bg-dark py-6 text-text-dark-primary transition-transform",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="mb-8 px-6 font-heading text-xl font-bold text-brand-green">
          Convo AI
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href === "/learn/chat" && pathname?.startsWith("/learn/chat"));
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
                  active ? "bg-bg-dark-hover text-brand-green"
                    : "text-text-dark-secondary hover:bg-bg-dark-hover hover:text-text-dark-primary"
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-4 border-t border-border-dark px-6 pt-6">
          <XPBar xp={xp} level={Math.floor(xp / 100) + 1} />
          <StreakCounter streak={streak} />
          <DailyGoalRing progress={daily_progress} goal={daily_goal} />
        </div>
      </aside>
    </>
  );
}
