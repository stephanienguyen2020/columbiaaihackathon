"""
Pipeline orchestrator: coordinates the full voice-to-video flow.

Flow:
  1. Upload voice memo
  2. Transcribe via Gemini (multimodal audio)
  3. Generate marketing script via Gemini
  4. PRE-compliance check via White Circle
  5. Generate one video clip via Veo (text-to-video, no images, no stitching)
  6. POST-compliance check via White Circle
  7. Deliver
"""

import uuid
import asyncio
from pathlib import Path
from datetime import datetime

from config import settings
from schemas import (
    PipelineJob,
    PipelineStage,
    MarketingScript,
)
from gemini_service import (
    transcribe_audio,
    generate_script,
    generate_single_video,
)
from whitecircle_service import (
    check_script_compliance,
    check_video_compliance,
)


# In-memory job store (swap with Redis/DB for production)
_jobs: dict[str, PipelineJob] = {}


def create_job() -> PipelineJob:
    job_id = str(uuid.uuid4())[:8]
    job = PipelineJob(job_id=job_id)
    _jobs[job_id] = job
    return job


def get_job(job_id: str) -> PipelineJob | None:
    return _jobs.get(job_id)


def update_job(job: PipelineJob):
    _jobs[job.job_id] = job


# ── Step 1: Transcribe ──────────────────────────────────────────────────────

async def run_transcription(job_id: str, audio_path: Path, mime_type: str) -> PipelineJob:
    job = get_job(job_id)
    if not job:
        raise ValueError(f"Job {job_id} not found")

    job.stage = PipelineStage.TRANSCRIBING
    update_job(job)

    try:
        transcript = await transcribe_audio(audio_path, mime_type)
        job.transcript = transcript
        update_job(job)
        return job
    except Exception as e:
        job.stage = PipelineStage.FAILED
        job.error = f"Transcription failed: {str(e)}"
        update_job(job)
        raise


# ── Step 2: Script generation + pre-compliance ──────────────────────────────

async def run_script_generation(job_id: str) -> PipelineJob:
    print(f"Running script generation")
    job = get_job(job_id)
    if not job or not job.transcript:
        raise ValueError(f"Job {job_id} not found or missing transcript")

    job.stage = PipelineStage.SCRIPTING
    update_job(job)

    try:
        script = await generate_script(job.transcript)
        job.script = script

        # Pre-compliance check
        job.stage = PipelineStage.PRE_COMPLIANCE
        update_job(job)

        compliance = await check_script_compliance(script)
        job.pre_compliance = compliance

        if not compliance.passed:
            job.stage = PipelineStage.FAILED
            job.error = (
                f"Script failed compliance check: {', '.join(compliance.flagged_issues)}"
            )

        update_job(job)
        return job

    except Exception as e:
        job.stage = PipelineStage.FAILED
        job.error = f"Script generation failed: {str(e)}"
        update_job(job)
        raise


# ── Step 3: Video generation only (one clip, no images, no stitching) ────────

async def run_media_generation(
    job_id: str,
    approved_script: MarketingScript | None = None,
) -> PipelineJob:
    """
    Runs single video gen → post-compliance. No image gen, no stitching.
    Accepts optional approved_script if the user edited it.
    """
    job = get_job(job_id)
    if not job:
        raise ValueError(f"Job {job_id} not found")

    if approved_script:
        job.script = approved_script

    if not job.script:
        raise ValueError(f"Job {job_id} has no script")

    job_dir = settings.output_dir / job.job_id

    try:
        # ── Single video generation (text-to-video, first scene) ─────────────
        job.stage = PipelineStage.VIDEO_GEN
        update_job(job)

        video_dir = job_dir / "clips"
        final_path = await generate_single_video(job.script, video_dir)
        job.video_clip_paths = [str(final_path)]
        job.final_video_path = str(final_path)
        update_job(job)

        # ── Post-compliance check ────────────────────────────────────
        job.stage = PipelineStage.POST_COMPLIANCE
        update_job(job)

        post_compliance = await check_video_compliance(job.script, str(final_path))
        job.post_compliance = post_compliance

        if post_compliance.passed:
            job.stage = PipelineStage.COMPLETE
        else:
            job.stage = PipelineStage.FAILED
            job.error = (
                f"Final video failed compliance: {', '.join(post_compliance.flagged_issues)}"
            )

        update_job(job)
        return job

    except Exception as e:
        job.stage = PipelineStage.FAILED
        job.error = f"Media generation failed: {str(e)}"
        update_job(job)
        raise


# ── Full pipeline (end-to-end) ───────────────────────────────────────────────

async def run_full_pipeline(job_id: str, audio_path: Path, mime_type: str) -> PipelineJob:
    """
    Runs the entire pipeline end-to-end:
    transcribe → script → pre-compliance → single video (no images, no stitch) → post-compliance
    """
    await run_transcription(job_id, audio_path, mime_type)
    print(f"Transcription complete")    
    job = await run_script_generation(job_id)
    print(f"Script generation complete")
    # If pre-compliance failed, stop here
    if job.stage == PipelineStage.FAILED:
        print(f"Script generation failed")
        return job

    job = await run_media_generation(job_id)
    print(f"Media generation complete")
    print(f"Final video path: {job.final_video_path}")
    return job
