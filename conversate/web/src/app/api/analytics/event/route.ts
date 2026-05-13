import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { AnalyticsEvent } from "@/lib/analytics/types";
import { getServerEnv } from "@/lib/env";

export const dynamic = "force-dynamic";
const eventSchema = z.object({
  name: z.string(),
  payload: z.record(z.string(), z.unknown()).optional(),
  ts: z.string(),
});

export async function POST(req: Request) {
  const json: unknown = await req.json();
  const parsed = eventSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const event = parsed.data as AnalyticsEvent;
  const env = getServerEnv();
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
    await redis.lpush("analytics:events", JSON.stringify(event));
    await redis.ltrim("analytics:events", 0, 999);
  }
  return NextResponse.json({ ok: true });
}
