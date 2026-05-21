import Image from "next/image";
import Link from "next/link";
import { CompanyAccent } from "@/components/ui/interview-room/CompanyAccent";
import { PremiumCTA, SakuraHero, SakuraPageShell } from "@/components/ui/sakura";
import { PERSONAS, personaAgentId } from "@/lib/personas";

export default function PersonasPage() {
  return (
    <SakuraPageShell wide className="space-y-8 py-8">
      <SakuraHero
        eyebrow="Persona directory"
        title="Pick your interviewer"
        subtitle="Each persona maps to a D-ID Studio Agent. Configure agent IDs in .env.local using the env keys below."
      />

      <ul className="grid gap-6 md:grid-cols-2">
        {PERSONAS.map((p) => {
          const aid = personaAgentId(p.id);
          return (
            <li
              key={p.id}
              className="overflow-hidden rounded-2xl border border-[var(--sakura-glass-border)] bg-[var(--sakura-glass-bg)] shadow-[var(--sakura-shadow-soft)]"
            >
              <CompanyAccent personaId={p.id} className="block h-1.5 w-full rounded-none" />
              <div className="flex flex-col gap-4 p-5 sm:flex-row">
                <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-[var(--sakura-glass-border)] bg-muted sm:mx-0">
                  <Image src={p.photoUrl} alt={p.displayName} fill className="object-cover" sizes="112px" />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <CompanyAccent personaId={p.id} className="h-2.5 w-2.5 rounded-full" />
                    <h2 className="font-semibold text-[var(--sakura-plum)]">{p.displayName}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {p.companyName} — {p.role}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.interviewModes.map((m) => (
                      <span
                        key={m}
                        className="rounded-full bg-[var(--sakura-petal-100)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--sakura-plum-muted)]"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {p.defaultDurationMinutes} min · {p.defaultDifficulty}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {p.didAgentEnvKey}: {aid ? `${aid.slice(0, 12)}…` : "unset"}
                  </p>
                  <PremiumCTA href={`/chat?persona=${p.id}`}>Open chat</PremiumCTA>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/" className="text-[var(--sakura-petal-500)] hover:underline">
          ← Back to home
        </Link>
      </p>
    </SakuraPageShell>
  );
}
