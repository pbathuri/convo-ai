import { NextResponse } from "next/server";
import { z } from "zod";
import { appendMessages } from "@/lib/transcripts/service";

const bodySchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "agent", "system"]),
      content: z.string().min(1),
      sequence: z.number().int().optional(),
    }),
  ),
});

export async function POST(
  req: Request,
  { params }: { params: { sessionId: string } },
) {
  const json: unknown = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const count = await appendMessages(params.sessionId, parsed.data.messages);
  return NextResponse.json({ appended: count });
}
