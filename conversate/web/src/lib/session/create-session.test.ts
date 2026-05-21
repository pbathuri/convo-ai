import { afterEach, describe, expect, it, vi } from "vitest";
import { clearSessionInflight, getOrCreateSessionId } from "./create-session";

describe("getOrCreateSessionId", () => {
  afterEach(() => {
    clearSessionInflight("amazon-l5-bar-raiser");
    vi.restoreAllMocks();
  });

  it("reuses in-flight promise for same persona", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ session: { id: "sess-1" } }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const signal = new AbortController().signal;
    const [a, b] = await Promise.all([
      getOrCreateSessionId("amazon-l5-bar-raiser", signal),
      getOrCreateSessionId("amazon-l5-bar-raiser", signal),
    ]);

    expect(a).toBe("sess-1");
    expect(b).toBe("sess-1");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
