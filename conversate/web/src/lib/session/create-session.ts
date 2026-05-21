import type { PersonaId } from "@/lib/personas";

const inflightByPersona = new Map<string, Promise<string>>();

/**
 * Reuse one in-flight session POST per persona (React Strict Mode remount safety).
 */
export function getOrCreateSessionId(
  personaId: PersonaId,
  signal: AbortSignal,
): Promise<string> {
  const existing = inflightByPersona.get(personaId);
  if (existing) return existing;

  const promise = (async () => {
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personaId }),
      signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { session: { id: string } };
    return data.session.id;
  })();

  inflightByPersona.set(personaId, promise);
  void promise.finally(() => {
    if (inflightByPersona.get(personaId) === promise) {
      inflightByPersona.delete(personaId);
    }
  });

  return promise;
}

export function clearSessionInflight(personaId: PersonaId): void {
  inflightByPersona.delete(personaId);
}
