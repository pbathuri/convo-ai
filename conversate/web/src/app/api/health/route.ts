import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/auth/supabase";
import { backendHealth } from "@/lib/backend/client";
import { getEnvHealth } from "@/lib/env-check";
import { isPostHogConfigured } from "@/lib/observability/posthog";
import { isSentryConfigured } from "@/lib/observability/sentry";
import { isStripeConfigured } from "@/lib/payments/stripe";
import { isSupabaseAdminConfigured } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";

/** Non-secret health flags for ops / demo preflight. */
export async function GET() {
  const h = await getEnvHealth();
  const backend = await backendHealth();
  return NextResponse.json({
    ok: true,
    database: h.databaseReachable,
    did: h.didClientKey,
    didEmbedReady: h.liveEmbeddedAgentReady,
    gemini: h.gemini,
    upstash: h.upstash,
    localDidProxy: process.env.DID_USE_LOCAL_PROXY === "1",
    personaAgentsConfigured: h.allPersonaAgentsConfigured,
    backend: backend.ok,
    backendDetail: backend.backend ?? { error: backend.error },
    auth: isSupabaseConfigured(),
    supabaseAdmin: isSupabaseAdminConfigured(),
    stripe: isStripeConfigured(),
    sentry: isSentryConfigured(),
    posthog: isPostHogConfigured(),
  });
}
