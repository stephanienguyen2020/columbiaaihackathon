"""
ElevenLabs service: text-to-speech for video narration.
"""

import asyncio
from pathlib import Path
from typing import Optional

import httpx

from config import settings
from schemas import MarketingScript

ELEVENLABS_TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"


async def generate_script_audio(script: MarketingScript, output_path: Path) -> Path:
    """
    Generate a single audio file with full narration for the script using ElevenLabs.
    Concatenates all scene narrations into one request (or multiple in sequence).
    """
    if not settings.elevenlabs_api_key or not settings.elevenlabs_voice_id:
        raise ValueError("ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID must be set")

    full_text = " ".join(s.narration.strip() for s in script.scenes if s.narration)
    if not full_text:
        raise ValueError("Script has no narration text")

    output_path.parent.mkdir(parents=True, exist_ok=True)

    async with httpx.AsyncClient(timeout=120.0) as client:
        resp = await client.post(
            ELEVENLABS_TTS_URL.format(voice_id=settings.elevenlabs_voice_id),
            headers={
                "xi-api-key": settings.elevenlabs_api_key,
                "Content-Type": "application/json",
                "Accept": "audio/mpeg",
            },
            json={
                "text": full_text,
                "model_id": "eleven_multilingual_v2",
            },
        )
        resp.raise_for_status()
        output_path.write_bytes(resp.content)

    return output_path
