import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
};

export function PremiumCTA({ href, children, variant = "primary", className }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition",
        variant === "primary" &&
          "bg-[var(--sakura-plum)] text-[var(--sakura-petal-50)] shadow-md hover:opacity-90",
        variant === "outline" &&
          "border border-[var(--sakura-glass-border)] bg-[var(--sakura-glass-bg)] text-[var(--sakura-plum)] hover:bg-[var(--sakura-petal-100)]",
        className,
      )}
    >
      {children}
    </Link>
  );
}
