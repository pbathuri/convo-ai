import { NextResponse } from "next/server";
import { backendPost } from "@/lib/backend/client";
import { captureException } from "@/lib/observability/sentry";

export const dynamic = "force-dynamic";

type PromptBody = {
  module: string;
  subdomain: string;
  user_input: string;
  goal?: string;
  memory?: string;
  traits?: string;
};

/** Proxy domain coaching prompts to FastAPI engine. */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PromptBody;
    if (!body.module || !body.subdomain || !body.user_input?.trim()) {
      return NextResponse.json(
        { error: "module, subdomain, user_input required" },
        { status: 400 },
      );
    }
    const result = await backendPost<Record<string, unknown>>(
      "/domains/prompt",
      body,
    );
    return NextResponse.json(result);
  } catch (e) {
    captureException(e, { route: "domains-prompt" });
    return NextResponse.json(
      { error: "Domain prompt service unavailable", degraded: true },
      { status: 503 },
    );
  }
}
