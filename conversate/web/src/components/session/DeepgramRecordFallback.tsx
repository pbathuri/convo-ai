"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { transcribeAudioBlob } from "@/lib/voice/transcribe-client";
import type { SpeechSegment } from "@/lib/speech/types";

const MAX_RECORD_MS = 30_000;

type Props = {
  disabled?: boolean;
  onTranscribed: (segment: SpeechSegment) => void;
  onError?: (message: string) => void;
};

export function DeepgramRecordFallback({
  disabled,
  onTranscribed,
  onError,
}: Props) {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const stopTimerRef = useRef<number | null>(null);

  const stopRecording = useCallback(() => {
    if (stopTimerRef.current) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
    recorderRef.current?.stop();
    recorderRef.current = null;
    setRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    if (disabled || recording || transcribing) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        chunksRef.current = [];
        if (blob.size === 0) {
          onError?.("No audio captured");
          return;
        }
        setTranscribing(true);
        void transcribeAudioBlob(blob)
          .then((result) => {
            if (!result.text.trim()) {
              onError?.(
                result.message ??
                  (result.degraded
                    ? "Deepgram unavailable — check backend API"
                    : "No speech detected"),
              );
              return;
            }
            const now = Date.now();
            const endedAt = new Date(now).toISOString();
            onTranscribed({
              id: `deepgram-${now}`,
              text: result.text.trim(),
              isFinal: true,
              confidence: result.degraded ? 0.5 : 0.85,
              provider: "deepgram",
              startedAt: new Date(now - 1000).toISOString(),
              endedAt,
            });
          })
          .catch(() => onError?.("Transcription request failed"))
          .finally(() => setTranscribing(false));
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      stopTimerRef.current = window.setTimeout(stopRecording, MAX_RECORD_MS);
    } catch {
      onError?.("Microphone permission denied");
    }
  }, [disabled, onError, onTranscribed, recording, stopRecording, transcribing]);

  return (
    <div className="space-y-2 rounded-md border border-dashed p-3">
      <p className="text-xs font-medium">Deepgram fallback (server STT)</p>
      <p className="text-xs text-muted-foreground">
        Record up to 30 seconds when browser speech recognition is unavailable.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          disabled={disabled || transcribing || recording}
          onClick={() => void startRecording()}
        >
          {transcribing ? "Transcribing…" : recording ? "Recording…" : "Record clip"}
        </Button>
        {recording ? (
          <Button type="button" size="sm" variant="outline" onClick={stopRecording}>
            Stop & transcribe
          </Button>
        ) : null}
      </div>
    </div>
  );
}
