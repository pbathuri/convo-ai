import Image from "next/image";
import Link from "next/link";
import { SakuraHero, SakuraPageShell } from "@/components/ui/sakura";
import { getAuthUser } from "@/lib/auth/supabase";
import { syncUserProfile } from "@/lib/auth/sync-profile";
import { isDatabaseConfigured } from "@/lib/db";
import { getPersona } from "@/lib/personas";
import { listSessionsEnriched } from "@/lib/sessions/service";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  const authUser = await getAuthUser();
  let profileId: string | undefined;
  if (authUser && isDatabaseConfigured()) {
    profileId = await syncUserProfile(authUser);
  }
  const sessions = await listSessionsEnriched(profileId);

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
          <Link
            href="/personas"
            className="text-[var(--sakura-petal-500)] underline"
          >
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
                      <Image
                        src={p.photoUrl}
                        alt={p.displayName}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  ) : null}
                  <div>
                    <p className="font-medium text-[var(--sakura-plum)]">
                      {p?.displayName ?? s.personaId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p?.companyName ?? "—"} · {s.status} · {s.messageCount}{" "}
                      messages · {new Date(s.createdAt).toLocaleString()}
                    </p>
                    {s.overallScore != null ? (
                      <p className="mt-1 text-xs font-semibold text-[var(--sakura-petal-500)]">
                        Scored · {Math.round(s.overallScore)}/100
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                        Not scored yet — open to generate report
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <Link
                    href={`/sessions/${s.id}`}
                    className="font-medium text-[var(--sakura-plum)] hover:underline"
                  >
                    View report
                  </Link>
                  <Link
                    href={`/chat?persona=${s.personaId}`}
                    className="text-[var(--sakura-petal-500)] hover:underline"
                  >
                    Practice again
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </SakuraPageShell>
  );
}
