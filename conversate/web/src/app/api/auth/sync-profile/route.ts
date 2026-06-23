import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/supabase";
import { syncUserProfile } from "@/lib/auth/sync-profile";
import { isDatabaseConfigured } from "@/lib/db";

export async function POST() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "DATABASE_URL not configured", degraded: true },
      { status: 503 },
    );
  }
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const profileId = await syncUserProfile(user);
  return NextResponse.json({ profileId, email: user.email, role: user.role });
}
