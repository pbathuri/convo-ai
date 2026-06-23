# Supabase project: vtbkmccoarhfzgosahqa

**Project URL:** https://vtbkmccoarhfzgosahqa.supabase.co  
**MCP:** `https://mcp.supabase.com/mcp?project_ref=vtbkmccoarhfzgosahqa`

## 1. Auth keys (Dashboard → Project Settings → API)

```env
NEXT_PUBLIC_SUPABASE_URL=https://vtbkmccoarhfzgosahqa.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...   # server-only, never NEXT_PUBLIC_
```

## 2. Database (Dashboard → Project Settings → Database)

Enable **pgvector** extension (SQL editor):

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Connection strings → add to `.env.local`:

```env
# Transaction pooler (Prisma queries)
DATABASE_URL=postgresql://postgres.vtbkmccoarhfzgosahqa:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true

# Session pooler (migrations) — copy host from Dashboard if it differs
DIRECT_URL=postgresql://postgres.vtbkmccoarhfzgosahqa:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

Replace region/host if your project uses a different pooler host (shown in Supabase UI).

## 3. Bootstrap schema

```bash
cd conversate/web
npm run db:migrate   # applies prisma/migrations
npm run db:seed      # personas + demo session
```

## 4. Auth redirect URLs (Authentication → URL Configuration)

- Site URL: `http://localhost:3000` (dev) or your Vercel URL
- Redirect URLs: `http://localhost:3000/auth/callback`, `https://YOUR_DOMAIN/auth/callback`

**Login blocked with “Email not confirmed”?**

1. Click the confirmation link Supabase emails after sign-up, **or**
2. Dashboard → Authentication → Providers → Email → disable “Confirm email” for faster dev, **or**
3. Run (dev only, with `DIRECT_URL` in `.env`):

```bash
node scripts/confirm-user.mjs your@email.com
```

## 5. Admin

Set `ADMIN_EMAILS=your@email.com` in `.env.local` — that Supabase user gets admin role in app.
