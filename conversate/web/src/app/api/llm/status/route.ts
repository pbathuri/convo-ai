import { NextResponse } from "next/server";

/** DORMANT — reserved for V2 Gemini / webhook override. V1 uses D-ID Agents only. */
export function GET() {
  return NextResponse.json({
    mode: "v1",
    llmRoute: "dormant",
    detail: "Persona brain runs in D-ID Studio (GPT-4.1). See src/lib/llm.ts for future server-side LLM.",
  });
}
