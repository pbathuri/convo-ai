import { describe, expect, it } from "vitest";
import { validateKbImport } from "./policy";

describe("validateKbImport", () => {
  it("rejects unknown license with internal_only", () => {
    const r = validateKbImport({
      sourceType: "blog",
      licenseStatus: "unknown",
      allowedUsage: "internal_only",
    });
    expect(r.ok).toBe(false);
  });

  it("accepts public rag_only", () => {
    const r = validateKbImport({
      sourceType: "blog",
      licenseStatus: "public",
      allowedUsage: "rag_only_no_display",
    });
    expect(r.ok).toBe(true);
  });
});
