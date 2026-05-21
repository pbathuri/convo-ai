import type {
  BrowserSpeechRecognitionConstructor,
  BrowserSpeechRecognitionEvent,
  BrowserSpeechRecognitionInstance,
  BrowserSpeechOptions,
  BrowserSpeechRecognizer,
  SpeechRecognitionSupport,
  SpeechRecognizerStatus,
  SpeechSegment,
} from "./types";

function getRecognitionCtor(): BrowserSpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: BrowserSpeechRecognitionConstructor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function detectSpeechRecognitionSupport(): SpeechRecognitionSupport {
  if (typeof window === "undefined") return "unknown";
  return getRecognitionCtor() ? "supported" : "unsupported";
}

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function createSegmentId(): string {
  return `seg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createBrowserSpeechRecognizer(
  options: BrowserSpeechOptions = {},
): BrowserSpeechRecognizer {
  const Ctor = getRecognitionCtor();
  const support: SpeechRecognitionSupport = Ctor ? "supported" : "unsupported";
  let status: SpeechRecognizerStatus = support === "supported" ? "idle" : "unsupported";
  let recognition: BrowserSpeechRecognitionInstance | null = null;
  let lastFinalNormalized = "";

  const setStatus = (next: SpeechRecognizerStatus) => {
    status = next;
    options.onStatus?.(next);
  };

  const handleResult = (event: BrowserSpeechRecognitionEvent) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = normalizeText(result[0]?.transcript ?? "");
      if (!transcript) continue;

      if (result.isFinal) {
        const normalized = transcript.toLowerCase();
        if (normalized === lastFinalNormalized) continue;
        lastFinalNormalized = normalized;

        const segment: SpeechSegment = {
          id: createSegmentId(),
          text: transcript,
          isFinal: true,
          confidence: result[0]?.confidence,
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
          provider: "browser_speech_recognition",
          raw: { resultIndex: i },
        };
        options.onFinal?.(segment);
      } else {
        interim += `${transcript} `;
      }
    }
    options.onInterim?.(normalizeText(interim));
  };

  const attach = () => {
    if (!Ctor) return null;
    const instance = new Ctor();
    instance.continuous = true;
    instance.interimResults = true;
    instance.maxAlternatives = 1;
    instance.lang = options.lang ?? "en-US";
    instance.onstart = () => setStatus("listening");
    instance.onend = () => {
      if (status === "listening") setStatus("paused");
    };
    instance.onerror = (event) => {
      setStatus("error");
      options.onError?.(event.message ?? event.error ?? "Speech recognition error");
    };
    instance.onresult = handleResult;
    return instance;
  };

  return {
    get support() {
      return support;
    },
    get status() {
      return status;
    },
    start() {
      if (support !== "supported" || !Ctor) {
        setStatus("unsupported");
        return;
      }
      try {
        setStatus("requesting");
        recognition?.abort();
        recognition = attach();
        lastFinalNormalized = "";
        recognition?.start();
      } catch (e) {
        setStatus("error");
        options.onError?.(e instanceof Error ? e.message : String(e));
      }
    },
    stop() {
      if (!recognition) return;
      try {
        recognition.stop();
        setStatus("paused");
      } catch (e) {
        setStatus("error");
        options.onError?.(e instanceof Error ? e.message : String(e));
      }
    },
    abort() {
      if (recognition) {
        try {
          recognition.abort();
        } catch {
          /* ignore */
        }
        recognition = null;
      }
      setStatus(support === "supported" ? "idle" : "unsupported");
      options.onInterim?.("");
    },
    reset() {
      lastFinalNormalized = "";
      options.onInterim?.("");
    },
  };
}
