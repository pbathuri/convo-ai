import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export function InterviewRoomPanel({ children, className }: Props) {
  return (
    <div
      className={cn(
        "interview-room sakura-theme rounded-2xl border border-[var(--sakura-glass-border)] p-4 shadow-[var(--sakura-shadow-soft)] backdrop-blur-md md:p-6",
        className,
      )}
      style={{ background: "var(--sakura-glass-bg)" }}
    >
      {children}
    </div>
  );
}
