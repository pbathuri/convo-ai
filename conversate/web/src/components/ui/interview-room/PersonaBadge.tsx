import type { PersonaId } from "@/lib/personas";
import { getPersona } from "@/lib/personas";
import { CompanyAccent } from "./CompanyAccent";

type Props = { personaId: PersonaId };

export function PersonaBadge({ personaId }: Props) {
  const p = getPersona(personaId);
  if (!p) return null;
  return (
    <div className="flex items-center gap-2">
      <CompanyAccent personaId={personaId} className="h-2 w-2 rounded-full" />
      <div>
        <p className="text-sm font-medium">{p.displayName}</p>
        <p className="text-xs text-muted-foreground">
          {p.companyName} · {p.role}
        </p>
      </div>
    </div>
  );
}
