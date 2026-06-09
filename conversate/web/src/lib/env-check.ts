import {
  EMBEDDED_DID_AGENT_ID,
  PERSONAS,
  isPersonaLiveEmbedded,
} from "@/lib/personas";
import { isDatabaseConfigured } from "@/lib/db";

export type EnvHealth = {
  database: boolean;
  databaseReachable: boolean;
  didClientKey: boolean;
  gemini: boolean;
  upstash: boolean;
  personas: {
    id: string;
    agentConfigured: boolean;
    liveStatus: "live" | "in_progress";
  }[];
  allPersonaAgentsConfigured: boolean;
  liveEmbeddedAgentReady: boolean;
};

export async function getEnvHealth(): Promise<EnvHealth> {
  const database = isDatabaseConfigured();
  let databaseReachable = false;
  if (database) {
    try {
      const { prisma } = await import("@/lib/db");
      await prisma.$queryRaw`SELECT 1`;
      databaseReachable = true;
    } catch {
      databaseReachable = false;
    }
  }

  const personas = PERSONAS.map((p) => {
    const agentId = process.env[p.didAgentEnvKey] ?? "";
    const live = isPersonaLiveEmbedded(p.id);
    return {
      id: p.id,
      agentConfigured: live ? agentId.length > 0 : false,
      liveStatus: live ? ("live" as const) : ("in_progress" as const),
    };
  });

  const amazonEnv = process.env.DID_PERSONA_AMAZON_L5 ?? "";
  let liveEmbeddedAgentReady =
    amazonEnv === EMBEDDED_DID_AGENT_ID && amazonEnv.length > 0;
  if (liveEmbeddedAgentReady && amazonEnv) {
    const { resolveDidEmbedCredentials } = await import("@/lib/did/embed-config");
    const embed = await resolveDidEmbedCredentials(amazonEnv);
    liveEmbeddedAgentReady = embed.clientKey.startsWith("ck_");
  }

  return {
    database,
    databaseReachable,
    didClientKey: Boolean(process.env.NEXT_PUBLIC_DID_CLIENT_KEY?.trim()),
    gemini: Boolean(process.env.GOOGLE_AI_STUDIO_KEY?.trim()),
    upstash: Boolean(
      process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim(),
    ),
    personas,
    allPersonaAgentsConfigured: personas.every((p) => p.agentConfigured),
    liveEmbeddedAgentReady,
  };
}
