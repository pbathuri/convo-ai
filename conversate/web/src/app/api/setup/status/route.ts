import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/auth/supabase";
import { isDatabaseConfigured } from "@/lib/db";
import { isSupabaseAdminConfigured } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";

/** Onboarding status for new Supabase project setup. */
export async function GET() {
  let databaseReachable = false;
  if (isDatabaseConfigured()) {
    try {
      const { prisma } = await import("@/lib/db");
      await prisma.$queryRaw`SELECT 1`;
      databaseReachable = true;
    } catch {
      databaseReachable = false;
    }
  }

  let personaCount = 0;
  if (databaseReachable) {
    try {
      const { prisma } = await import("@/lib/db");
      personaCount = await prisma.persona.count();
    } catch {
      personaCount = 0;
    }
  }

  const ready =
    isSupabaseConfigured() &&
    isSupabaseAdminConfigured() &&
    databaseReachable &&
    personaCount >= 5;

  return NextResponse.json({
    supabaseAuth: isSupabaseConfigured(),
    supabaseAdmin: isSupabaseAdminConfigured(),
    databaseConfigured: isDatabaseConfigured(),
    databaseReachable,
    personasSeeded: personaCount >= 5,
    personaCount,
    ready,
    nextSteps: ready
      ? []
      : [
          !isDatabaseConfigured()
            ? "Add DATABASE_URL and DIRECT_URL to .env.local"
            : null,
          isDatabaseConfigured() && !databaseReachable
            ? "Fix DATABASE_URL — connection failed"
            : null,
          databaseReachable && personaCount < 5
            ? "Run: npm run db:migrate && npm run db:seed"
            : null,
        ].filter(Boolean),
  });
}
