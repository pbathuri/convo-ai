"use client";

import { cn } from "@/lib/cn";

export function LoadingDots({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex gap-1", className)} aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block h-2 w-2 rounded-full bg-current animate-loading-dot"
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </span>
  );
}
