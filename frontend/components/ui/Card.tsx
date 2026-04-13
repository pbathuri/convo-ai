"use client";

import { cn } from "@/lib/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  dark?: boolean;
}

export function Card({
  className,
  selected,
  dark,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card p-6 cursor-pointer transition-all duration-200 shadow-card",
        dark
          ? "bg-bg-dark-card border border-border-dark hover:border-brand-green hover:bg-bg-dark-hover hover:scale-[1.03] hover:shadow-card-dark"
          : "bg-white border border-border-light hover:shadow-card-hover",
        selected && "border-2 border-brand-green ring-2 ring-brand-green/30 scale-[1.02]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
