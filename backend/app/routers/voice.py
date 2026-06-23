from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.adapters.stt.deepgram import transcribe_audio
from app.adapters.tts.elevenlabs import synthesize_speech

router = APIRouter(prefix="/voice", tags=["voice"])


class TranscribeResponse(BaseModel):
    text: str
    provider: str
    degraded: bool = False


class SynthesizeRequest(BaseModel):
    text: str
    voice_id: str = "default"


class SynthesizeResponse(BaseModel):
    audio_base64: str | None
    provider: str
    degraded: bool = False
    message: str | None = None


@router.post("/transcribe")
async def transcribe() -> TranscribeResponse:
    """Placeholder — accepts multipart in production; returns mock when unkeyed."""
    result = await transcribe_audio(b"")
    return TranscribeResponse(**result)


@router.post("/synthesize", response_model=SynthesizeResponse)
async def synthesize(body: SynthesizeRequest) -> SynthesizeResponse:
    if not body.text.strip():
        raise HTTPException(status_code=400, detail="text required")
    result = await synthesize_speech(body.text, body.voice_id)
    return SynthesizeResponse(**result)
