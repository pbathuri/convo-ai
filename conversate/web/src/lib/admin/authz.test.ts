import { NextResponse } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { requireAdmin } from "./authz";

describe("requireAdmin", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("blocks header auth in production without Supabase session", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ADMIN_EMAILS", "admin@test.com");
    const req = new Request("http://localhost", {
      headers: { "x-admin-email": "admin@test.com" },
    });
    const result = await requireAdmin(req);
    expect(result).toBeInstanceOf(NextResponse);
    if (result instanceof NextResponse) {
      expect(result.status).toBe(403);
    }
  });

  it("allows matching header in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("ADMIN_EMAILS", "admin@test.com");
    const req = new Request("http://localhost", {
      headers: { "x-admin-email": "admin@test.com" },
    });
    const result = await requireAdmin(req);
    expect(result).not.toBeInstanceOf(NextResponse);
    expect(result).toEqual({ email: "admin@test.com" });
  });
});
