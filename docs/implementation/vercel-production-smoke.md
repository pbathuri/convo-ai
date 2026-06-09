# Vercel production smoke

Run after deploying `conversate/web` (root directory) to Vercel.

## Vercel project settings

| Setting | Value |
|---------|--------|
| Root Directory | `conversate/web` |
| Framework | Next.js |
| Build | `prisma generate && npm run build` (see `vercel.json`) |

## Environment variables

Copy from [conversate/web/.env.example](../../conversate/web/.env.example). Required for golden path:

- `DATABASE_URL`, `DIRECT_URL` (Supabase)
- `NEXT_PUBLIC_DID_CLIENT_KEY`
- `DID_PERSONA_AMAZON_L5`, `DID_PERSONA_GOOGLE_L4`, `DID_PERSONA_MCKINSEY_EM`, `DID_PERSONA_GOLDMAN_VP`, `DID_PERSONA_MSFT_PM`
- `SESSION_COOKIE_SECRET` (recommended)

Optional: `GOOGLE_AI_STUDIO_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `ADMIN_EMAILS`

## D-ID domain allowlist (manual)

In D-ID Studio, allowlist these origins for your embed client key:

- `https://web-delta-three-73.vercel.app` (current production alias)
- `https://web-mxglcqmx1-pbathuris-projects.vercel.app` (deployment URL)
- Any new preview/production URLs from `vercel deploy`
- Custom domain if configured in Vercel project settings

Without this, live avatar fails; **Continue transcript-only interview** still works.

## Database (one-time)

This repo uses `prisma/schema.prisma` without a `prisma/migrations` folder. If Supabase already has tables (P3005), skip `migrate deploy` and use:

```bash
cd conversate/web
npx prisma db seed   # personas/rubrics when empty
```

For a fresh empty database: `npx prisma db push` then seed.

## API smoke (replace `BASE` with your Vercel URL)

```bash
BASE=https://your-app.vercel.app

curl -s "$BASE/api/health" | jq .
curl -s "$BASE/api/personas" | jq '.personas[] | {id, agentId: (.agentId | length > 0)}'
curl -s "$BASE/api/llm/status" | jq .
curl -s "$BASE/api/redis/ping" | jq .
```

**Health `ok: true` requires:** `didClientKey`, all persona `agentConfigured`, and DB reachable if `DATABASE_URL` is set.

## Chrome golden path

1. **Home** (`/`) — dashboard, recent activity, **Start live interview**
2. **Practice** (`/personas`) — search/filter, **Enter room**
3. **Live room** (`/chat?persona=amazon-l5-bar-raiser`) — D-ID connects within ~15s OR transcript-only fallback; speak one answer; end session
4. **Sessions** (`/sessions`) — session listed with transcript
5. **Session detail** — **Generate score**; coaching report (Gemini or degraded banner)
6. **Insights** (`/progress`) — KPIs and readiness trend update (not all zeros when DB live)

**Success:** one complete interview in under ~5 minutes (excluding optional Gemini cold start); no infinite spinners.

## Local preflight

```bash
cd conversate/web
npm run verify
curl -s http://localhost:3000/api/health | jq .
```
