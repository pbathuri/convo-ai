import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/lib/admin/audit";
import { isAdminResponse, requireAdmin } from "@/lib/admin/authz";
import { importKbChunks } from "@/lib/kb/service";

const schema = z.object({
  source: z.object({
    sourceUrl: z.string().optional(),
    sourceType: z.string(),
    captureMethod: z.string(),
    licenseStatus: z.string().optional(),
    robotsStatus: z.string().optional(),
    allowedUsage: z.string().optional(),
    piiStatus: z.string().optional(),
  }),
  documentTitle: z.string().optional(),
  chunks: z.array(
    z.object({
      content: z.string().min(1),
      personaId: z.string().optional(),
      metadata: z.record(z.string(), z.unknown()).optional(),
    }),
  ),
});

export async function POST(req: Request) {
  const admin = await requireAdmin(req);
  if (isAdminResponse(admin)) return admin;

  const json: unknown = await req.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const result = await importKbChunks({
      source: parsed.data.source as Parameters<
        typeof importKbChunks
      >[0]["source"],
      documentTitle: parsed.data.documentTitle,
      chunks: parsed.data.chunks.map((c) => ({
        ...c,
        metadata: c.metadata as Prisma.InputJsonValue | undefined,
      })),
    });
    await writeAuditLog({
      action: "kb.import",
      target: result.sourceId ?? "dry-run",
      diff: { count: result.imported },
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 422 },
    );
  }
}
