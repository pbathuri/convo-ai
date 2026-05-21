"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createBrowserSpeechRecognizer, detectSpeechRecognitionSupport } from "@/lib/speech/browser-speech";
import type {
  SpeechRecognitionSupport,
  SpeechRecognizerStatus,
  SpeechSegment,
} from "@/lib/speech/types";

export type UseBrowserSpeechRecognitionResult = {
  support: SpeechRecognitionSupport;
  status: SpeechRecognizerStatus;
  interimText: string;
  finalSegments: SpeechSegment[];
  error: string | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
  clear: () => void;
};

export function useBrowserSpeechRecognition(): UseBrowserSpeechRecognitionResult {
  const [support, setSupport] = useState<SpeechRecognitionSupport>("unknown");
  const [status, setStatus] = useState<SpeechRecognizerStatus>("idle");
  const [interimText, setInterimText] = useState("");
  const [finalSegments, setFinalSegments] = useState<SpeechSegment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const recognizerRef = useRef<ReturnType<typeof createBrowserSpeechRecognizer> | null>(null);

  useEffect(() => {
    setSupport(detectSpeechRecognitionSupport());
    const recognizer = createBrowserSpeechRecognizer({
      onInterim: setInterimText,
      onFinal: (segment) => {
        if (!segment.isFinal || !segment.text.trim()) return;
        setFinalSegments((prev) => {
          if (prev.some((s) => s.id === segment.id)) return prev;
          return [...prev, segment];
        });
        setInterimText("");
      },
      onError: (msg) => setError(msg),
      onStatus: setStatus,
    });
    recognizerRef.current = recognizer;
    setStatus(recognizer.support === "supported" ? "idle" : "unsupported");

    return () => {
      recognizer.abort();
      recognizerRef.current = null;
    };
  }, []);

  const start = useCallback(() => {
    setError(null);
    recognizerRef.current?.start();
  }, []);

  const stop = useCallback(() => {
    recognizerRef.current?.stop();
  }, []);

  const abort = useCallback(() => {
    recognizerRef.current?.abort();
    setInterimText("");
  }, []);

  const clear = useCallback(() => {
    recognizerRef.current?.reset();
    setInterimText("");
    setFinalSegments([]);
    setError(null);
  }, []);

  return {
    support,
    status,
    interimText,
    finalSegments,
    error,
    start,
    stop,
    abort,
    clear,
  };
}
