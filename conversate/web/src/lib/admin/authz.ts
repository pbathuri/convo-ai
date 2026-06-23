import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/supabase";

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export type AdminIdentity = { email: string; userId?: string };

/**
 * Resolves admin from Supabase session or dev x-admin-email header.
 */
export async function resolveAdmin(
  req: Request,
): Promise<AdminIdentity | null> {
  const sessionUser = await getAuthUser();
  if (sessionUser?.role === "admin") {
    return { email: sessionUser.email, userId: sessionUser.id };
  }

  if (process.env.NODE_ENV === "development") {
    const email = req.headers.get("x-admin-email")?.trim().toLowerCase();
    if (email && getAdminEmails().includes(email)) {
      return { email };
    }
  }
  return null;
}

export async function requireAdmin(
  req: Request,
): Promise<AdminIdentity | NextResponse> {
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
          "Forbidden. Sign in with an admin account or use x-admin-email in development.",
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
