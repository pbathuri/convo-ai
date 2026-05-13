import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conversate</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Practice conversations with a Gemini 2.0 Flash brain and a D-ID Agent
          avatar. Pick a persona, hear an AI-written opening line, then continue
          in text while the stack streams video.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/chat">Start chat</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/personas">Browse personas</Link>
        </Button>
      </div>
    </div>
  );
}
