"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard, ReadinessIndicator } from "@/components/ui/interview-room";
import { useBrowserSpeechRecognition } from "@/hooks/useBrowserSpeechRecognition";
import type { SpeechSegment } from "@/lib/speech/types";

type Props = {
  sessionId: string;
  onSegmentFinal?: (segment: SpeechSegment) => void;
  onPersistError?: (message: string) => void;
};

async function persistFinalSegment(
  sessionId: string,
  segment: SpeechSegment,
): Promise<boolean> {
  if (!segment.isFinal) return false;
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
  if (status === "requesting") return { label: "Starting…", readiness: "pending" };
  if (support === "supported") {
    return { label: "Browser speech capture available", readiness: "ready" };
  }
  return { label: "Checking support…", readiness: "pending" };
}

export function SpeechTranscriptCapture({
  sessionId,
  onSegmentFinal,
  onPersistError,
}: Props) {
  const [consent, setConsent] = useState(false);
  const [persistWarning, setPersistWarning] = useState<string | null>(null);
  const speech = useBrowserSpeechRecognition();
  const persistedIds = useRef<Set<string>>(new Set());
  const { label, readiness } = statusLabel(speech.support, speech.status);

  const handleFinal = useCallback(
    async (segment: SpeechSegment) => {
      if (!segment.isFinal) return;
      onSegmentFinal?.(segment);
      if (!consent) return;
      const ok = await persistFinalSegment(sessionId, segment);
      if (!ok) {
        const msg = "Could not save segment to session (DB may be unavailable).";
        setPersistWarning(msg);
        onPersistError?.(msg);
      }
    },
    [consent, onPersistError, onSegmentFinal, sessionId],
  );

  useEffect(() => {
    for (const segment of speech.finalSegments) {
      if (!segment.isFinal || persistedIds.current.has(segment.id)) continue;
      persistedIds.current.add(segment.id);
      void handleFinal(segment);
    }
  }, [speech.finalSegments, handleFinal]);

  const canStart =
    consent && speech.support === "supported" && speech.status !== "listening";

  return (
    <GlassCard className="space-y-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Candidate-side capture only
        </p>
        <h3 className="mt-1 text-sm font-medium">Speech transcript (prototype)</h3>
      </div>

      <p className="text-xs text-muted-foreground">
        Prototype: captures your spoken answers in the browser and saves finalized segments to
        this session when enabled. This is not a complete conversation transcript.
      </p>

      <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-xs text-amber-800 dark:text-amber-200">
        For cleaner transcripts, use headphones so the browser does not capture the interviewer
        audio.
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
        <Button type="button" size="sm" disabled={!canStart} onClick={speech.start}>
          Start capture
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={speech.status !== "listening" && speech.status !== "requesting"}
          onClick={speech.stop}
        >
          Stop
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            persistedIds.current.clear();
            speech.clear();
            setPersistWarning(null);
          }}
        >
          Clear
        </Button>
      </div>

      {speech.interimText ? (
        <div className="rounded border border-dashed p-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Listening…</span> {speech.interimText}
        </div>
      ) : null}

      {speech.finalSegments.length > 0 ? (
        <ul className="max-h-32 space-y-1 overflow-y-auto text-xs">
          {speech.finalSegments.map((s) => (
            <li key={s.id} className="text-muted-foreground">
              <span className="font-medium text-foreground">browser speech:</span> {s.text}
            </li>
          ))}
        </ul>
      ) : null}

      {speech.error ? <p className="text-xs text-destructive">{speech.error}</p> : null}
      {persistWarning ? <p className="text-xs text-amber-600">{persistWarning}</p> : null}
    </GlassCard>
  );
}
