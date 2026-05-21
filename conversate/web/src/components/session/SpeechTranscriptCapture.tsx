"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard, ReadinessIndicator } from "@/components/ui/interview-room";
import { useBrowserSpeechRecognition } from "@/hooks/useBrowserSpeechRecognition";
import {
  isDuplicateSegment,
  markSegmentSeen,
  shouldPersistSegment,
} from "@/lib/speech/persist";
import type { SpeechSegment } from "@/lib/speech/types";

type Props = {
  sessionId: string;
  onSegmentFinal?: (segment: SpeechSegment) => void;
  onPersistError?: (message: string) => void;
  onPersistSuccess?: () => void;
  onUnsavedCountChange?: (count: number) => void;
};

type FailedSegment = { segment: SpeechSegment; error: string };

async function persistFinalSegment(
  sessionId: string,
  segment: SpeechSegment,
): Promise<boolean> {
  if (!shouldPersistSegment(segment)) return false;
  const res = await fetch(`/api/sessions/${sessionId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: segment.text,
          provider: segment.provider,
          metadata: {
            confidence: segment.confidence,
            source: "browser_speech_recognition",
            prototype: true,
            startedAt: segment.startedAt,
            endedAt: segment.endedAt,
          },
        },
      ],
    }),
  });
  return res.ok;
}

function statusLabel(
  support: string,
  status: string,
): { label: string; readiness: "pending" | "ready" | "warning" | "error" } {
  if (support === "unsupported") {
    return { label: "Not supported in this browser", readiness: "warning" };
  }
  if (status === "listening") return { label: "Listening", readiness: "ready" };
  if (status === "paused") return { label: "Paused", readiness: "pending" };
  if (status === "error") return { label: "Error", readiness: "error" };
  if (status === "requesting")
    return { label: "Starting…", readiness: "pending" };
  if (support === "supported") {
    return { label: "Browser speech capture available", readiness: "ready" };
  }
  return { label: "Checking support…", readiness: "pending" };
}

export function SpeechTranscriptCapture({
  sessionId,
  onSegmentFinal,
  onPersistError,
  onPersistSuccess,
  onUnsavedCountChange,
}: Props) {
  const [consent, setConsent] = useState(false);
  const [persistWarning, setPersistWarning] = useState<string | null>(null);
  const [failedQueue, setFailedQueue] = useState<FailedSegment[]>([]);
  const speech = useBrowserSpeechRecognition();
  const seenRef = useRef<{
    ids: Set<string>;
    recent: { text: string; at: number }[];
  }>({
    ids: new Set(),
    recent: [],
  });
  const { label, readiness } = statusLabel(speech.support, speech.status);

  const persistOne = useCallback(
    async (segment: SpeechSegment) => {
      if (!consent || !shouldPersistSegment(segment)) return true;
      const ok = await persistFinalSegment(sessionId, segment);
      if (!ok) {
        const msg =
          "Could not save segment to session (DB may be unavailable).";
        setFailedQueue((q) => {
          if (q.some((f) => f.segment.id === segment.id)) return q;
          return [...q, { segment, error: msg }];
        });
        setPersistWarning(msg);
        onPersistError?.(msg);
        return false;
      }
      setFailedQueue((q) => q.filter((f) => f.segment.id !== segment.id));
      onPersistSuccess?.();
      return true;
    },
    [consent, onPersistError, onPersistSuccess, sessionId],
  );

  useEffect(() => {
    onUnsavedCountChange?.(failedQueue.length);
  }, [failedQueue.length, onUnsavedCountChange]);

  const handleFinal = useCallback(
    async (segment: SpeechSegment) => {
      if (!shouldPersistSegment(segment)) return;
      if (isDuplicateSegment(segment, seenRef.current)) return;
      markSegmentSeen(segment, seenRef.current);
      onSegmentFinal?.(segment);
      await persistOne(segment);
    },
    [onSegmentFinal, persistOne],
  );

  useEffect(() => {
    for (const segment of speech.finalSegments) {
      if (!shouldPersistSegment(segment)) continue;
      if (seenRef.current.ids.has(segment.id)) continue;
      void handleFinal(segment);
    }
  }, [speech.finalSegments, handleFinal]);

  const retryFailed = useCallback(
    async (segment: SpeechSegment) => {
      const ok = await persistOne(segment);
      if (ok) setPersistWarning(null);
    },
    [persistOne],
  );

  const canStart =
    consent && speech.support === "supported" && speech.status !== "listening";

  return (
    <GlassCard className="space-y-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Candidate-side capture only
        </p>
        <h3 className="mt-1 text-sm font-medium">
          Speech transcript (prototype)
        </h3>
      </div>

      <p className="text-xs text-muted-foreground">
        Prototype: captures your spoken answers in the browser and saves
        finalized segments to this session when enabled. Interim text stays
        local only — never sent to the server.
      </p>

      <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-xs text-amber-800 dark:text-amber-200">
        For cleaner transcripts, use headphones so the browser does not capture
        the interviewer audio.
      </p>

      <ReadinessIndicator label={label} status={readiness} />

      <label className="flex items-start gap-2 text-xs">
        <input
          type="checkbox"
          className="mt-0.5"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>Save my spoken answers to this session (prototype)</span>
      </label>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          disabled={!canStart}
          onClick={speech.start}
        >
          Start capture
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={
            speech.status !== "listening" && speech.status !== "requesting"
          }
          onClick={speech.stop}
        >
          Stop
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            seenRef.current = { ids: new Set(), recent: [] };
            speech.clear();
            setPersistWarning(null);
            setFailedQueue([]);
          }}
        >
          Clear
        </Button>
      </div>

      {speech.interimText ? (
        <div className="rounded border border-dashed p-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            Listening (local only)…
          </span>{" "}
          {speech.interimText}
        </div>
      ) : null}

      {speech.finalSegments.length > 0 ? (
        <ul className="max-h-32 space-y-1 overflow-y-auto text-xs">
          {speech.finalSegments.map((s) => (
            <li key={s.id} className="text-muted-foreground">
              <span className="font-medium text-foreground">
                browser speech:
              </span>{" "}
              {s.text}
            </li>
          ))}
        </ul>
      ) : null}

      {failedQueue.length > 0 ? (
        <ul className="space-y-2 text-xs">
          {failedQueue.map(({ segment, error }) => (
            <li
              key={segment.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded border border-amber-500/40 bg-amber-500/5 p-2"
            >
              <span className="text-amber-800 dark:text-amber-200">
                Not saved — Retry: {segment.text.slice(0, 40)}
                {segment.text.length > 40 ? "…" : ""} ({error})
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => void retryFailed(segment)}
              >
                Retry
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      {speech.error ? (
        <p className="text-xs text-destructive">{speech.error}</p>
      ) : null}
      {persistWarning && failedQueue.length === 0 ? (
        <p className="text-xs text-amber-600">{persistWarning}</p>
      ) : null}
    </GlassCard>
  );
}
