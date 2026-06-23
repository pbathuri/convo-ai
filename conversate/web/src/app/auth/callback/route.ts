import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/auth/supabase";
import { syncUserProfile } from "@/lib/auth/sync-profile";
import { isDatabaseConfigured } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/personas";

  if (code) {
    const supabase = createClient(await cookies());
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (isDatabaseConfigured()) {
        const user = await getAuthUser();
        if (user) {
          await syncUserProfile(user);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback`);
}
