import Link from "next/link";
import { FeedbackReportView } from "@/components/feedback/FeedbackReport";
import { GenerateScoreButton } from "@/components/session/GenerateScoreButton";
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
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <Link href="/sessions" className="text-sm text-muted-foreground hover:text-foreground">
        ← Sessions
      </Link>
      <h1 className="text-2xl font-semibold">{p?.displayName ?? "Session"}</h1>
      <p className="text-sm text-muted-foreground">
        Status: {session?.status ?? "unknown"} · {session?.messages?.length ?? 0} messages
      </p>

      {session?.messages && session.messages.length > 0 ? (
        <section className="space-y-2 rounded-lg border p-4">
          <h2 className="font-medium">Transcript</h2>
          <ul className="space-y-2 text-sm">
            {session.messages.map((m) => (
              <li key={m.id}>
                <span className="font-mono text-xs text-muted-foreground">{m.role}:</span>{" "}
                {m.content}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="text-sm text-muted-foreground">
          No transcript yet. Paste in the session room or capture via D-ID when available.
        </p>
      )}

      {score ? (
        <FeedbackReportView
          overallScore={score.overallScore}
          actionItems={(score.actionItems as string[]) ?? []}
          weaknesses={(score.weaknesses as string[]) ?? []}
          evidence={(score.evidence as { quote: string; dimension?: string }[]) ?? []}
          personaId={personaIdSchema.parse(personaId)}
          sessionId={params.sessionId}
        />
      ) : (
        <GenerateScoreButton sessionId={params.sessionId} />
      )}
    </main>
  );
}
