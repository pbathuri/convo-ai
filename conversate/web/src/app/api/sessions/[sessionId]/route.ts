import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession, updateSessionStatus } from "@/lib/sessions/service";

const patchSchema = z.object({
  status: z.enum([
    "created",
    "preflight",
    "connecting",
    "live",
    "ending",
    "completed",
    "failed",
    "abandoned",
  ]),
});

export async function GET(
  _req: Request,
  { params }: { params: { sessionId: string } },
) {
  const session = await getSession(params.sessionId);
  if (!session) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ session });
}

export async function PATCH(
  req: Request,
  { params }: { params: { sessionId: string } },
) {
  const json: unknown = await req.json();
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const session = await updateSessionStatus(params.sessionId, parsed.data.status);
  if (!session) {
    return NextResponse.json({ ok: true, local: true });
  }
  return NextResponse.json({ session });
}
