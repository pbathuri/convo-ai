"use client";

import Link from "next/link";
import {
  EvidenceHighlight,
  GlassCard,
  ScoreBar,
} from "@/components/ui/interview-room";
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
  degradedReason?: string | null;
  transcriptWordCount?: number;
  messageCount?: number;
};

function degradedLabel(reason: string | null | undefined): string {
  if (reason === "quota") {
    return "AI scoring is using local fallback because Gemini quota is unavailable.";
  }
  if (reason === "missing_key") {
    return "AI scoring is using local fallback because Gemini API key is not configured.";
  }
  return "AI scoring is using local fallback because Gemini quota/key is unavailable.";
}

function buildExemplarRewrite(
  weakness: string | undefined,
  quote: string | undefined,
): string {
  if (!weakness && !quote) {
    return "Lead with one sentence of context, your specific action, and a measurable result.";
  }
  const base = quote?.slice(0, 120) ?? "In that situation";
  return `Stronger version: ${base}… — then state the decision, trade-off, and outcome with one metric (e.g. latency, revenue, or users). Focus: ${weakness ?? "add specificity"}.`;
}

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
  degradedReason,
  transcriptWordCount = 0,
  messageCount = 0,
}: Props) {
  const topFixes = [...weaknesses, ...actionItems].slice(0, 3);
  const sparse =
    messageCount < 2 ||
    transcriptWordCount < 40 ||
    (evidence.length === 1 && evidence[0]?.quote.length < 30);

  return (
    <div className="space-y-4">
      {degraded ? (
        <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
          {degradedLabel(degradedReason)}
        </p>
      ) : null}

      {sparse ? (
        <p className="rounded-md border border-dashed border-amber-500/40 px-3 py-2 text-xs text-muted-foreground">
          Feedback quality is limited — add more transcript (browser speech or
          manual paste) before your next practice session.
        </p>
      ) : null}

      <GlassCard>
        <h2 className="mb-2 text-lg font-medium">Your coaching plan</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Readiness → top fixes → evidence → exemplar pattern → next drill.
        </p>
        <ScoreBar label="Interview readiness" score={overallScore} />
      </GlassCard>

      {topFixes.length > 0 ? (
        <GlassCard>
          <h3 className="text-sm font-medium">Top 3 fixes</h3>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
            {topFixes.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ol>
        </GlassCard>
      ) : null}

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

      {weaknesses.length > 0 ? (
        <GlassCard>
          <h3 className="text-sm font-medium">Growth areas</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
            {weaknesses.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </GlassCard>
      ) : null}

      {evidence.length > 0 ? (
        <GlassCard>
          <h3 className="text-sm font-medium">Evidence from your transcript</h3>
          <div className="mt-2 space-y-2">
            {evidence.map((e) => (
              <EvidenceHighlight
                key={e.quote}
                quote={e.quote}
                dimension={e.dimension}
              />
            ))}
          </div>
        </GlassCard>
      ) : null}

      <GlassCard>
        <h3 className="text-sm font-medium">Exemplar rewrite pattern</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {buildExemplarRewrite(weaknesses[0], evidence[0]?.quote)}
        </p>
      </GlassCard>

      {nextDrill ? (
        <GlassCard>
          <h3 className="text-sm font-medium">Next drill</h3>
          <p className="mt-2 text-sm text-muted-foreground">{nextDrill}</p>
        </GlassCard>
      ) : null}

      <Link
        href={`/chat?persona=${personaId}`}
        className="inline-block rounded-md bg-[var(--sakura-petal-500)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        Practice again
      </Link>

      <p className="text-xs text-muted-foreground">Session {sessionId}</p>
    </div>
  );
}
