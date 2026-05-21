import Image from "next/image";
import Link from "next/link";
import { SakuraHero, SakuraPageShell } from "@/components/ui/sakura";
import { listSessionsEnriched } from "@/lib/sessions/service";
import { getPersona } from "@/lib/personas";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  const sessions = await listSessionsEnriched();

  return (
    <SakuraPageShell className="space-y-8 py-8">
      <SakuraHero
        eyebrow="History"
        title="Your sessions"
        subtitle="Review transcripts, generate scores, and track improvement over time."
      />

      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No sessions yet. Start a{" "}
          <Link href="/personas" className="text-[var(--sakura-petal-500)] underline">
            practice session
          </Link>
          .
        </p>
      ) : (
        <ul className="space-y-3">
          {sessions.map((s) => {
            const p = getPersona(s.personaId);
            return (
              <li
                key={s.id}
                className="flex flex-col gap-3 rounded-xl border border-[var(--sakura-glass-border)] bg-[var(--sakura-glass-bg)] p-4 shadow-[var(--sakura-shadow-soft)] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex gap-3">
                  {p ? (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border">
                      <Image src={p.photoUrl} alt={p.displayName} fill className="object-cover" sizes="56px" />
                    </div>
                  ) : null}
                  <div>
                    <p className="font-medium text-[var(--sakura-plum)]">{p?.displayName ?? s.personaId}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.status} · {s.messageCount} messages · {new Date(s.createdAt).toLocaleString()}
                    </p>
                    {s.overallScore != null ? (
                      <p className="mt-1 text-xs font-semibold text-[var(--sakura-petal-500)]">
                        Score {Math.round(s.overallScore)}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-muted-foreground">Not scored yet</p>
                    )}
                  </div>
                </div>
                <Link
                  href={`/sessions/${s.id}`}
                  className="text-sm font-medium text-[var(--sakura-plum)] hover:underline"
                >
                  Review →
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </SakuraPageShell>
  );
}
