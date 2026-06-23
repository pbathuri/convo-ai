# Production deploy runbook

## Prerequisites

- Node 20+, Python 3.12+
- Postgres with `pgvector` (Supabase recommended)
- Optional: D-ID, Gemini, Stripe, Supabase Auth keys (see `NEEDS.md`)

## Local full stack

```bash
# Terminal 1 — backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Terminal 2 — web
cd conversate/web
cp .env.example .env.local
# fill DATABASE_URL, keys as available
npm ci
npm run dev
```

Or Docker:

```bash
docker compose up --build
```

## Verify before deploy

```bash
cd conversate/web && npm run verify
cd backend && pytest -q
cd conversate/web && npm run test:e2e  # requires build + start
```

## Vercel (frontend)

1. Import repo; set root to `conversate/web`
2. Add env vars from `.env.example`
3. Set `BACKEND_API_URL` to your FastAPI host (Railway/Fly)
4. Deploy — `vercel.json` included

## Backend (Railway / Fly / any container host)

1. Build from `backend/Dockerfile`
2. Set `CORS_ORIGINS` to your Vercel domain
3. Expose port 8000; health check `GET /health`

## Post-deploy smoke

```bash
curl https://YOUR_DOMAIN/api/health
curl https://YOUR_DOMAIN/api/personas
```

Chrome manual: `docs/implementation/demo-readiness-checklist.md`

## Rollback

- Vercel: promote previous deployment
- Backend: redeploy prior container image
- DB: Prisma migrations are forward-only; restore from backup if needed
