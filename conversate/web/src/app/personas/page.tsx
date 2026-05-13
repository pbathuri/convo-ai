import Link from "next/link";
import {
  PERSONA_SLUGS,
  type PersonaSlug,
  personaAgentId,
  personaLabel,
} from "@/lib/personas";

export default function PersonasPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Personas</h1>
      <p className="text-sm text-muted-foreground">
        Each persona maps to a D-ID Agent id via env:{" "}
        <code className="text-xs">DID_PERSONA_*</code>.
      </p>
      <ul className="space-y-2">
        {PERSONA_SLUGS.map((slug: PersonaSlug) => {
          const id = personaAgentId(slug);
          return (
            <li
              key={slug}
              className="flex flex-col gap-1 rounded-md border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="font-medium">{personaLabel(slug)}</div>
                <div className="text-xs text-muted-foreground">
                  Agent id:{" "}
                  {id ? (
                    <span className="font-mono">{id}</span>
                  ) : (
                    <span className="text-destructive">unset</span>
                  )}
                </div>
              </div>
              <Link
                className="text-sm font-medium text-primary hover:underline"
                href={`/chat?persona=${slug}`}
              >
                Open chat →
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
