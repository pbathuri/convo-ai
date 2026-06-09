import { afterEach, describe, expect, it, vi } from "vitest";
import { trackConsoleEvent } from "./console-provider";

describe("trackConsoleEvent", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("no-ops when ANALYTICS_DEBUG is unset", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    trackConsoleEvent({ name: "session_start", properties: { id: "1" } });
    expect(spy).not.toHaveBeenCalled();
  });

  it("logs when ANALYTICS_DEBUG=1", () => {
    vi.stubEnv("ANALYTICS_DEBUG", "1");
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    trackConsoleEvent({ name: "session_start", properties: { id: "1" } });
    expect(spy).toHaveBeenCalledWith("[analytics]", "session_start", { id: "1" });
  });
});
