"use client";

import { cn } from "@/lib/cn";

export function QuestionBubble({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border-dark bg-gradient-to-br from-bg-dark-card to-[#152a32] px-5 py-4 text-base font-medium text-text-dark-primary shadow-card-dark",
        className
      )}
    >
      <div
        className="absolute -left-2 top-5 h-0 w-0 border-y-8 border-y-transparent border-r-8 border-r-bg-dark-card"
        aria-hidden
      />
      {children}
    </div>
  );
}
