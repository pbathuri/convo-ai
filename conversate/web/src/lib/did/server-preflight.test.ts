import { describe, expect, it, vi, afterEach } from "vitest";
import { resolveDidAgentApiUrl } from "./agent-url";

describe("resolveDidAgentApiUrl with server origin", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses local proxy when env set and origin provided", () => {
    vi.stubEnv("DID_USE_LOCAL_PROXY", "1");
    expect(resolveDidAgentApiUrl("agt_x", "https://app.example.com")).toBe(
      "https://app.example.com/api/did/agent/agt_x",
    );
  });
});
