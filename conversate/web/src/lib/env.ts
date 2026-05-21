import { z } from "zod";

const emptyToUndefined = (v: unknown) =>
  v === "" || v === undefined ? undefined : v;

const serverSchema = z.object({
  GOOGLE_AI_STUDIO_KEY: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.preprocess(
    emptyToUndefined,
    z.string().url().optional(),
  ),
  UPSTASH_REDIS_REST_TOKEN: z.preprocess(
    emptyToUndefined,
    z.string().optional(),
  ),
  DID_DAILY_MINUTE_BUDGET: z.coerce.number().optional(),
  SESSION_COOKIE_SECRET: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;

export function getServerEnv(): ServerEnv {
  return serverSchema.parse({
    GOOGLE_AI_STUDIO_KEY: process.env.GOOGLE_AI_STUDIO_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    DID_DAILY_MINUTE_BUDGET: process.env.DID_DAILY_MINUTE_BUDGET,
    SESSION_COOKIE_SECRET: process.env.SESSION_COOKIE_SECRET,
  });
}
