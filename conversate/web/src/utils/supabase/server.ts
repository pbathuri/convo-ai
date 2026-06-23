import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getSupabaseKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
}

export function getSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
}

export function isSupabaseEnvConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseKey());
}

export const createClient = (
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) => {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  if (!url || !key) {
    throw new Error("Supabase env not configured");
  }
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Component — middleware refreshes session.
        }
      },
    },
  });
};
