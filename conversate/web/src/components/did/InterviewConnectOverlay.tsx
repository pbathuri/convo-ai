"use client";

type Step = {
  id: string;
  label: string;
  state: "pending" | "active" | "done";
};

type Props = {
  steps: Step[];
  subtitle?: string;
};

export function InterviewConnectOverlay({ steps, subtitle }: Props) {
  return (
    <div
      className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-[var(--sakura-glass-border)] bg-[var(--sakura-glass-bg)] px-6 py-10 text-center shadow-[var(--sakura-shadow-soft)]"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[var(--sakura-petal-300)] border-t-[var(--sakura-petal-500)]" />
      <h2 className="text-lg font-semibold text-[var(--sakura-plum)]">
        Connecting your live interviewer
      </h2>
      {subtitle ? (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{subtitle}</p>
      ) : null}
      <ol className="mt-6 w-full max-w-sm space-y-2 text-left text-sm">
        {steps.map((s) => (
          <li
            key={s.id}
            className={`flex items-center gap-2 rounded-md px-3 py-2 ${s.state === "active"
                ? "bg-[var(--sakura-petal-50)] font-medium text-[var(--sakura-plum)]"
                : "text-muted-foreground"
              }`}
          >
            <span aria-hidden>
              {s.state === "done" ? "✓" : s.state === "active" ? "…" : "○"}
            </span>
            {s.label}
          </li>
        ))}
      </ol>
    </div>
  );
}
