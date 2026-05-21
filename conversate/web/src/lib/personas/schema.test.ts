import { describe, expect, it } from "vitest";
import { personaIdSchema } from "../personas";

describe("personaIdSchema", () => {
  it("accepts known persona ids", () => {
    expect(personaIdSchema.safeParse("amazon-l5-bar-raiser").success).toBe(
      true,
    );
  });

  it("rejects unknown ids", () => {
    expect(personaIdSchema.safeParse("not-a-persona").success).toBe(false);
  });
});
