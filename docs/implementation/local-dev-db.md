# Local database setup

## Prerequisites

- PostgreSQL with `pgvector` (Supabase recommended)
- `DATABASE_URL` in `conversate/web/.env.local`

## Commands

```bash
cd conversate/web
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:studio   # optional GUI
```

## Seed contents

- 5 personas + rubrics
- Dev user `dev@conversate.local`
- Consent policy v1
- 3 sample sessions with messages and one score
- 1 approved KB source + 3 chunks

## Verify

- `/sessions` lists seeded sessions
- `/admin/personas` shows static table
- `/sessions/[id]` shows transcript + score
