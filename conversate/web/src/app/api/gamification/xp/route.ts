import { NextResponse } from "next/server";
import { backendPost } from "@/lib/backend/client";
import { captureException } from "@/lib/observability/sentry";

export const dynamic = "force-dynamic";

/** Proxy to FastAPI gamification engine (XP from session score). */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const score = Number(body?.score);
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      return NextResponse.json({ error: "score 0-100 required" }, { status: 400 });
    }
    const result = await backendPost<{ xp: number }>("/gamification/xp", {
      score,
    });
    return NextResponse.json(result);
  } catch (e) {
    captureException(e, { route: "gamification" });
    return NextResponse.json(
      { error: "gamification service unavailable", degraded: true },
      { status: 503 },
    );
  }
}
