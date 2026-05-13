import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PERSONAS } from "@/lib/personas";

export default function Home() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conversate</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Practice with company-specific D-ID Agents. Each persona runs its own GPT-4.1 brain and prompt in D-ID
          Studio—speak naturally and the agent handles ASR, reasoning, TTS, and video.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Pick a persona</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PERSONAS.map((p) => (
            <li
              key={p.id}
              className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition hover:border-primary/40"
            >
              <div className="relative aspect-[4/3] w-full bg-muted">
                <Image src={p.photoUrl} alt={p.displayName} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
              </div>
              <div className="flex flex-1 flex-col gap-1 p-4">
                <div className="font-semibold">{p.displayName}</div>
                <div className="text-xs text-muted-foreground">
                  {p.companyName} · {p.role}
                </div>
                <div className="mt-auto pt-3">
                  <Button asChild className="w-full" size="sm">
                    <Link href={`/chat?persona=${p.id}`}>Open session</Link>
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link href="/personas">Persona directory</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/settings">Settings</Link>
        </Button>
      </div>
    </div>
  );
}
