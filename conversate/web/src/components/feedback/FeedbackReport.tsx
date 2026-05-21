"use client";

import Link from "next/link";
import { EvidenceHighlight, GlassCard, ScoreBar } from "@/components/ui/interview-room";
import type { PersonaId } from "@/lib/personas";

type Props = {
  overallScore: number;
  actionItems: string[];
  weaknesses: string[];
  evidence: { quote: string; dimension?: string }[];
  personaId: PersonaId;
  sessionId: string;
};

export function FeedbackReportView({
  overallScore,
  actionItems,
  weaknesses,
  evidence,
  personaId,
  sessionId,
}: Props) {
  return (
    <div className="space-y-4">
      <GlassCard>
        <h2 className="mb-2 text-lg font-medium">Your coaching report</h2>
        <ScoreBar label="Overall readiness" score={overallScore} />
      </GlassCard>
      <GlassCard>
        <h3 className="text-sm font-medium">Top fixes</h3>
        <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
          {weaknesses.slice(0, 3).map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </GlassCard>
      <GlassCard>
        <h3 className="text-sm font-medium">Action items</h3>
        <ol className="mt-2 list-inside list-decimal text-sm">
          {actionItems.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ol>
      </GlassCard>
      {evidence.length > 0 ? (
        <GlassCard className="space-y-3">
          <h3 className="text-sm font-medium">Evidence</h3>
          {evidence.map((e) => (
            <EvidenceHighlight key={e.quote} quote={e.quote} dimension={e.dimension} />
          ))}
        </GlassCard>
      ) : null}
      <div className="flex gap-2">
        <Link
          href={`/chat?persona=${personaId}`}
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Practice again
        </Link>
        <Link href="/progress" className="rounded-md border px-4 py-2 text-sm">
          View progress
        </Link>
      </div>
      <p className="text-xs text-muted-foreground">Session {sessionId}</p>
    </div>
  );
}
