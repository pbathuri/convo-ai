"use client";

import { cn } from "@/lib/cn";

export function OptionGrid({
  children,
  cols = 4,
  className,
}: {
  children: React.ReactNode;
  cols?: 2 | 4;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-3",
        cols === 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2",
        className
      )}
    >
      {children}
    </div>
  );
}
