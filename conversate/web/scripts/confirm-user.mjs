import pg from "pg";

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/confirm-user.mjs <email>");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
const list = await client.query(
  "SELECT id, email, email_confirmed_at FROM auth.users WHERE email = $1",
  [email],
);
console.log("before:", list.rows);
const updated = await client.query(
  `UPDATE auth.users
   SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
   WHERE email = $1
   RETURNING id, email, email_confirmed_at`,
  [email],
);
console.log("after:", updated.rows);
await client.end();
