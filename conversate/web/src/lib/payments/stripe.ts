const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY?.trim();
const STRIPE_PUB = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();

export type SubscriptionTier = "free" | "pro" | "enterprise";

export function isStripeConfigured(): boolean {
  return Boolean(STRIPE_SECRET && STRIPE_PUB);
}

export function getTierLimits(tier: SubscriptionTier): {
  sessionsPerMonth: number;
  voiceMinutesPerMonth: number;
} {
  switch (tier) {
    case "pro":
      return { sessionsPerMonth: 50, voiceMinutesPerMonth: 300 };
    case "enterprise":
      return { sessionsPerMonth: 9999, voiceMinutesPerMonth: 9999 };
    default:
      return { sessionsPerMonth: 5, voiceMinutesPerMonth: 30 };
  }
}

export async function createCheckoutSession(_opts: {
  userId: string;
  tier: "pro";
}): Promise<{ url: string | null; degraded: boolean }> {
  if (!isStripeConfigured()) {
    return { url: null, degraded: true };
  }
  return { url: null, degraded: false };
}
