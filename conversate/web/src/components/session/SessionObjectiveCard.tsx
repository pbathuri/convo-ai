import { GlassCard } from "@/components/ui/interview-room";
import { getPersona, type PersonaId } from "@/lib/personas";

type Props = { personaId: PersonaId };

export function SessionObjectiveCard({ personaId }: Props) {
  const p = getPersona(personaId);
  if (!p) return null;
  return (
    <GlassCard className="space-y-2">
      <h3 className="text-sm font-medium">Session objective</h3>
      <p className="text-sm text-muted-foreground">{p.openingQuestion}</p>
      <p className="text-xs text-muted-foreground">{p.candidateInstructions}</p>
    </GlassCard>
  );
}
