"""
Video stitching service: assembles individual scene clips or images + audio
into a final marketing video.
"""

import asyncio
from pathlib import Path

from moviepy import VideoFileClip, concatenate_videoclips
from moviepy.video.VideoClip import ImageClip
from moviepy.audio.io.AudioFileClip import AudioFileClip

from schemas import MarketingScript


async def stitch_video(
    clip_paths: list[Path],
    script: MarketingScript,
    output_path: Path,
) -> Path:
    """
    Stitch video clips together into a final marketing video.

    Args:
        clip_paths: Ordered list of video clip file paths
        script: The marketing script (for timing / narration overlay)
        output_path: Where to save the final video

    Returns:
        Path to the final stitched video
    """
    return await asyncio.to_thread(
        _stitch_sync, clip_paths, script, output_path
    )


def _stitch_sync(
    clip_paths: list[Path],
    script: MarketingScript,
    output_path: Path,
) -> Path:
    """Synchronous stitching logic."""
    clips = []

    for i, clip_path in enumerate(clip_paths):
        clip = VideoFileClip(str(clip_path))

        # Trim clip to match scene duration if needed
        if i < len(script.scenes):
            target_duration = script.scenes[i].duration_seconds
            if clip.duration > target_duration:
                clip = clip.subclipped(0, target_duration)

        clips.append(clip)

    if not clips:
        raise ValueError("No video clips to stitch")

    # Concatenate with simple crossfade transitions
    final = concatenate_videoclips(clips, method="compose")

    # Write output
    output_path.parent.mkdir(parents=True, exist_ok=True)
    final.write_videofile(
        str(output_path),
        codec="libx264",
        audio_codec="aac",
        fps=24,
        preset="medium",
        logger=None,  # suppress moviepy logs
    )

    # Cleanup
    for clip in clips:
        clip.close()
    final.close()

    return output_path


async def stitch_images_with_audio(
    image_paths: list[Path],
    script: MarketingScript,
    audio_path: Path,
    output_path: Path,
) -> Path:
    """
    Stitch scene images with a single narration audio track into a video.
    Each image is shown for its scene's duration_seconds; audio plays across the whole video.
    """
    return await asyncio.to_thread(
        _stitch_images_with_audio_sync, image_paths, script, audio_path, output_path
    )


def _stitch_images_with_audio_sync(
    image_paths: list[Path],
    script: MarketingScript,
    audio_path: Path,
    output_path: Path,
) -> Path:
    """Synchronous: image clips + single audio -> final video."""
    clips = []
    for i, img_path in enumerate(image_paths):
        if not img_path.exists():
            raise FileNotFoundError(f"Image not found: {img_path}")
        duration = script.scenes[i].duration_seconds if i < len(script.scenes) else 5.0
        clip = ImageClip(str(img_path), duration=duration)
        clips.append(clip)

    if not clips:
        raise ValueError("No image clips to stitch")

    final = concatenate_videoclips(clips, method="compose")
    audio = AudioFileClip(str(audio_path))
    final = final.with_audio(audio)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    final.write_videofile(
        str(output_path),
        codec="libx264",
        audio_codec="aac",
        fps=24,
        preset="medium",
        logger=None,
    )

    for clip in clips:
        clip.close()
    final.close()
    audio.close()

    return output_path
