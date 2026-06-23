import Link from "next/link";
import { DomainPracticeSandbox } from "@/components/domains/DomainPracticeSandbox";
import { GlassCard } from "@/components/ui/interview-room";
import { SakuraHero, SakuraPageShell } from "@/components/ui/sakura";
import { LEGACY_DOMAINS } from "@/lib/domains/legacy";

const LIVE_MODULE_IDS = new Set([
  "business",
  "philosophy",
  "sales",
]);

export const dynamic = "force-dynamic";

export default function DomainsPage() {
  return (
    <SakuraPageShell wide className="space-y-8 py-8">
      <SakuraHero
        eyebrow="Curriculum"
        title="Practice domains"
        subtitle="Interview personas are live today. Eight legacy coaching domains from the Streamlit prototype are catalogued for the next release."
      />

      <DomainPracticeSandbox />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <GlassCard className="border-[var(--sakura-petal-500)]/40">
          <p className="text-xs font-semibold uppercase text-[var(--sakura-petal-500)]">
            Live now
          </p>
          <h2 className="mt-1 text-lg font-semibold">Interview practice</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Five company personas with D-ID live rooms, Gemini scoring, and
            emotion radar feedback.
          </p>
          <Link
            href="/personas"
            className="mt-4 inline-block text-sm font-medium text-[var(--sakura-petal-500)] hover:underline"
          >
            Choose a persona →
          </Link>
        </GlassCard>

        {LEGACY_DOMAINS.map((domain) => (
          <GlassCard key={domain.id} className="opacity-90">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              {LIVE_MODULE_IDS.has(domain.id) ? "Live preview" : "Coming soon"}
            </p>
            <h2 className="mt-1 text-lg font-semibold">{domain.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Module <code className="text-xs">{domain.module}</code> — ported
              from the original Streamlit coaching engine.
            </p>
          </GlassCard>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/progress" className="text-[var(--sakura-petal-500)] hover:underline">
          View skill tree & progress →
        </Link>
      </p>
    </SakuraPageShell>
  );
}
