import { NextResponse } from "next/server";
import { z } from "zod";
import { generateOpeningLine } from "@/lib/llm";
import { personaLabel, personaSlugSchema } from "@/lib/personas";

const bodySchema = z.object({
  persona: personaSlugSchema,
});

export async function POST(req: Request) {
  try {
    const json: unknown = await req.json();
    const { persona } = bodySchema.parse(json);
    const line = await generateOpeningLine(personaLabel(persona));
    return NextResponse.json({ openingLine: line });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bad request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
