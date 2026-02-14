"""
Scene image generation via Replicate (FLUX).
"""

import asyncio
from pathlib import Path
from typing import Optional

from config import settings
from schemas import MarketingScript, SceneScript

try:
    import replicate
except ImportError:
    replicate = None


def _get_client():
    if replicate is None:
        raise ValueError("Install replicate: pip install replicate")
    if not settings.replicate_api_token:
        raise ValueError("REPLICATE_API_TOKEN is not set")
    return replicate


async def generate_scene_image(
    scene: SceneScript,
    script_context: MarketingScript,
    output_dir: Path,
) -> Path:
    """Generate a single scene image using Replicate FLUX."""
    client = _get_client()
    prompt = (
        f"High-quality cinematic marketing image, {script_context.tone} tone, "
        f"targeting {script_context.target_audience}. "
        f"Scene: {scene.visual_description}. "
        f"Camera: {scene.camera_direction}. "
        f"Professional, photorealistic, 16:9, good lighting."
    )
    output_path = output_dir / f"scene_{scene.scene_number:02d}.png"

    def _run():
        out = replicate.run(
            settings.replicate_flux_model,
            input={"prompt": prompt},
        )
        # Replicate returns FileOutput (has .read()) or list of them
        file_out = out
        if isinstance(out, (list, tuple)):
            file_out = out[0]
        output_path.write_bytes(file_out.read())
        return output_path

    return await asyncio.to_thread(_run)


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
        await asyncio.sleep(1)
    return paths
