import type { PersonaId } from "@/lib/personas";
import { cn } from "@/lib/utils";

const ACCENT: Record<PersonaId, string> = {
  "amazon-l5-bar-raiser": "var(--ir-accent-amazon)",
  "google-l4-swe": "var(--ir-accent-google)",
  "mckinsey-em-behavioral": "var(--ir-accent-mckinsey)",
  "goldman-vp-banking": "var(--ir-accent-goldman)",
  "microsoft-prin-pm": "var(--ir-accent-microsoft)",
};

type Props = { personaId: PersonaId; className?: string };

export function CompanyAccent({ personaId, className }: Props) {
  return (
    <span
      className={cn("inline-block shrink-0", className)}
      style={{ backgroundColor: ACCENT[personaId] }}
      aria-hidden
    />
  );
}
