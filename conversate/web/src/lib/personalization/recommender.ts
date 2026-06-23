import type { PersonaId } from "@/lib/personas";
import { getPersona } from "@/lib/personas";
import {
  type BanditObservation,
  banditSelectDrill,
} from "@/lib/personalization/bandit";

const WEAKNESS_DRILLS: Record<string, string> = {
  metric: "Practice one story with before/after numbers and customer impact.",
  quantif: "Add three concrete metrics to your opening STAR answer.",
  structure: "Outline Situation → Task → Action → Result in under 90 seconds.",
  vague: "Replace general claims with one specific decision you owned.",
  ownership: "Clarify what only you could have done versus the team.",
  customer: "Tie your example to end-user or customer outcome explicitly.",
  trade: "Name two options you rejected and why you chose your path.",
};

function drillForWeakness(weakness: string, fallback: string): string {
  const lower = weakness.toLowerCase();
  for (const [key, drill] of Object.entries(WEAKNESS_DRILLS)) {
    if (lower.includes(key)) return drill;
  }
  return fallback;
}

export function recommendNextDrill(opts: {
  personaId: PersonaId;
  weaknesses: string[];
  banditObservations?: BanditObservation[];
}): {
  personaId: PersonaId;
  drill: string;
  basedOn?: string;
  rlStrategy?: string;
} {
  const p = getPersona(opts.personaId);
  const fallback =
    p?.openingQuestion ?? "Practice your opening story with metrics.";

  if (opts.banditObservations && opts.banditObservations.length > 0) {
    const pick = banditSelectDrill({
      weaknesses: opts.weaknesses,
      observations: opts.banditObservations,
      fallbackDrill: fallback,
    });
    return {
      personaId: opts.personaId,
      drill: pick.drill,
      basedOn: opts.weaknesses[0] ?? pick.armKey ?? undefined,
      rlStrategy: pick.strategy,
    };
  }

  const top = opts.weaknesses[0];
  if (!top) {
    return { personaId: opts.personaId, drill: fallback };
  }
  return {
    personaId: opts.personaId,
    drill: drillForWeakness(top, fallback),
    basedOn: top,
  };
}

export function clusterWeaknesses(
  weaknesses: string[],
): { label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const w of weaknesses) {
    const key = w.trim().slice(0, 48) || "General";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}
