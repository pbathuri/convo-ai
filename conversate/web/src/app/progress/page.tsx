import Link from "next/link";

export default function ProgressPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Progress</h1>
      <p className="text-sm text-muted-foreground">
        Skill trends and weakness clusters appear after 3+ scored sessions.
      </p>
      <Link href="/chat" className="text-sm text-primary underline">
        Start a practice session
      </Link>
    </main>
  );
}
