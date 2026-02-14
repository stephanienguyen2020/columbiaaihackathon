"""
Claude service: marketing script generation from transcript.
Uses Anthropic Messages API; no audio input (transcription is done via Whisper).
"""

import json
import asyncio
from typing import Optional

from anthropic import AsyncAnthropic

from config import settings
from schemas import MarketingScript

SCRIPT_SYSTEM_PROMPT = """You are an expert marketing video scriptwriter.
Given a voice memo transcription and marketing brief, create a compelling
1-minute marketing video script broken into scenes.

Return ONLY valid JSON matching this exact schema (no markdown, no extra text):
{
    "title": "string",
    "target_audience": "string",
    "tone": "string",
    "total_duration_seconds": 60,
    "cta": "call to action string",
    "scenes": [
        {
            "scene_number": 1,
            "duration_seconds": 7.5,
            "narration": "what the voiceover says",
            "visual_description": "detailed description of what should appear visually - be specific about colors, composition, style, lighting",
            "camera_direction": "e.g. slow zoom in, pan left, static wide shot",
            "transition": "cut | fade | dissolve"
        }
    ]
}

Rules:
- Total duration of all scenes must sum to ~60 seconds
- 5-8 scenes maximum
- Each scene 5-12 seconds
- Visual descriptions must be vivid and specific enough for AI image generation
- Keep narration punchy and engaging
- End with a strong CTA scene
"""

_client: Optional[AsyncAnthropic] = None


def get_client() -> AsyncAnthropic:
    global _client
    if _client is None:
        if not settings.anthropic_api_key:
            raise ValueError("ANTHROPIC_API_KEY is not set")
        _client = AsyncAnthropic(api_key=settings.anthropic_api_key)
    return _client


async def generate_script(transcript: str) -> MarketingScript:
    """Generate a structured marketing script from the transcription using Claude."""
    client = get_client()
    response = await client.messages.create(
        model=settings.claude_model,
        max_tokens=4096,
        system=SCRIPT_SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": f"Here is the voice memo transcription and brief:\n\n{transcript}",
            }
        ],
    )
    raw = response.content[0].text.strip()
    # Strip markdown code block if present
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1] if "\n" in raw else raw[3:]
        if raw.endswith("```"):
            raw = raw[:-3].strip()
    data = json.loads(raw)
    return MarketingScript(**data)
