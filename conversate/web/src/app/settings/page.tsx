import { isSupabaseConfigured } from "@/lib/auth/supabase";
import { isResendConfigured } from "@/lib/email/resend";
import { isDatabaseConfigured } from "@/lib/db";
import { isPostHogConfigured } from "@/lib/observability/posthog";
import { isSentryConfigured } from "@/lib/observability/sentry";
import { isSupabaseAdminConfigured } from "@/utils/supabase/admin";
import Link from "next/link";
import { SakuraPageShell } from "@/components/ui/sakura";

async function getSetupStatus() {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/setup/status`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json() as Promise<{
      ready: boolean;
      nextSteps: string[];
      databaseReachable: boolean;
      personasSeeded: boolean;
    }>;
  } catch {
    return null;
  }
}

export default async function SettingsPage() {
  const setup = await getSetupStatus();
  const integrations = [
    { name: "Supabase Auth (publishable)", ok: isSupabaseConfigured() },
    { name: "Supabase Admin (secret)", ok: isSupabaseAdminConfigured() },
    { name: "Postgres (Prisma)", ok: isDatabaseConfigured() },
    { name: "Resend Email", ok: isResendConfigured() },
    { name: "Sentry", ok: isSentryConfigured() },
    { name: "PostHog", ok: isPostHogConfigured() },
    {
      name: "Gemini scoring",
      ok: Boolean(process.env.GOOGLE_AI_STUDIO_KEY?.trim()),
    },
    {
      name: "Deepgram STT",
      ok: Boolean(process.env.DEEPGRAM_API_KEY?.trim()),
    },
    {
      name: "D-ID avatar",
      ok: Boolean(process.env.DID_API_BASIC_KEY?.trim()),
    },
  ];

  return (
    <SakuraPageShell className="max-w-2xl space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--sakura-plum)]">
          Settings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Project <strong>vtbkmccoarhfzgosahqa</strong> — Stripe skipped.
        </p>
      </div>

      {setup && !setup.ready ? (
        <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-3 text-sm">
          <p className="font-medium text-amber-900">Setup incomplete</p>
          <ul className="mt-2 list-inside list-disc text-amber-800">
            {setup.nextSteps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      ) : setup?.ready ? (
        <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-800">
          Supabase + database ready. Sign in and practice.
        </p>
      ) : null}

      <ul className="space-y-2 rounded-lg border border-[var(--sakura-glass-border)] p-4">
        {integrations.map((i) => (
          <li
            key={i.name}
            className="flex items-center justify-between text-sm"
          >
            <span>{i.name}</span>
            <span className={i.ok ? "text-emerald-600" : "text-amber-600"}>
              {i.ok ? "Configured" : "Needs key"}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/auth/login" className="text-[var(--sakura-petal-500)] hover:underline">
          Sign in →
        </Link>
        <a
          href="https://web-delta-three-73.vercel.app"
          className="text-[var(--sakura-petal-500)] hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Production app →
        </a>
        <Link href="/api/setup/status" className="text-[var(--sakura-petal-500)] hover:underline">
          Setup status JSON →
        </Link>
        <Link href="/api/health" className="text-[var(--sakura-petal-500)] hover:underline">
          Health JSON →
        </Link>
      </div>
    </SakuraPageShell>
  );
}
