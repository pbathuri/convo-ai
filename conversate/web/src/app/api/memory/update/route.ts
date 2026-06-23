import { NextResponse } from "next/server";
import { z } from "zod";
import { backendPost } from "@/lib/backend/client";

const turnSchema = z.object({
  user: z.string(),
  ai: z.string(),
  tone: z.string().optional(),
  score: z.number().optional(),
  feedback: z.string().optional(),
});

const bodySchema = z.object({
  memory: z.array(turnSchema).default([]),
  user_input: z.string(),
  ai_response: z.string(),
  tone: z.string().optional(),
  score: z.number().optional(),
  feedback: z.string().optional(),
});

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const json: unknown = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const data = await backendPost<{ memory: unknown[] }>("/memory/update", parsed.data);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "memory service unavailable",
        degraded: true,
      },
      { status: 503 },
    );
  }
}
