import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/supabase";
import { sendWelcomeEmail } from "@/lib/email/resend";

const bodySchema = z.object({
  name: z.string().optional(),
});

export async function POST(req: Request) {
  const user = await requireAuth(req);
  if (user instanceof Response) return user;

  const body = bodySchema.safeParse(await req.json().catch(() => ({})));
  const result = await sendWelcomeEmail({
    to: user.email,
    name: body.success ? body.data.name : undefined,
  });

  if (!result.ok && result.degraded) {
    return NextResponse.json({ ...result }, { status: 503 });
  }
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
