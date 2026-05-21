import { NextResponse } from "next/server";

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export type AdminIdentity = { email: string; userId?: string };

function isDevHeaderAuthAllowed(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Resolves admin from x-admin-email header (development only) or future Supabase session.
 */
export async function resolveAdmin(
  req: Request,
): Promise<AdminIdentity | null> {
  if (!isDevHeaderAuthAllowed()) {
    // Production: wire Supabase getUser() / session cookie here.
    return null;
  }
  const email = req.headers.get("x-admin-email")?.trim().toLowerCase();
  if (!email || !getAdminEmails().includes(email)) return null;
  return { email };
}

export async function requireAdmin(
  req: Request,
): Promise<AdminIdentity | NextResponse> {
  if (!isDevHeaderAuthAllowed()) {
    return NextResponse.json(
      {
        error:
          "Admin authentication required. Configure production session auth (e.g. Supabase) — header-based admin is disabled outside development.",
      },
      { status: 401 },
    );
  }
  if (getAdminEmails().length === 0) {
    return NextResponse.json(
      { error: "ADMIN_EMAILS is not configured on the server." },
      { status: 403 },
    );
  }
  const admin = await resolveAdmin(req);
  if (!admin) {
    return NextResponse.json(
      {
        error:
          "Forbidden. In development, send a matching x-admin-email header for an address listed in ADMIN_EMAILS.",
      },
      { status: 403 },
    );
  }
  return admin;
}

export function isAdminResponse(
  result: AdminIdentity | NextResponse,
): result is NextResponse {
  return result instanceof NextResponse;
}
