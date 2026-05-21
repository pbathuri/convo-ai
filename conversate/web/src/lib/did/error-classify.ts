export type DidErrorKind = "cors" | "fetch" | "auth" | "webrtc" | "unknown";

export function classifyDidError(message: string): DidErrorKind {
  const m = message.toLowerCase();
  if (m.includes("cors") || m.includes("access-control")) return "cors";
  if (m.includes("failed to fetch") || m.includes("network")) return "fetch";
  if (
    m.includes("401") ||
    m.includes("403") ||
    m.includes("unauthorized") ||
    m.includes("forbidden")
  )
    return "auth";
  if (m.includes("webrtc") || m.includes("ice")) return "webrtc";
  return "unknown";
}
