type Props = { quote: string; dimension?: string };

export function EvidenceHighlight({ quote, dimension }: Props) {
  return (
    <blockquote className="border-l-2 border-primary/40 pl-3 text-sm italic text-muted-foreground">
      {dimension ? (
        <span className="mb-1 block text-xs font-medium not-italic text-foreground">
          {dimension}
        </span>
      ) : null}
      {quote}
    </blockquote>
  );
}
