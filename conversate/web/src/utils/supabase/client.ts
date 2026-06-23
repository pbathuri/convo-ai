import { createBrowserClient } from "@supabase/ssr";

function getSupabaseKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
}

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = getSupabaseKey();
  if (!url || !key) {
    throw new Error("Supabase env not configured");
  }
  return createBrowserClient(url, key);
};
