import { cn } from "@/lib/utils";

type Status = "pending" | "ready" | "warning" | "error";

type Props = {
  label: string;
  status: Status;
};

const STATUS_CLASS: Record<Status, string> = {
  pending: "bg-muted text-muted-foreground",
  ready: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  warning: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  error: "bg-destructive/15 text-destructive",
};

export function ReadinessIndicator({ label, status }: Props) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span>{label}</span>
      <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", STATUS_CLASS[status])}>
        {status}
      </span>
    </div>
  );
}
