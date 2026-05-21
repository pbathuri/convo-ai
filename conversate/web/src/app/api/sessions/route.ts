import { NextResponse } from "next/server";
import { z } from "zod";
import {
  difficultySchema,
  interviewModeSchema,
  personaIdSchema,
} from "@/lib/personas";
import { createSession, listSessions } from "@/lib/sessions/service";

const createSchema = z.object({
  personaId: personaIdSchema,
  userId: z.string().optional(),
  interviewMode: interviewModeSchema.optional(),
  difficulty: difficultySchema.optional(),
});

export async function GET() {
  const sessions = await listSessions();
  return NextResponse.json({ sessions });
}

export async function POST(req: Request) {
  const json: unknown = await req.json();
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const session = await createSession(parsed.data);
  return NextResponse.json({ session }, { status: 201 });
}
