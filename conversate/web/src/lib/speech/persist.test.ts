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
  it("dedupes same text within 5 seconds", () => {
    const seen = {
      ids: new Set<string>(),
      recent: [{ text: "hello world", at: 1000 }],
    };
    const dup: SpeechSegment = {
      ...base,
      id: "a2",
      endedAt: new Date(4500).toISOString(),
    };
    expect(isDuplicateSegment(dup, seen)).toBe(true);
  });

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
