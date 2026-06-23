import Link from "next/link";
import { PremiumCTA, SakuraHero, SakuraPageShell } from "@/components/ui/sakura";
import { GlassCard } from "@/components/ui/interview-room";

const tiers = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    features: ["5 sessions / month", "30 voice minutes", "Coaching reports"],
    cta: "Start practicing",
    href: "/personas",
    highlight: false,
  },
  {
    name: "Pro",
    price: "Coming soon",
    period: "",
    features: ["50 sessions / month", "300 voice minutes", "Priority scoring"],
    cta: "Join waitlist",
    href: "/auth/login",
    highlight: true,
  },
] as const;

export default function PricingPage() {
  return (
    <SakuraPageShell className="space-y-8 py-8">
      <SakuraHero
        eyebrow="Plans"
        title="Practice like it's the real room"
        subtitle="Starter tier is free today. Paid billing (Stripe) is skipped for this build — sign in to save progress."
      />

      <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
        {tiers.map((tier) => (
          <GlassCard
            key={tier.name}
            className={
              tier.highlight
                ? "ring-2 ring-[var(--sakura-petal-400)]"
                : undefined
            }
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {tier.name}
            </p>
            <p className="mt-2 text-3xl font-semibold text-[var(--sakura-plum)]">
              {tier.price}
              <span className="text-sm font-normal text-muted-foreground">
                {tier.period}
              </span>
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {tier.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <div className="mt-6">
              <PremiumCTA href={tier.href}>{tier.cta}</PremiumCTA>
            </div>
          </GlassCard>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        <Link href="/auth/login" className="underline">
          Sign in
        </Link>{" "}
        with Supabase to persist sessions when{" "}
        <code className="text-xs">DATABASE_URL</code> is connected.
      </p>
    </SakuraPageShell>
  );
}
