import Link from "next/link";
import { listSessions } from "@/lib/sessions/service";
import { getPersona } from "@/lib/personas";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  const sessions = await listSessions();

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Sessions</h1>
      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No sessions yet. Start a{" "}
          <Link href="/chat" className="text-primary underline">
            practice session
          </Link>
          .
        </p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {sessions.map((s) => {
            const p = getPersona(s.personaId);
            return (
              <li key={s.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{p?.displayName ?? s.personaId}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.status} · {new Date(s.createdAt).toLocaleString()}
                  </p>
                </div>
                <Link href={`/sessions/${s.id}`} className="text-sm text-primary">
                  Open
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
