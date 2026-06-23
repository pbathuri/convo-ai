export type SpeechRecognitionSupport = "supported" | "unsupported" | "unknown";

export type SpeechRecognizerStatus =
  | "unsupported"
  | "idle"
  | "requesting"
  | "listening"
  | "paused"
  | "error";

export type SpeechSegment = {
  id: string;
  text: string;
  isFinal: boolean;
  confidence?: number;
  startedAt: string;
  endedAt?: string;
  provider: "browser_speech_recognition" | "deepgram";
  raw?: unknown;
};

export type BrowserSpeechCallbacks = {
  onInterim?: (text: string) => void;
  onFinal?: (segment: SpeechSegment) => void;
  onError?: (message: string) => void;
  onStatus?: (status: SpeechRecognizerStatus) => void;
};

export type BrowserSpeechOptions = BrowserSpeechCallbacks & {
  lang?: string;
};

export type BrowserSpeechRecognizer = {
  support: SpeechRecognitionSupport;
  status: SpeechRecognizerStatus;
  start: () => void;
  stop: () => void;
  abort: () => void;
  reset: () => void;
};

export interface BrowserSpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      length: number;
      [alt: number]: { transcript: string; confidence?: number };
    };
  };
}

export interface BrowserSpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error?: string; message?: string }) => void) | null;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export type BrowserSpeechRecognitionConstructor =
  new () => BrowserSpeechRecognitionInstance;
