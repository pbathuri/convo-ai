import { describe, expect, it } from "vitest";
import {
  DID_CONNECT_TIMEOUT_MS,
  interviewPhaseLabel,
  SESSION_CREATE_TIMEOUT_MS,
} from "./interview-phase";

describe("interview-phase", () => {
  it("uses 8s session budget", () => {
    expect(SESSION_CREATE_TIMEOUT_MS).toBe(8000);
  });

  it("uses 15s D-ID connect budget", () => {
    expect(DID_CONNECT_TIMEOUT_MS).toBe(15000);
  });

  it("labels transcript_only", () => {
    expect(interviewPhaseLabel("transcript_only")).toBe(
      "Transcript-only interview",
    );
  });
});
