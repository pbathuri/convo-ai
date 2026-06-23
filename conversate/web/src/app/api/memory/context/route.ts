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
});

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const json: unknown = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const data = await backendPost<{ context: string }>("/memory/context", parsed.data);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      {
        context: "",
        degraded: true,
        error: e instanceof Error ? e.message : "memory service unavailable",
      },
      { status: 503 },
    );
  }
}
