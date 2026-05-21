import type { InterviewPhase } from "@/lib/session/interview-phase";

type Props = {
  phase: string;
  sessionId?: string;
  interviewPhase?: InterviewPhase;
  hint?: string | null;
};

export function SessionStatusBar({
  phase,
  sessionId,
  interviewPhase,
  hint,
}: Props) {
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-muted/40 px-3 py-2 text-xs">
        <span>
          Status: <strong className="text-foreground">{phase}</strong>
          {interviewPhase ? (
            <>
              {" "}
              · <span className="font-mono text-[10px]">{interviewPhase}</span>
            </>
          ) : null}
        </span>
        {sessionId ? (
          <span className="font-mono text-muted-foreground">
            Session {sessionId.slice(0, 12)}…
          </span>
        ) : null}
      </div>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
