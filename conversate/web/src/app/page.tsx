import Image from "next/image";
import Link from "next/link";
import { CompanyAccent } from "@/components/ui/interview-room/CompanyAccent";
import { PremiumCTA, SakuraHero, SakuraPageShell } from "@/components/ui/sakura";
import { PERSONAS } from "@/lib/personas";

const STEPS = [
  { title: "Practice", desc: "Live D-ID interview with a company-specific persona." },
  { title: "Transcript", desc: "Capture your spoken answers; paste agent lines if needed." },
  { title: "Score", desc: "Post-session coaching rubric with evidence." },
  { title: "Improve", desc: "Action items and your next drill on Progress." },
] as const;

export default function Home() {
  return (
    <SakuraPageShell wide className="space-y-12 py-10">
      <SakuraHero
        eyebrow="Interview prep, reimagined"
        title="Your company interview room"
        subtitle="Practice with D-ID Agents tuned per company—real voice, real pressure, Sakura-calm coaching after every session."
      >
        <PremiumCTA href="/personas">Choose a persona</PremiumCTA>
        <PremiumCTA href="/chat?persona=amazon-l5-bar-raiser" variant="outline">
          Quick start — Amazon
        </PremiumCTA>
      </SakuraHero>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            className="rounded-xl border border-[var(--sakura-glass-border)] bg-[var(--sakura-glass-bg)] p-4 shadow-[var(--sakura-shadow-soft)]"
          >
            <span className="text-xs font-bold text-[var(--sakura-petal-500)]">0{i + 1}</span>
            <h3 className="mt-1 font-semibold text-[var(--sakura-plum)]">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold text-[var(--sakura-plum)]">Five interview rooms</h2>
          <Link href="/personas" className="text-sm font-medium text-[var(--sakura-petal-500)] hover:underline">
            View all →
          </Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PERSONAS.map((p) => (
            <li
              key={p.id}
              className="group overflow-hidden rounded-xl border border-[var(--sakura-glass-border)] bg-card shadow-[var(--sakura-shadow-soft)] transition hover:border-[var(--sakura-petal-300)]"
            >
              <div className="relative aspect-[4/3] w-full bg-muted">
                <Image
                  src={p.photoUrl}
                  alt={p.displayName}
                  fill
                  className="object-cover transition group-hover:scale-[1.02]"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-[var(--sakura-glass-bg)]/90 px-2 py-1 text-xs backdrop-blur">
                  <CompanyAccent personaId={p.id} className="h-2 w-2 rounded-full" />
                  <span className="font-medium">{p.companyName}</span>
                </div>
              </div>
              <div className="space-y-2 p-4">
                <p className="font-semibold">{p.displayName}</p>
                <p className="text-xs text-muted-foreground">{p.role}</p>
                <PremiumCTA href={`/chat?persona=${p.id}`} className="w-full text-center">
                  Enter room
                </PremiumCTA>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </SakuraPageShell>
  );
}
