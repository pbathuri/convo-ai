import { prisma } from "@/lib/db";
import type { AuthUser } from "@/lib/auth/supabase";

const POLICY_VERSION = "v1";

/** Ensures a Prisma UserProfile exists for the Supabase auth user. */
export async function syncUserProfile(user: AuthUser): Promise<string> {
  const row = await prisma.userProfile.upsert({
    where: { email: user.email.toLowerCase() },
    update: {
      role: user.role,
    },
    create: {
      email: user.email.toLowerCase(),
      name: user.email.split("@")[0],
      role: user.role,
    },
  });

  await prisma.consent.upsert({
    where: {
      id: `consent-${row.id}-${POLICY_VERSION}`,
    },
    update: {},
    create: {
      id: `consent-${row.id}-${POLICY_VERSION}`,
      userId: row.id,
      policyVersion: POLICY_VERSION,
    },
  });

  return row.id;
}
