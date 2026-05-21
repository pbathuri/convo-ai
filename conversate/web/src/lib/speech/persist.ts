import type { SpeechSegment } from "./types";

/** Only final segments may be persisted to the API. */
export function shouldPersistSegment(segment: SpeechSegment): boolean {
  return segment.isFinal && segment.text.trim().length > 0;
}

const DEDUPE_WINDOW_MS = 5000;

/** Dedupe by id or near-duplicate text within a time window. */
export function isDuplicateSegment(
  segment: SpeechSegment,
  seen: { ids: Set<string>; recent: { text: string; at: number }[] },
): boolean {
  if (seen.ids.has(segment.id)) return true;
  const normalized = segment.text.trim().toLowerCase();
  const now = segment.endedAt ? Date.parse(segment.endedAt) : Date.now();
  for (const r of seen.recent) {
    if (normalized === r.text && Math.abs(now - r.at) < DEDUPE_WINDOW_MS)
      return true;
  }
  return false;
}

export function markSegmentSeen(
  segment: SpeechSegment,
  seen: { ids: Set<string>; recent: { text: string; at: number }[] },
): void {
  seen.ids.add(segment.id);
  seen.recent.push({
    text: segment.text.trim().toLowerCase(),
    at: segment.endedAt ? Date.parse(segment.endedAt) : Date.now(),
  });
  if (seen.recent.length > 20) seen.recent.shift();
}
