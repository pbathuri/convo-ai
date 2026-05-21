import type { Prisma } from "@prisma/client";
import { isDatabaseConfigured, prisma } from "@/lib/db";

export async function writeAuditLog(opts: {
  actorId?: string;
  action: string;
  target?: string;
  diff?: Prisma.InputJsonValue;
}): Promise<void> {
  if (!isDatabaseConfigured()) return;
  await prisma.auditLog.create({
    data: {
      actorId: opts.actorId,
      action: opts.action,
      target: opts.target,
      diff: opts.diff,
    },
  });
}
