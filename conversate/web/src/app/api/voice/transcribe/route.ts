import { NextResponse } from "next/server";
import { backendPostMultipart } from "@/lib/backend/client";
import { captureException } from "@/lib/observability/sentry";

export const dynamic = "force-dynamic";

type TranscribeResult = {
  text: string;
  provider: string;
  degraded: boolean;
  message?: string;
};

/** Proxy audio upload to FastAPI Deepgram STT on Render. */
export async function POST(req: Request) {
  try {
    const incoming = await req.formData();
    const audio = incoming.get("audio");
    if (!(audio instanceof Blob) || audio.size === 0) {
      return NextResponse.json(
        { error: "audio file required", degraded: true },
        { status: 400 },
      );
    }

    const form = new FormData();
    form.append(
      "audio",
      audio,
      audio instanceof File ? audio.name : "clip.webm",
    );

    const result = await backendPostMultipart<TranscribeResult>(
      "/voice/transcribe",
      form,
    );
    return NextResponse.json(result);
  } catch (e) {
    captureException(e, { route: "voice-transcribe" });
    return NextResponse.json(
      {
        text: "",
        provider: "unavailable",
        degraded: true,
        message: "Voice transcription service unavailable",
      },
      { status: 503 },
    );
  }
}
