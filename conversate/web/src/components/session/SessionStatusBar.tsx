type SessionLifecycle =
  | "idle"
  | "creating"
  | "ready"
  | "local_fallback"
  | "error";

type Props = {
  phase: string;
  sessionId?: string;
  sessionLifecycle?: SessionLifecycle;
};

export function SessionStatusBar({
  phase,
  sessionId,
  sessionLifecycle,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-muted/40 px-3 py-2 text-xs">
      <span>
        Phase: <strong className="text-foreground">{phase}</strong>
        {sessionLifecycle ? (
          <>
            {" "}
            · Session:{" "}
            <strong className="text-foreground">{sessionLifecycle}</strong>
          </>
        ) : null}
      </span>
      {sessionId ? (
        <span className="font-mono text-muted-foreground">
          Session {sessionId.slice(0, 12)}…
        </span>
      ) : null}
    </div>
  );
}
