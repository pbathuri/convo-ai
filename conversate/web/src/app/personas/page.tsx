import Link from "next/link";
import { PersonasPracticeGrid } from "@/components/personas/PersonasPracticeGrid";
import { SakuraHero, SakuraPageShell } from "@/components/ui/sakura";

export default function PersonasPage() {
  return (
    <SakuraPageShell wide className="space-y-8 py-8">
      <SakuraHero
        eyebrow="Practice"
        title="Pick your live interviewer"
        subtitle="Sarah Chen (Amazon) is live with an embedded D-ID agent. Other company rooms are in progress."
      />

      <PersonasPracticeGrid />

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/"
          className="text-[var(--sakura-petal-500)] hover:underline"
        >
          ← Back to home
        </Link>
      </p>
    </SakuraPageShell>
  );
}
