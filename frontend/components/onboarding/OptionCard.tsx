"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export function OptionCard({
  icon,
  title,
  subtitle,
  selected,
  onClick,
  horizontal,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  selected?: boolean;
  onClick?: () => void;
  horizontal?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full rounded-xl border border-border-dark bg-bg-dark-card p-4 text-left transition-all duration-200 hover:scale-[1.02] hover:border-brand-green hover:bg-bg-dark-hover",
        selected && "border-2 border-brand-green bg-bg-dark-hover ring-2 ring-brand-green/25",
        horizontal ? "flex items-center gap-4" : "flex flex-col items-center text-center",
        className
      )}
    >
      {selected && (
        <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-brand-green text-white">
          <Check className="h-4 w-4" />
        </span>
      )}
      <span className={cn("text-4xl", horizontal && "text-3xl")}>{icon}</span>
      <div className={cn(!horizontal && "mt-2")}>
        <div className="font-semibold text-text-dark-primary">{title}</div>
        {subtitle ? (
          <div className="mt-1 text-sm text-text-dark-secondary">{subtitle}</div>
        ) : null}
      </div>
    </button>
  );
}
