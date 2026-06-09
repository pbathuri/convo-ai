import { describe, expect, it } from "vitest";
import { ADMIN_SCAFFOLD_PAGES } from "./scaffold-manifest";

describe("ADMIN_SCAFFOLD_PAGES", () => {
  it("lists all admin scaffold routes", () => {
    const paths = ADMIN_SCAFFOLD_PAGES.map((p) => p.path);
    expect(paths).toContain("/admin/kb");
    expect(paths).toContain("/admin/scraper-runs");
    expect(ADMIN_SCAFFOLD_PAGES.length).toBeGreaterThanOrEqual(5);
  });
});
