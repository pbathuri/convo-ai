import { describe, expect, it } from "vitest";
import { extractLastUserUtterance } from "./analyzer";

describe("extractLastUserUtterance", () => {
  it("returns last user line from transcript", () => {
    const t = "user: hello\nagent: hi\nuser: I led a migration";
    expect(extractLastUserUtterance(t)).toBe("I led a migration");
  });

  it("falls back to last line when no user prefix", () => {
    expect(extractLastUserUtterance("only one line")).toBe("only one line");
  });
});
