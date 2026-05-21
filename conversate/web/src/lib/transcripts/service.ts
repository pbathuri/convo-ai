import { isDatabaseConfigured, prisma } from "@/lib/db";

export type TranscriptMessage = {
  role: "user" | "agent" | "system";
  content: string;
  sequence?: number;
  provider?: string;
  metadata?: Record<string, unknown>;
};

export function normalizeTranscript(messages: TranscriptMessage[]): TranscriptMessage[] {
  return messages
    .map((m, i) => ({
      role: m.role,
      content: m.content.trim(),
      sequence: m.sequence ?? i,
    }))
    .filter((m) => m.content.length > 0);
}

export async function appendMessages(
  sessionId: string,
  messages: TranscriptMessage[],
): Promise<number> {
  if (!isDatabaseConfigured() || sessionId.startsWith("local-")) {
    return messages.length;
  }
  const normalized = normalizeTranscript(messages);
  const existing = await prisma.message.count({ where: { sessionId } });
  await prisma.message.createMany({
    data: normalized.map((m, i) => ({
      sessionId,
      role: m.role,
      content: m.content,
      sequence: existing + i,
    })),
  });
  return normalized.length;
}

export async function listMessages(sessionId: string) {
  if (!isDatabaseConfigured() || sessionId.startsWith("local-")) return [];
  return prisma.message.findMany({
    where: { sessionId },
    orderBy: { sequence: "asc" },
  });
}
