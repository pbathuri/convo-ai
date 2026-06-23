import Link from "next/link";
import { FeedbackReportView } from "@/components/feedback/FeedbackReport";
import { GenerateScoreButton } from "@/components/session/GenerateScoreButton";
import { SakuraPageShell } from "@/components/ui/sakura";
import { emotionFromReadiness, emotionTraitsSchema } from "@/lib/emotion/schema";
import { getPersona, personaIdSchema } from "@/lib/personas";
import { getSession } from "@/lib/sessions/service";

export const dynamic = "force-dynamic";

export default async function SessionDetailPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const session = await getSession(params.sessionId);
  const personaId = session?.personaId ?? "amazon-l5-bar-raiser";
  const p = getPersona(personaId);
  const score = session?.scores?.[0];
  const lastRun = session?.modelRuns?.[0];
  const scoringDegraded =
    lastRun?.modelName === "local-heuristic" ||
    lastRun?.modelProvider === "local" ||
    (typeof lastRun?.modelName === "string" &&
      lastRun.modelName.includes("stub"));
  const degradedReason =
    lastRun?.modelProvider === "local" ? "missing_key" : "quota";
  const messages = session?.messages ?? [];
  const transcriptWordCount = messages.reduce(
    (n, m) => n + m.content.split(/\s+/).filter(Boolean).length,
    0,
  );
  const storedEmotion = (() => {
    const raw = lastRun?.outputJson as Record<string, unknown> | null | undefined;
    const parsed = emotionTraitsSchema.safeParse(raw?.emotionTraits);
    return parsed.success ? parsed.data : undefined;
  })();

  return (
    <SakuraPageShell className="space-y-6 py-8">
      <Link
        href="/sessions"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Sessions
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--sakura-plum)]">
            {p?.displayName ?? "Session"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {p?.companyName ?? "—"} · Status: {session?.status ?? "unknown"} ·{" "}
            {session?.messages?.length ?? 0} messages
          </p>
        </div>
        <Link
          href={`/chat?persona=${personaId}`}
          className="text-sm font-medium text-[var(--sakura-petal-500)] hover:underline"
        >
          Practice again →
        </Link>
      </div>

      {session?.messages && session.messages.length > 0 ? (
        <section className="space-y-2 rounded-xl border border-[var(--sakura-glass-border)] bg-[var(--sakura-glass-bg)] p-4">
          <h2 className="font-medium">Transcript</h2>
          <p className="text-xs text-muted-foreground">
            Lines from saved messages (browser speech and manual paste). D-ID
            agent lines are not auto-captured in V1.
          </p>
          <ul className="space-y-2 text-sm">
            {session.messages.map((m) => (
              <li key={m.id}>
                <span className="text-[10px] font-semibold uppercase text-[var(--sakura-petal-500)]">
                  {m.role}
                </span>{" "}
                <span className="text-[10px] text-muted-foreground">
                  (saved message)
                </span>{" "}
                <span className="text-muted-foreground">{m.content}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          No transcript yet. Return to the{" "}
          <Link
            href={`/chat?persona=${personaId}`}
            className="text-[var(--sakura-petal-500)] underline"
          >
            interview room
          </Link>{" "}
          to capture speech or paste lines manually.
        </p>
      )}

      {score ? (
        <FeedbackReportView
          overallScore={score.overallScore}
          strengths={(score.strengths as string[]) ?? []}
          actionItems={(score.actionItems as string[]) ?? []}
          weaknesses={(score.weaknesses as string[]) ?? []}
          evidence={
            (score.evidence as { quote: string; dimension?: string }[]) ?? []
          }
          nextDrill={
            (score as { nextDrill?: string }).nextDrill ??
            (Array.isArray(score.actionItems) && score.actionItems[0]
              ? String(score.actionItems[0])
              : p?.openingQuestion)
          }
          personaId={personaIdSchema.parse(personaId)}
          sessionId={params.sessionId}
          degraded={scoringDegraded}
          degradedReason={scoringDegraded ? degradedReason : null}
          messageCount={messages.length}
          transcriptWordCount={transcriptWordCount}
          emotionTraits={
            storedEmotion ?? emotionFromReadiness(score.overallScore)
          }
        />
      ) : (
        <div className="space-y-2 rounded-xl border border-[var(--sakura-glass-border)] bg-[var(--sakura-glass-bg)] p-4">
          <p className="text-sm text-muted-foreground">
            Generate a coaching report when you have transcript content. Live
            scoring uses Gemini when configured; otherwise a local heuristic
            fallback is used (never a server error).
          </p>
          <GenerateScoreButton sessionId={params.sessionId} />
        </div>
      )}
    </SakuraPageShell>
  );
}
