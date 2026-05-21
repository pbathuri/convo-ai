import { NextResponse } from "next/server";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export type AdminIdentity = { email: string; userId?: string };

/**
 * Resolves admin from x-admin-email header (dev) or future Supabase session.
 * Production: wire Supabase getUser() here.
 */
export async function resolveAdmin(req: Request): Promise<AdminIdentity | null> {
  const email = req.headers.get("x-admin-email")?.trim().toLowerCase();
  if (!email || !ADMIN_EMAILS.includes(email)) return null;
  return { email };
}

export async function requireAdmin(req: Request): Promise<AdminIdentity | NextResponse> {
  const admin = await resolveAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return admin;
}

export function isAdminResponse(
  result: AdminIdentity | NextResponse,
): result is NextResponse {
  return result instanceof NextResponse;
}
