import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
};

export function SakuraHero({ eyebrow, title, subtitle, children, className }: Props) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[var(--sakura-glass-border)] p-8 shadow-[var(--sakura-shadow-soft)]",
        className,
      )}
      style={{ background: "var(--sakura-gradient-hero)" }}
    >
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--sakura-petal-500)]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--sakura-plum)] md:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-3 max-w-2xl text-base text-[var(--sakura-plum-muted)]">{subtitle}</p>
      ) : null}
      {children ? <div className="mt-6 flex flex-wrap gap-3">{children}</div> : null}
    </section>
  );
}
