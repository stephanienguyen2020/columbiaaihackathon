"""
Transcription service: voice memo to text using OpenAI Whisper.
(Claude does not support audio input; Whisper is used for transcription.)
"""

import io
from pathlib import Path
from typing import Optional

from openai import AsyncOpenAI

from config import settings

_client: Optional[AsyncOpenAI] = None


def get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        if not settings.openai_api_key:
            raise ValueError("OPENAI_API_KEY is not set")
        _client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _client


async def transcribe_audio(audio_path: Path, mime_type: str = "audio/wav") -> str:
    """
    Transcribe voice memo with Whisper and format for the pipeline.
    Returns text in the same format as before: TRANSCRIPTION: ... BRIEF: ...
    We then ask Claude to extract the brief from the raw transcript in script generation.
    """
    client = get_client()
    audio_data = audio_path.read_bytes()
    file_like = io.BytesIO(audio_data)
    file_like.name = "audio" + _mime_to_ext(mime_type)

    transcript_response = await client.audio.transcriptions.create(
        model="whisper-1",
        file=file_like,
    )
    raw = transcript_response.text

    # Add a brief-format prompt so Claude can use it for script generation
    return (
        "TRANSCRIPTION:\n"
        + raw
        + "\n\n"
        "BRIEF:\n"
        "Extract from the above: product/service, target audience, key selling points, "
        "tone/mood, and any specific requirements. Use this for the marketing script."
    )


def _mime_to_ext(mime_type: str) -> str:
    m = mime_type or "audio/wav"
    if "mpeg" in m or "mp3" in m:
        return ".mp3"
    if "m4a" in m or "mp4" in m:
        return ".m4a"
    if "webm" in m:
        return ".webm"
    if "ogg" in m:
        return ".ogg"
    return ".wav"
