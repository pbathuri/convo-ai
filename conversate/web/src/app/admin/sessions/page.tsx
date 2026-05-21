import { listSessions } from "@/lib/sessions/service";

export const dynamic = "force-dynamic";

export default async function AdminSessionsPage() {
  const sessions = await listSessions();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Sessions</h1>
      <p className="text-sm text-muted-foreground">
        {sessions.length} recent sessions
      </p>
    </div>
  );
}
