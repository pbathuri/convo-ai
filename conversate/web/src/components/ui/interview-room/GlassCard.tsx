import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export function GlassCard({ children, className }: Props) {
  return (
    <div
      className={cn(
        "rounded-[var(--ir-radius)] border border-[var(--ir-glass-border)] bg-[var(--ir-glass-bg)] p-4 backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
