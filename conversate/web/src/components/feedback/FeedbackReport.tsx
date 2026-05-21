"use client";

import Link from "next/link";
import { EvidenceHighlight, GlassCard, ScoreBar } from "@/components/ui/interview-room";
import type { PersonaId } from "@/lib/personas";

type Props = {
  overallScore: number;
  strengths: string[];
  actionItems: string[];
  weaknesses: string[];
  evidence: { quote: string; dimension?: string }[];
  nextDrill?: string;
  personaId: PersonaId;
  sessionId: string;
  degraded?: boolean;
};

export function FeedbackReportView({
  overallScore,
  strengths,
  actionItems,
  weaknesses,
  evidence,
  nextDrill,
  personaId,
  sessionId,
  degraded,
}: Props) {
  return (
    <div className="space-y-4">
      {degraded ? (
        <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
          Coaching report uses demo scoring — live Gemini was unavailable. Answers to your five
          coaching questions are still below.
        </p>
      ) : null}
      <GlassCard>
        <h2 className="mb-2 text-lg font-medium">Your coaching report</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          What you said → how strong it was → why → what to fix → what to practice next.
        </p>
        <ScoreBar label="Overall readiness" score={overallScore} />
      </GlassCard>

      {strengths.length > 0 ? (
        <GlassCard>
          <h3 className="text-sm font-medium">Strengths</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
            {strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </GlassCard>
      ) : null}

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
          <h3 className="text-sm font-medium">Evidence from your transcript</h3>
          {evidence.map((e) => (
            <EvidenceHighlight key={e.quote} quote={e.quote} dimension={e.dimension} />
          ))}
        </GlassCard>
      ) : null}

      {nextDrill ? (
        <GlassCard>
          <h3 className="text-sm font-medium">Next drill</h3>
          <p className="mt-2 text-sm text-muted-foreground">{nextDrill}</p>
        </GlassCard>
      ) : null}

      <div className="flex flex-wrap gap-2">
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
