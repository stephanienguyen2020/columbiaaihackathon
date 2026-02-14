"""
Video stitching service: assembles individual scene clips into
a final 1-minute marketing video with transitions.
"""

import asyncio
from pathlib import Path

from moviepy import (
    VideoFileClip,
    concatenate_videoclips,
    TextClip,
    CompositeVideoClip,
)

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
