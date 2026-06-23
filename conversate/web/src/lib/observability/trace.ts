/** Langfuse-compatible trace seam (no-op when unkeyed). */

import { randomUUID } from "node:crypto";

type TracePayload = {
  name: string;
  input?: unknown;
  output?: unknown;
  metadata?: Record<string, unknown>;
  latencyMs?: number;
};

export async function traceLlmCall(payload: TracePayload): Promise<void> {
  const host = process.env.LANGFUSE_HOST?.replace(/\/$/, "");
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
  const secretKey = process.env.LANGFUSE_SECRET_KEY;
  if (!host || !publicKey || !secretKey) {
    if (process.env.ANALYTICS_DEBUG === "1") {
      console.info("[trace]", payload.name, payload.metadata);
    }
    return;
  }

  try {
    const auth = Buffer.from(`${publicKey}:${secretKey}`).toString("base64");
    await fetch(`${host}/api/public/ingestion`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        batch: [
          {
            type: "trace-create",
            id: randomUUID(),
            timestamp: new Date().toISOString(),
            body: {
              name: payload.name,
              input: payload.input,
              output: payload.output,
              metadata: {
                ...payload.metadata,
                latencyMs: payload.latencyMs,
              },
            },
          },
        ],
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    /* tracing must not break product flows */
  }
}
