export type TranscribeResponse = {
  text: string;
  provider: string;
  degraded: boolean;
  message?: string;
};

export async function transcribeAudioBlob(
  blob: Blob,
  filename = "clip.webm",
): Promise<TranscribeResponse> {
  const form = new FormData();
  form.append("audio", blob, filename);
  const res = await fetch("/api/voice/transcribe", {
    method: "POST",
    body: form,
  });
  const body = (await res.json()) as TranscribeResponse & { error?: string };
  if (!res.ok) {
    return {
      text: "",
      provider: body.provider ?? "unavailable",
      degraded: true,
      message: body.message ?? body.error ?? `HTTP ${res.status}`,
    };
  }
  return body;
}
