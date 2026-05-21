type Props = {
  savedCount: number;
  unsavedCount: number;
  manualCount: number;
  browserSpeechCount: number;
};

export function TranscriptStatusSummary({
  savedCount,
  unsavedCount,
  manualCount,
  browserSpeechCount,
}: Props) {
  return (
    <div className="rounded-md border border-[var(--sakura-glass-border)] bg-muted/30 px-3 py-2 text-xs">
      <p className="font-medium text-foreground">Transcript status</p>
      <ul className="mt-1 space-y-0.5 text-muted-foreground">
        <li>
          <strong className="text-foreground">{savedCount}</strong> saved to
          session (speech + manual)
        </li>
        <li>
          <strong className="text-foreground">{unsavedCount}</strong> unsaved
          local (retry available)
        </li>
        <li>
          <strong className="text-foreground">{browserSpeechCount}</strong>{" "}
          browser speech finals in panel
        </li>
        <li>
          <strong className="text-foreground">{manualCount}</strong> manual
          entries this session
        </li>
      </ul>
    </div>
  );
}
