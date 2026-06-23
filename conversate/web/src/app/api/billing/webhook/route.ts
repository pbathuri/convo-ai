import { NextResponse } from "next/server";
import { isStripeConfigured } from "@/lib/payments/stripe";

export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ received: true, degraded: true });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  // Production: stripe.webhooks.constructEvent with STRIPE_WEBHOOK_SECRET
  return NextResponse.json({ received: true });
}
