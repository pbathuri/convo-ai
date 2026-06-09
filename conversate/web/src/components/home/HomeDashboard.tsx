import Link from "next/link";
import { PremiumCTA, SakuraHero, SakuraPageShell } from "@/components/ui/sakura";
import { getInsightsSnapshot } from "@/lib/insights/metrics";
import {
  defaultLivePersonaId,
  getPersona,
  isPersonaLiveEmbedded,
  personaIdSchema,
} from "@/lib/personas";
import { listSessionsEnriched } from "@/lib/sessions/service";

export async function HomeDashboard() {
  const [sessions, insights] = await Promise.all([
    listSessionsEnriched(),
    getInsightsSnapshot(),
  ]);

  const lastSession = sessions[0];
  const lastPid = lastSession?.personaId
    ? personaIdSchema.safeParse(lastSession.personaId)
    : null;
  const startPersonaId =
    lastPid?.success && isPersonaLiveEmbedded(lastPid.data)
      ? lastPid.data
      : defaultLivePersonaId();
  const startPersona = getPersona(startPersonaId);

  return (
    <SakuraPageShell wide className="space-y-8 py-8">
      <SakuraHero
        eyebrow="Interview prep, reimagined"
        title="Your company interview room"
        subtitle="Real-time AI interviewer — adapts while you speak. Not pre-recorded modules with pauses."
      >
        <PremiumCTA href={`/chat?persona=${startPersonaId}`}>
          Start live interview — Amazon
        </PremiumCTA>
        <PremiumCTA href="/personas" variant="outline">
          Browse practice rooms
        </PremiumCTA>
      </SakuraHero>

      <div className="rounded-xl border border-[var(--sakura-petal-300)]/40 bg-[var(--sakura-petal-50)]/80 px-4 py-3 text-sm text-[var(--sakura-plum)]">
        <strong>Why Conversate beats recorded practice:</strong> competitors use
        pre-recorded people and post-hoc analysis. You get a live D-ID agent
        tuned per company that follows up in real time, then coaching grounded in
        your transcript.
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-[var(--sakura-glass-border)] bg-[var(--sakura-glass-bg)] p-5 shadow-[var(--sakura-shadow-soft)]">
          <h2 className="text-sm font-semibold text-[var(--sakura-plum)]">
            Profile
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Candidate · MVP session tracking
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Job description & resume upload — coming soon.
          </p>
        </section>

        <section className="rounded-xl border border-[var(--sakura-glass-border)] bg-[var(--sakura-glass-bg)] p-5 shadow-[var(--sakura-shadow-soft)] lg:col-span-1">
          <h2 className="text-sm font-semibold text-[var(--sakura-plum)]">
            Start practicing
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {startPersona
              ? `Continue with ${startPersona.displayName} (${startPersona.companyName}) or pick another room.`
              : "Pick a company-specific interview room."}
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <PremiumCTA href={`/chat?persona=${startPersonaId}`}>
              Start live interview →
            </PremiumCTA>
            <Link
              href="/personas"
              className="text-center text-sm text-[var(--sakura-petal-500)] hover:underline"
            >
              View all practice rooms
            </Link>
          </div>
        </section>

        <section className="rounded-xl border border-[var(--sakura-glass-border)] bg-[var(--sakura-glass-bg)] p-5 shadow-[var(--sakura-shadow-soft)]">
          <h2 className="text-sm font-semibold text-[var(--sakura-plum)]">
            Quick stats
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-muted-foreground">Sessions completed</span>
              <span className="font-medium">{insights.sessionsCompleted}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Avg readiness</span>
              <span className="font-medium">
                {insights.averageReadiness != null
                  ? `${Math.round(insights.averageReadiness)}%`
                  : "—"}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Minutes practiced</span>
              <span className="font-medium">{insights.minutesPracticed}</span>
            </li>
          </ul>
          <Link
            href="/progress"
            className="mt-3 inline-block text-sm text-[var(--sakura-petal-500)] hover:underline"
          >
            Open Insights →
          </Link>
        </section>
      </div>

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold text-[var(--sakura-plum)]">
            Recent activity
          </h2>
          <Link
            href="/sessions"
            className="text-sm text-[var(--sakura-petal-500)] hover:underline"
          >
            View all →
          </Link>
        </div>
        {sessions.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--sakura-glass-border)] p-6 text-center text-sm text-muted-foreground">
            No sessions yet. Start your first live interview above.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--sakura-glass-border)] rounded-xl border border-[var(--sakura-glass-border)] bg-[var(--sakura-glass-bg)]">
            {sessions.slice(0, 8).map((s) => {
              const p = getPersona(s.personaId);
              return (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                  <div>
                    <span className="font-medium">
                      {p?.displayName ?? s.personaId}
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      · {s.status}
                      {s.overallScore != null ? ` · ${Math.round(s.overallScore)}%` : ""}
                    </span>
                  </div>
                  <Link
                    href={`/sessions/${s.id}`}
                    className="text-[var(--sakura-petal-500)] hover:underline"
                  >
                    Details
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Practice",
            desc: "Live D-ID interview with a company-specific persona.",
          },
          {
            title: "Transcript",
            desc: "Capture spoken answers; paste agent lines if needed.",
          },
          { title: "Score", desc: "Post-session coaching rubric with evidence." },
          {
            title: "Insights",
            desc: "Readiness trends and your next drill.",
          },
        ].map((s, i) => (
          <div
            key={s.title}
            className="rounded-xl border border-[var(--sakura-glass-border)] bg-[var(--sakura-glass-bg)] p-4"
          >
            <span className="text-xs font-bold text-[var(--sakura-petal-500)]">
              0{i + 1}
            </span>
            <h3 className="mt-1 font-semibold text-[var(--sakura-plum)]">
              {s.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </section>
    </SakuraPageShell>
  );
}
