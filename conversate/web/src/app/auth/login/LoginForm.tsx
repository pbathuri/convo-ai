"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SakuraPageShell } from "@/components/ui/sakura";
import { createClient } from "@/utils/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"sign_in" | "sign_up" | "magic">("sign_in");
  const [message, setMessage] = useState<string | null>(
    params.get("error") ? "Sign-in failed. Try again." : null,
  );
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function resetPassword() {
    if (!email.trim()) {
      setMessage("Enter your email first.");
      return;
    }
    setResending(true);
    setMessage(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/login`,
      });
      if (error) throw error;
      setMessage("Password reset email sent — check your inbox.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not send reset email");
    } finally {
      setResending(false);
    }
  }

  async function resendConfirmation() {
    if (!email.trim()) {
      setMessage("Enter your email first.");
      return;
    }
    setResending(true);
    setMessage(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setMessage("Confirmation email sent — check your inbox.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not resend email");
    } finally {
      setResending(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const supabase = createClient();
      if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage("Magic link sent — check your email.");
      } else if (mode === "sign_up") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage("Check your email to confirm your account.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          if (error.message.toLowerCase().includes("email not confirmed")) {
            throw new Error(
              "Email not confirmed — check your inbox for the confirmation link, or use “Resend confirmation” below.",
            );
          }
          throw error;
        }
        if (!data.session) throw new Error("Sign-in failed — no session returned.");
        await fetch("/api/auth/sync-profile", { method: "POST" });
        router.push("/personas");
        router.refresh();
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SakuraPageShell className="mx-auto max-w-md space-y-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--sakura-plum)]">
          Sign in to Conversate
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Practice interviews with saved sessions and progress.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--sakura-glass-border)] bg-white/80 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            type="password"
            required={mode !== "magic"}
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--sakura-glass-border)] bg-white/80 px-3 py-2"
            disabled={mode === "magic"}
          />
        </label>
        {message ? (
          <p className="text-sm text-amber-700">{message}</p>
        ) : null}
        {message?.toLowerCase().includes("not confirmed") ? (
          <button
            type="button"
            disabled={resending}
            onClick={() => void resendConfirmation()}
            className="text-sm text-[var(--sakura-petal-500)] hover:underline disabled:opacity-50"
          >
            {resending ? "Sending…" : "Resend confirmation email"}
          </button>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--sakura-plum)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading
            ? "Working…"
            : mode === "magic"
              ? "Email magic link"
              : mode === "sign_in"
                ? "Sign in"
                : "Create account"}
        </button>
      </form>

      <div className="flex flex-wrap gap-3 text-sm">
        <button
          type="button"
          className="text-[var(--sakura-petal-500)] hover:underline"
          onClick={() => setMode(mode === "magic" ? "sign_in" : "magic")}
        >
          {mode === "magic" ? "Use password instead" : "Email magic link"}
        </button>
        <button
          type="button"
          className="text-[var(--sakura-petal-500)] hover:underline"
          onClick={() =>
            setMode((m) => (m === "sign_up" ? "sign_in" : "sign_up"))
          }
        >
          {mode === "sign_up"
            ? "Already have an account? Sign in"
            : "Need an account? Sign up"}
        </button>
        {mode === "sign_in" ? (
          <button
            type="button"
            disabled={resending}
            className="text-[var(--sakura-petal-500)] hover:underline disabled:opacity-50"
            onClick={() => void resetPassword()}
          >
            Forgot password?
          </button>
        ) : null}
      </div>

      <Link
        href="/"
        className="block text-sm text-muted-foreground hover:underline"
      >
        ← Back home
      </Link>
    </SakuraPageShell>
  );
}
