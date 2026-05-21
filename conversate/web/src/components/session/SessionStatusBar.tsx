type Props = { phase: string; sessionId?: string };

export function SessionStatusBar({ phase, sessionId }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-muted/40 px-3 py-2 text-xs">
      <span>
        Phase: <strong className="text-foreground">{phase}</strong>
      </span>
      {sessionId ? (
        <span className="font-mono text-muted-foreground">Session {sessionId.slice(0, 12)}…</span>
      ) : null}
    </div>
  );
}
