# Deployment plan

## Environments

| Env | Hosting | DB |
|-----|---------|-----|
| local | `next dev` | Supabase dev or Docker Postgres + pgvector |
| staging | Vercel preview | Supabase staging |
| production | Vercel prod | Supabase prod |

## Env vars

- `DATABASE_URL`, `NEXT_PUBLIC_DID_CLIENT_KEY`, `DID_PERSONA_*`
- `GOOGLE_AI_STUDIO_KEY`, `UPSTASH_*`, `ADMIN_EMAILS`
- `DID_DAILY_MINUTE_BUDGET`, `SESSION_COOKIE_SECRET`

## Checklist before alpha

1. Enable pgvector on Supabase
2. D-ID Studio domain allowlist for staging + prod URLs
3. Run migrations + seed on staging
4. Secret rotation runbook documented
5. Rollback: redeploy previous Vercel deployment; KB revert via `KbVersion`
