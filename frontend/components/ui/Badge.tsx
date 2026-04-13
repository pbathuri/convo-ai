"use client";

import { cn } from "@/lib/cn";

export function Badge({
  children,
  variant = "xp",
  className,
}: {
  children: React.ReactNode;
  variant?: "xp" | "streak" | "neutral";
  className?: string;
}) {
  const styles = {
    xp: "bg-brand-gold/20 text-amber-800 border-amber-400/40",
    streak: "bg-brand-orange/20 text-orange-800 border-orange-400/40",
    neutral: "bg-bg-light-secondary text-text-secondary border-border-light",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
