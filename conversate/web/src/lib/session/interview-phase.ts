export type InterviewPhase =
  | "initializing"
  | "creating_session"
  | "ready"
  | "avatar_connecting"
  | "avatar_failed"
  | "transcript_only"
  | "live"
  | "ending"
  | "completed";

export type AvatarMode = "pending" | "connected" | "failed" | "skipped";

export const SESSION_CREATE_TIMEOUT_MS = 8_000;
export const DID_CONNECT_TIMEOUT_MS = 35_000;

export function interviewPhaseLabel(phase: InterviewPhase): string {
  switch (phase) {
    case "initializing":
      return "Initializing";
    case "creating_session":
      return "Creating session";
    case "ready":
      return "Session ready";
    case "avatar_connecting":
      return "Connecting avatar";
    case "avatar_failed":
      return "Avatar unavailable";
    case "transcript_only":
      return "Transcript-only interview";
    case "live":
      return "Live interview";
    case "ending":
      return "Ending session";
    case "completed":
      return "Session completed";
    default:
      return phase;
  }
}

export function interviewPhaseHint(phase: InterviewPhase): string | null {
  switch (phase) {
    case "creating_session":
      return "If this takes more than 8 seconds, we will use a local session.";
    case "avatar_connecting":
      return "Warming live stream — usually under 10s after allowlist is set.";
    case "avatar_failed":
      return "Use “Continue transcript-only interview” to keep practicing.";
    case "transcript_only":
      return "Capture your answers with browser speech or manual paste.";
    default:
      return null;
  }
}
