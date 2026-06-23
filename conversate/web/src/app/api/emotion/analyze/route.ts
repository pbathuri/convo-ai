import { NextResponse } from "next/server";
import { z } from "zod";
import { emotionFromReadiness } from "@/lib/emotion/schema";
import { backendPost } from "@/lib/backend/client";

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

  try {
    await backendPost("/emotion/prompt", {
      user_input: parsed.data.user_input,
      goal: parsed.data.goal,
    });
  } catch {
    // backend optional
  }

  const traits = emotionFromReadiness(
    parsed.data.readiness_score ?? 65,
  );
  return NextResponse.json({ traits, degraded: true });
}
