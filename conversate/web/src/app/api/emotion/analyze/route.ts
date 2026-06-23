import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeEmotionTraits } from "@/lib/emotion/analyzer";

const bodySchema = z.object({
  user_input: z.string().min(1).max(8000),
  goal: z.string().min(1).max(500),
  readiness_score: z.number().min(0).max(100).optional(),
});

export async function POST(req: Request) {
  const json: unknown = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const result = await analyzeEmotionTraits(parsed.data);
  return NextResponse.json({
    traits: result.traits,
    degraded: result.degraded,
    source: result.source,
  });
}
