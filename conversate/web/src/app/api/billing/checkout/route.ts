import { NextResponse } from "next/server";
import { resolveAuthUser } from "@/lib/auth/supabase";
import {
  createCheckoutSession,
  getTierLimits,
  isStripeConfigured,
  type SubscriptionTier,
} from "@/lib/payments/stripe";

export async function GET() {
  const tier: SubscriptionTier = "free";
  return NextResponse.json({
    configured: isStripeConfigured(),
    tier,
    limits: getTierLimits(tier),
  });
}

export async function POST(req: Request) {
  const user = await resolveAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const tier = body?.tier === "pro" ? "pro" : "pro";
  const result = await createCheckoutSession({ userId: user.id, tier });

  if (result.degraded) {
    return NextResponse.json(
      {
        error: "Billing not configured",
        degraded: true,
        limits: getTierLimits("free"),
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ url: result.url });
}
