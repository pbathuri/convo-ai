import { describe, expect, it } from "vitest";
import {
  EMBEDDED_DID_AGENT_ID,
  getPersonaLiveStatus,
  isPersonaLiveEmbedded,
} from "@/lib/personas";

describe("persona live status", () => {
  it("only Amazon L5 is live embedded", () => {
    expect(isPersonaLiveEmbedded("amazon-l5-bar-raiser")).toBe(true);
    expect(getPersonaLiveStatus("amazon-l5-bar-raiser")).toBe("live");
    expect(getPersonaLiveStatus("google-l4-swe")).toBe("in_progress");
    expect(getPersonaLiveStatus("mckinsey-em-behavioral")).toBe("in_progress");
  });

  it("embedded agent id matches Studio share link", () => {
    expect(EMBEDDED_DID_AGENT_ID).toBe("v2_agt_4pjSCal7");
  });
});
