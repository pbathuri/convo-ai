import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";

export const dynamic = "force-dynamic";
export async function GET() {
  const env = getServerEnv();
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    return NextResponse.json({
      ok: true,
      redis: "skipped",
      reason: "not_configured",
    });
  }
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });
  const pong = await redis.ping();
  return NextResponse.json({ ok: true, redis: pong });
}
