import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveAuthUser } from "@/lib/auth/supabase";
import { syncUserProfile } from "@/lib/auth/sync-profile";
import { isDatabaseConfigured } from "@/lib/db";
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

export async function GET(req: Request) {
  const authUser = await resolveAuthUser(req);
  const sessions = await listSessions(authUser?.id);
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
  const authUser = await resolveAuthUser(req);
  let userId = authUser?.id ?? parsed.data.userId;
  if (authUser && isDatabaseConfigured()) {
    userId = await syncUserProfile(authUser);
  }
  const session = await createSession({
    ...parsed.data,
    userId,
  });
  return NextResponse.json({ session }, { status: 201 });
}
