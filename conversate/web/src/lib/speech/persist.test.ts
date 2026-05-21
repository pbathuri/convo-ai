import { describe, expect, it } from "vitest";
import { isDuplicateSegment, shouldPersistSegment } from "./persist";
import type { SpeechSegment } from "./types";

const base: SpeechSegment = {
  id: "a1",
  text: "hello world",
  isFinal: true,
  provider: "browser",
  startedAt: 1000,
  endedAt: 2000,
};

describe("shouldPersistSegment", () => {
  it("only allows final non-empty", () => {
    expect(shouldPersistSegment({ ...base, isFinal: false })).toBe(false);
    expect(shouldPersistSegment({ ...base, text: "  " })).toBe(false);
    expect(shouldPersistSegment(base)).toBe(true);
  });
});

describe("isDuplicateSegment", () => {
  it("dedupes by id", () => {
    const seen = {
      ids: new Set<string>(),
      recent: [] as { text: string; at: number }[],
    };
    expect(isDuplicateSegment(base, seen)).toBe(false);
    seen.ids.add("a1");
    expect(isDuplicateSegment(base, seen)).toBe(true);
  });
});
