import { NextResponse } from "next/server";

// SCAFFOLD: Replace with database/auth

export async function GET() {
  return NextResponse.json({
    name: "User",
    xp: 420,
    streak: 7,
    daily_goal: 10,
    daily_progress: 6,
    level: 5,
    domain: "business_communication",
    subdomain: "negotiation",
  });
}

// SCAFFOLD: persist profile to database
export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({ ok: true, received: body });
}
