import { cookies } from "next/headers";
import {
  createClient,
  isSupabaseEnvConfigured,
} from "@/utils/supabase/server";

export type AuthUser = {
  id: string;
  email: string;
  role: "candidate" | "admin";
};

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isSupabaseConfigured(): boolean {
  return isSupabaseEnvConfigured();
}

function roleForEmail(email: string): AuthUser["role"] {
  return getAdminEmails().includes(email.toLowerCase()) ? "admin" : "candidate";
}

/** Server-side session from Supabase cookies. */
export async function getAuthUser(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;
  return {
    id: user.id,
    email: user.email,
    role: roleForEmail(user.email),
  };
}

/**
 * Resolves user from Supabase session or dev x-user-email header.
 */
export async function resolveAuthUser(req: Request): Promise<AuthUser | null> {
  const fromSession = await getAuthUser();
  if (fromSession) return fromSession;

  if (process.env.NODE_ENV === "development") {
    const email = req.headers.get("x-user-email")?.trim();
    if (!email) return null;
    return { id: `dev-${email}`, email, role: roleForEmail(email) };
  }
  return null;
}

export async function requireAuth(
  req: Request,
): Promise<AuthUser | Response> {
  const user = await resolveAuthUser(req);
  if (!user) {
    return new Response(
      JSON.stringify({
        error: isSupabaseConfigured()
          ? "Authentication required — sign in at /auth/login"
          : "Auth not configured",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }
  return user;
}

export function isAuthResponse(
  result: AuthUser | Response,
): result is Response {
  return result instanceof Response;
}
