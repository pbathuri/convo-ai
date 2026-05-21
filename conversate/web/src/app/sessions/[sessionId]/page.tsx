import Link from "next/link";
import { FeedbackReportView } from "@/components/feedback/FeedbackReport";
import { GenerateScoreButton } from "@/components/session/GenerateScoreButton";
import { SakuraPageShell } from "@/components/ui/sakura";
import { getSession } from "@/lib/sessions/service";
import { getPersona, personaIdSchema } from "@/lib/personas";

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

  return (
    <SakuraPageShell className="space-y-6 py-8">
      <Link href="/sessions" className="text-sm text-muted-foreground hover:text-foreground">
        ← Sessions
      </Link>
      <h1 className="text-2xl font-semibold text-[var(--sakura-plum)]">{p?.displayName ?? "Session"}</h1>
      <p className="text-sm text-muted-foreground">
        Status: {session?.status ?? "unknown"} · {session?.messages?.length ?? 0} messages
        {p ? ` · ${p.companyName}` : null}
      </p>

      {session?.messages && session.messages.length > 0 ? (
        <section className="space-y-2 rounded-xl border border-[var(--sakura-glass-border)] bg-[var(--sakura-glass-bg)] p-4">
          <h2 className="font-medium">Transcript</h2>
          <ul className="space-y-2 text-sm">
            {session.messages.map((m) => (
              <li key={m.id}>
                <span className="text-[10px] font-semibold uppercase text-[var(--sakura-petal-500)]">
                  {m.role}
                </span>{" "}
                <span className="text-muted-foreground">{m.content}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          No transcript yet. Return to the{" "}
          <Link href={`/chat?persona=${personaId}`} className="text-[var(--sakura-petal-500)] underline">
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
          evidence={(score.evidence as { quote: string; dimension?: string }[]) ?? []}
          nextDrill={
            (score as { nextDrill?: string }).nextDrill ??
            (Array.isArray(score.actionItems) && score.actionItems[0]
              ? String(score.actionItems[0])
              : p?.openingQuestion)
          }
          personaId={personaIdSchema.parse(personaId)}
          sessionId={params.sessionId}
        />
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Generate a coaching report when you have transcript content. Requires{" "}
            <code className="text-xs">GOOGLE_AI_STUDIO_KEY</code> for live Gemini; otherwise a
            demo stub is used.
          </p>
          <GenerateScoreButton sessionId={params.sessionId} />
        </div>
      )}
    </SakuraPageShell>
  );
}
