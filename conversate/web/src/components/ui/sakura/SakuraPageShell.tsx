import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  wide?: boolean;
};

export function SakuraPageShell({ children, className, wide }: Props) {
  return (
    <div
      className={cn(
        "sakura-theme mx-auto w-full px-4 py-6",
        wide ? "max-w-6xl" : "max-w-5xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
