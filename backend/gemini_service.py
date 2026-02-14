"""
Gemini service: handles all Google GenAI interactions.
- Voice memo transcription (multimodal audio input)
- Marketing script generation
- Image generation via Nano Banana (gemini-2.5-flash-image)
- Video generation via Veo 3
"""

import json
import time
import base64
import asyncio
from pathlib import Path
from typing import Optional

from google import genai
from google.genai import types

from config import settings
from schemas import MarketingScript, SceneScript


# ── Client init ──────────────────────────────────────────────────────────────

_client: Optional[genai.Client] = None


def get_client() -> genai.Client:
    global _client
    if _client is None:
        _client = genai.Client(api_key=settings.gemini_api_key)
    return _client


# ── 1. Transcribe voice memo ────────────────────────────────────────────────

async def transcribe_audio(audio_path: Path, mime_type: str = "audio/wav") -> str:
    """
    Use Gemini's multimodal capabilities to transcribe a voice memo
    and extract the marketing brief/intent.
    """
    client = get_client()
    audio_bytes = audio_path.read_bytes()
    audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")

    response = await asyncio.to_thread(
        client.models.generate_content,
        model=settings.gemini_flash_model,
        contents=[
            types.Content(
                parts=[
                    types.Part(
                        inline_data=types.Blob(
                            mime_type=mime_type,
                            data=audio_bytes,
                        )
                    ),
                    types.Part(
                        text=(
                            "Transcribe this voice memo exactly. Then below the transcription, "
                            "extract the key marketing brief details:\n"
                            "- Product/service being marketed\n"
                            "- Target audience\n"
                            "- Key selling points\n"
                            "- Desired tone/mood\n"
                            "- Any specific requirements mentioned\n\n"
                            "Format as:\n"
                            "TRANSCRIPTION:\n<exact words>\n\n"
                            "BRIEF:\n<structured brief>"
                        )
                    ),
                ]
            )
        ],
    )
    return response.text


# ── 2. Generate marketing script ────────────────────────────────────────────

SCRIPT_SYSTEM_PROMPT = """You are an expert marketing video scriptwriter. 
Given a voice memo transcription and marketing brief, create a compelling 
1-minute marketing video script broken into scenes.

Return ONLY valid JSON matching this exact schema:
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


async def generate_script(transcript: str) -> MarketingScript:
    """Generate a structured marketing script from the transcription."""
    client = get_client()

    response = await asyncio.to_thread(
        client.models.generate_content,
        model=settings.gemini_flash_model,
        contents=[
            types.Content(
                parts=[
                    types.Part(text=SCRIPT_SYSTEM_PROMPT),
                    types.Part(
                        text=f"Here is the voice memo transcription and brief:\n\n{transcript}"
                    ),
                ]
            )
        ],
        config=types.GenerateContentConfig(
            temperature=0.7,
            response_mime_type="application/json",
        ),
    )

    raw = response.text.strip()
    # Parse and validate
    data = json.loads(raw)
    return MarketingScript(**data)


# ── 3. Generate scene images via Nano Banana ────────────────────────────────

async def generate_scene_image(
    scene: SceneScript,
    script_context: MarketingScript,
    output_dir: Path,
) -> Path:
    """
    Generate a single scene image using Gemini's native image generation
    (Nano Banana - gemini-2.5-flash-image).
    """
    client = get_client()

    prompt = (
        f"Create a high-quality, cinematic marketing image for a {script_context.tone} "
        f"video targeting {script_context.target_audience}.\n\n"
        f"Scene {scene.scene_number}: {scene.visual_description}\n"
        f"Camera: {scene.camera_direction}\n"
        f"Style: Professional marketing video frame, 16:9 aspect ratio, "
        f"photorealistic, high production value, good lighting."
    )

    response = await asyncio.to_thread(
        client.models.generate_content,
        model=settings.gemini_image_model,
        contents=[prompt],
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE"],
        ),
    )

    # Save the generated image
    output_path = output_dir / f"scene_{scene.scene_number:02d}.png"
    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            output_path.write_bytes(part.inline_data.data)
            break

    return output_path


async def generate_all_images(
    script: MarketingScript,
    output_dir: Path,
) -> list[Path]:
    """Generate images for all scenes (sequentially to avoid rate limits)."""
    output_dir.mkdir(parents=True, exist_ok=True)
    paths = []
    for scene in script.scenes:
        path = await generate_scene_image(scene, script, output_dir)
        paths.append(path)
        await asyncio.sleep(1)  # rate limit buffer
    return paths


# ── 4. Generate single video via Veo (text-to-video) ────────────────────────

async def generate_single_video(script: MarketingScript, output_dir: Path) -> Path:
    """
    Generate one video clip from the script (first scene). Text-to-video only, no images.
    Returns path to the saved video file.
    """
    client = get_client()
    output_dir.mkdir(parents=True, exist_ok=True)

    scene = script.scenes[0]
    prompt = (
        f"A {script.tone} marketing video clip. "
        f"{scene.visual_description} "
        f"Camera: {scene.camera_direction}. "
        f"Professional, cinematic quality. Smooth motion."
    )

    operation = await asyncio.to_thread(
        client.models.generate_videos,
        model=settings.veo_model,
        prompt=prompt,
        config=types.GenerateVideosConfig(
            aspect_ratio="9:16",
        ),
    )

    while not operation.done:
        await asyncio.sleep(10)
        operation = await asyncio.to_thread(
            client.operations.get, operation
        )

    if operation.error:
        raise RuntimeError(f"Veo video generation failed: {operation.error}")

    response = operation.response or operation.result
    if not response or not response.generated_videos:
        raise RuntimeError("Veo returned no generated videos")

    generated_video = response.generated_videos[0]
    await asyncio.to_thread(
        client.files.download, file=generated_video.video
    )
    output_path = output_dir / "video.mp4"
    generated_video.video.save(str(output_path))
    return output_path
