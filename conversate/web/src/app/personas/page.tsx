import Image from "next/image";
import Link from "next/link";
import { PERSONAS } from "@/lib/personas";
import { personaAgentId } from "@/lib/personas";

export default function PersonasPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Personas</h1>
      <p className="text-sm text-muted-foreground">
        Each row maps to a D-ID Agent via the env key shown (set in <code className="text-xs">.env.local</code>).
      </p>
      <ul className="space-y-3">
        {PERSONAS.map((p) => {
          const aid = personaAgentId(p.id);
          return (
            <li
              key={p.id}
              className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image src={p.photoUrl} alt={p.displayName} fill className="object-cover" sizes="80px" />
                </div>
                <div>
                  <div className="font-medium">{p.displayName}</div>
                  <div className="text-sm text-muted-foreground">
                    {p.companyName} — {p.role}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Env: <code className="text-[11px]">{p.didAgentEnvKey}</code>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Agent id:{" "}
                    {aid ? (
                      <span className="font-mono text-foreground">{aid}</span>
                    ) : (
                      <span className="text-destructive">unset</span>
                    )}
                  </div>
                </div>
              </div>
              <Link className="text-sm font-medium text-primary hover:underline" href={`/chat?persona=${p.id}`}>
                Open chat →
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
