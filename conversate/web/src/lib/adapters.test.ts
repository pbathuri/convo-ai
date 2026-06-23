import { describe, expect, it } from "vitest";
import { isSupabaseConfigured } from "@/lib/auth/supabase";
import { getTierLimits, isStripeConfigured } from "@/lib/payments/stripe";

describe("auth adapter", () => {
  it("reports unconfigured without env", () => {
    expect(isSupabaseConfigured()).toBe(false);
  });
});

describe("stripe adapter", () => {
  it("reports unconfigured without env", () => {
    expect(isStripeConfigured()).toBe(false);
  });

  it("returns free tier limits", () => {
    expect(getTierLimits("free").sessionsPerMonth).toBe(5);
    expect(getTierLimits("pro").sessionsPerMonth).toBe(50);
  });
});
