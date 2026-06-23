"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function CheckoutButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": "dev@conversate.local",
        },
        body: JSON.stringify({ tier: "pro" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error ?? "Checkout unavailable — configure Stripe in NEEDS.md");
    } catch {
      setError("Checkout request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onCheckout}
        disabled={loading}
        className={cn(
          "inline-flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition",
          "bg-[var(--sakura-plum)] text-[var(--sakura-petal-50)] shadow-md hover:opacity-90 disabled:opacity-50",
          className,
        )}
      >
        {loading ? "Loading…" : children}
      </button>
      {error ? (
        <p className="text-xs text-amber-700">{error}</p>
      ) : null}
    </div>
  );
}
