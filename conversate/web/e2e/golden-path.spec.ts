import { expect, test } from "@playwright/test";

test.describe("golden path smoke", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Conversate" })).toBeVisible();
  });

  test("personas page lists practice options", async ({ page }) => {
    await page.goto("/personas");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("pricing page shows tiers", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByRole("heading", { name: /practice like/i })).toBeVisible();
    await expect(page.getByText("Starter")).toBeVisible();
    await expect(page.getByText("Coming soon")).toBeVisible();
  });

  test("progress page shows insights", async ({ page }) => {
    await page.goto("/progress");
    await expect(
      page.getByRole("heading", { name: "Interview readiness", exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Communication radar")).toBeVisible();
  });

  test("health API returns ok", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  test("personas API returns five personas", async ({ request }) => {
    const res = await request.get("/api/personas");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.personas?.length).toBe(5);
  });

  test("skill-tree API returns domains", async ({ request }) => {
    const res = await request.get("/api/skill-tree");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(Object.keys(body.tree).length).toBeGreaterThan(0);
  });
});
