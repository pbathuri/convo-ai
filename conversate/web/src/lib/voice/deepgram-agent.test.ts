import { describe, expect, it } from "vitest";
import {
  buildAgentSettingsMessage,
  DEEPGRAM_AGENT_WS,
} from "@/lib/voice/deepgram-agent";

describe("deepgram agent scaffold", () => {
  it("exposes websocket endpoint", () => {
    expect(DEEPGRAM_AGENT_WS).toContain("agent.deepgram.com");
  });

  it("serializes agent settings", () => {
    const msg = buildAgentSettingsMessage({ type: "Settings", agent: {} });
    expect(JSON.parse(msg)).toEqual({ type: "Settings", agent: {} });
  });
});
