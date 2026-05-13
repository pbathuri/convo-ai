import { NextResponse } from "next/server";
import { z } from "zod";
import { type ChatTurn, generateChatReply } from "@/lib/llm";
import { getPersona, personaIdSchema } from "@/lib/personas";

const bodySchema = z.object({
  persona: personaIdSchema,
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(12000),
    }),
  ),
});

export async function POST(req: Request) {
  try {
    const json: unknown = await req.json();
    const { persona, history } = bodySchema.parse(json);
    const p = getPersona(persona);
    const label = p ? `${p.displayName} (${p.companyName})` : persona;
    const reply = await generateChatReply(label, history as ChatTurn[]);
    return NextResponse.json({ reply });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bad request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
