import type { PersonaLiveStatus } from "@/lib/personas";

type Props = { status: PersonaLiveStatus; className?: string };

export function PersonaLiveBadge({ status, className = "" }: Props) {
  if (status === "live") {
    return (
      <span
        className={`rounded-full bg-emerald-600/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white ${className}`}
      >
        Live — working
      </span>
    );
  }
  return (
    <span
      className={`rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white ${className}`}
    >
      In progress
    </span>
  );
}
