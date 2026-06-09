import { describe, expect, it, vi } from "vitest";
import { resolveDidAgentApiUrl } from "./agent-url";

describe("resolveDidAgentApiUrl", () => {
  it("uses D-ID API by default", () => {
    expect(resolveDidAgentApiUrl("agt_123")).toBe(
      "https://api.d-id.com/agents/agt_123",
    );
  });

  it("uses local proxy when DID_USE_LOCAL_PROXY=1", () => {
    vi.stubEnv("DID_USE_LOCAL_PROXY", "1");
    expect(resolveDidAgentApiUrl("agt_123", "http://localhost:3000")).toBe(
      "http://localhost:3000/api/did/agent/agt_123",
    );
  });
});
