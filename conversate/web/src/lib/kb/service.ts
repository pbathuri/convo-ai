import type { Prisma } from "@prisma/client";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { type KbImportGovernance, validateKbImport } from "./policy";

export async function importKbChunks(opts: {
  source: KbImportGovernance & { sourceUrl?: string; captureMethod: string };
  documentTitle?: string;
  chunks: {
    content: string;
    personaId?: string;
    metadata?: Prisma.InputJsonValue;
  }[];
}) {
  const check = validateKbImport(opts.source);
  if (!check.ok) throw new Error(check.reason);

  if (!isDatabaseConfigured()) {
    return { imported: opts.chunks.length, mode: "dry-run" as const };
  }

  const source = await prisma.kbSource.create({
    data: {
      sourceUrl: opts.source.sourceUrl,
      sourceType: opts.source.sourceType,
      captureMethod: opts.source.captureMethod,
      licenseStatus: opts.source.licenseStatus ?? "unknown",
      robotsStatus: opts.source.robotsStatus ?? "not_checked",
      allowedUsage: opts.source.allowedUsage ?? "internal_only",
      piiStatus: opts.source.piiStatus ?? "not_checked",
      approvalStatus: "pending",
    },
  });

  const doc = await prisma.kbDocument.create({
    data: { sourceId: source.id, title: opts.documentTitle, rawText: null },
  });

  await prisma.kbChunk.createMany({
    data: opts.chunks.map((c) => ({
      documentId: doc.id,
      sourceId: source.id,
      personaId: c.personaId,
      content: c.content,
      metadata: c.metadata,
      approvalStatus: "pending",
    })),
  });

  return {
    imported: opts.chunks.length,
    sourceId: source.id,
    mode: "db" as const,
  };
}
