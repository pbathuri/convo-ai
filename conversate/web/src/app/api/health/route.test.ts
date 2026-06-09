import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("returns non-secret service flags", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body).toHaveProperty("database");
    expect(body).toHaveProperty("gemini");
    expect(body).toHaveProperty("localDidProxy");
    expect(body).not.toHaveProperty("GOOGLE_AI_STUDIO_KEY");
  });
});
