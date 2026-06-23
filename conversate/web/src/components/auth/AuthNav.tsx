"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function AuthNav() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setEmail(null);
    router.push("/");
    router.refresh();
  }

  if (!email) {
    return (
      <Link href="/auth/login" className="hover:text-foreground">
        Sign in
      </Link>
    );
  }

  return (
    <span className="flex items-center gap-2">
      <span className="hidden sm:inline text-xs text-muted-foreground truncate max-w-[120px]">
        {email}
      </span>
      <button
        type="button"
        onClick={() => void signOut()}
        className="hover:text-foreground"
      >
        Sign out
      </button>
    </span>
  );
}
