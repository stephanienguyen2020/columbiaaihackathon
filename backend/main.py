"""
VidPipe API - Voice Memo to Marketing Video Pipeline

Routes:
  POST /pipeline/upload          Upload voice memo, get job_id + transcript
  POST /pipeline/{id}/script     Generate script + pre-compliance check
  POST /pipeline/{id}/generate   Approve & generate images → video → stitch
  POST /pipeline/{id}/full       Run entire pipeline end-to-end (auto mode)
  GET  /pipeline/{id}/status     Poll job status
  GET  /pipeline/{id}/video      Download final video
  GET  /pipeline/videos          List all generated videos
  GET  /health                   Health check
"""

import shutil
import asyncio
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from schemas import (
    PipelineJob,
    PipelineStage,
    TranscribeResponse,
    ScriptResponse,
    GenerateRequest,
    JobStatusResponse,
    VideoSummary,
)
from pipeline import (
    create_job,
    get_job,
    run_transcription,
    run_script_generation,
    run_media_generation,
    run_full_pipeline,
)


# ── App lifecycle ────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    settings.output_dir.mkdir(parents=True, exist_ok=True)
    print("🎬 VidPipe API ready")
    yield
    print("👋 Shutting down")


app = FastAPI(
    title="VidPipe - Voice to Marketing Video Pipeline",
    description=(
        "Upload a voice memo → AI generates a 1-minute marketing video. "
        "Powered by Whisper (transcription), Claude (script), Replicate FLUX (images), "
        "ElevenLabs (voice), and White Circle AI (compliance)."
    ),
    version="0.1.0",
    lifespan=lifespan,
)

# CORS for v0 frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health check ─────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "vidpipe",
        "models": {
            "transcription": "whisper-1",
            "script": settings.claude_model,
            "image_gen": settings.replicate_flux_model,
            "voice": "elevenlabs",
        },
    }


# ── Step 1: Upload voice memo ───────────────────────────────────────────────

@app.post("/pipeline/upload", response_model=TranscribeResponse)
async def upload_voice_memo(
    audio: UploadFile = File(..., description="Voice memo audio file (wav, mp3, m4a, webm)"),
):
    """
    Upload a voice memo. Returns the job ID and transcription.
    The transcription includes both raw text and extracted marketing brief.
    """
    # Validate file type
    allowed_types = {
        "audio/wav", "audio/x-wav", "audio/mpeg", "audio/mp3",
        "audio/mp4", "audio/m4a", "audio/x-m4a", "audio/webm",
        "audio/ogg", "video/webm",
    }
    content_type = audio.content_type or "audio/wav"
    if content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported audio format: {content_type}. Supported: wav, mp3, m4a, webm, ogg",
        )

    # Create job and save file
    job = create_job()
    audio_path = settings.upload_dir / f"{job.job_id}_{audio.filename}"

    with open(audio_path, "wb") as f:
        shutil.copyfileobj(audio.file, f)

    # Transcribe
    await run_transcription(job.job_id, audio_path, content_type)
    job = get_job(job.job_id)

    return TranscribeResponse(
        job_id=job.job_id,
        transcript=job.transcript or "",
    )


# ── Step 2: Generate script ─────────────────────────────────────────────────

@app.post("/pipeline/{job_id}/script", response_model=ScriptResponse)
async def generate_script_endpoint(job_id: str):
    """
    Generate a marketing script from the transcription.
    Automatically runs pre-compliance check via White Circle.
    Returns the script + compliance result for frontend review.
    """
    job = get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if not job.transcript:
        raise HTTPException(status_code=400, detail="No transcript available. Upload audio first.")

    await run_script_generation(job_id)
    job = get_job(job_id)

    if not job.script:
        raise HTTPException(status_code=500, detail=job.error or "Script generation failed")

    return ScriptResponse(
        job_id=job.job_id,
        script=job.script,
        compliance=job.pre_compliance,
    )


# ── Step 3: Generate media (images + video + stitch) ────────────────────────

@app.post("/pipeline/{job_id}/generate", response_model=JobStatusResponse)
async def generate_media(
    job_id: str,
    request: GenerateRequest = GenerateRequest(),
    background_tasks: BackgroundTasks = BackgroundTasks(),
):
    """
    Kick off image + video generation. Runs in background.
    Optionally accepts an edited/approved script from the frontend.
    Poll GET /pipeline/{job_id}/status for progress.
    """
    job = get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if not job.script and not request.approved_script:
        raise HTTPException(status_code=400, detail="No script available")
    if job.pre_compliance and not job.pre_compliance.passed:
        raise HTTPException(
            status_code=400,
            detail="Script failed compliance. Edit and resubmit.",
        )

    # Run in background so we don't timeout
    background_tasks.add_task(
        run_media_generation, job_id, request.approved_script
    )

    return JobStatusResponse(
        job_id=job.job_id,
        stage=PipelineStage.IMAGE_GEN,
        progress_detail="Media generation started. Poll /status for updates.",
    )


# ── Full auto pipeline ──────────────────────────────────────────────────────

@app.post("/pipeline/full", response_model=JobStatusResponse)
async def full_pipeline(
    audio: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks(),
):
    """
    One-shot: upload voice memo → full pipeline runs in background.
    Returns job_id immediately. Poll /status for progress.
    """
    content_type = audio.content_type or "audio/wav"
    job = create_job()
    audio_path = settings.upload_dir / f"{job.job_id}_{audio.filename}"

    with open(audio_path, "wb") as f:
        shutil.copyfileobj(audio.file, f)

    background_tasks.add_task(
        run_full_pipeline, job.job_id, audio_path, content_type
    )

    return JobStatusResponse(
        job_id=job.job_id,
        stage=PipelineStage.UPLOADED,
        progress_detail="Full pipeline started. Poll /status for updates.",
    )


# ── List all generated videos ────────────────────────────────────────────────

@app.get("/pipeline/videos", response_model=list[VideoSummary])
async def list_videos():
    """Scan the outputs directory for completed videos and return summaries."""
    from datetime import datetime

    results: list[VideoSummary] = []
    output_dir = settings.output_dir

    if not output_dir.exists():
        return results

    for job_dir in output_dir.iterdir():
        if not job_dir.is_dir():
            continue
        video_path = job_dir / "clips" / "video.mp4"
        if not video_path.exists():
            continue

        job_id = job_dir.name
        # Try to get title from in-memory job if available
        job = get_job(job_id)
        title = job.script.title if job and job.script else ""
        created_at = (
            job.created_at
            if job
            else datetime.fromtimestamp(video_path.stat().st_mtime)
        )

        results.append(
            VideoSummary(
                job_id=job_id,
                title=title,
                stage=PipelineStage.COMPLETE,
                created_at=created_at,
                video_url=f"/pipeline/{job_id}/video",
            )
        )

    results.sort(key=lambda v: v.created_at, reverse=True)
    return results


# ── Status polling ───────────────────────────────────────────────────────────

@app.get("/pipeline/{job_id}/status", response_model=JobStatusResponse)
async def get_status(job_id: str):
    """Poll the current status of a pipeline job."""
    job = get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    video_url = None
    if job.final_video_path and job.stage == PipelineStage.COMPLETE:
        video_url = f"/pipeline/{job_id}/video"

    return JobStatusResponse(
        job_id=job.job_id,
        stage=job.stage,
        progress_detail=_stage_description(job.stage),
        final_video_url=video_url,
        error=job.error,
    )


# ── Download final video ────────────────────────────────────────────────────

@app.get("/pipeline/{job_id}/video")
async def download_video(job_id: str):
    """Download the final marketing video."""
    # Try in-memory job first
    job = get_job(job_id)
    if job and job.final_video_path:
        path = Path(job.final_video_path)
        if path.exists():
            return FileResponse(path=str(path), media_type="video/mp4", filename=path.name)

    # Fallback: look on disk in outputs directory
    disk_path = settings.output_dir / job_id / "clips" / "video.mp4"
    if disk_path.exists():
        return FileResponse(path=str(disk_path), media_type="video/mp4", filename=disk_path.name)

    raise HTTPException(status_code=404, detail="Video not found")


# ── Get full job details (for debugging / frontend) ─────────────────────────

@app.get("/pipeline/{job_id}/details")
async def get_job_details(job_id: str):
    """Get full job details including script, compliance, paths."""
    job = get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


# ── Helpers ──────────────────────────────────────────────────────────────────

def _stage_description(stage: PipelineStage) -> str:
    return {
        PipelineStage.UPLOADED: "Voice memo uploaded",
        PipelineStage.TRANSCRIBING: "Transcribing voice memo with Whisper...",
        PipelineStage.PRE_COMPLIANCE: "Running pre-generation compliance check...",
        PipelineStage.SCRIPTING: "Generating marketing script with Claude...",
        PipelineStage.IMAGE_GEN: "Generating scene images with Replicate FLUX...",
        PipelineStage.VIDEO_GEN: "Generating voice with ElevenLabs...",
        PipelineStage.STITCHING: "Assembling final video...",
        PipelineStage.POST_COMPLIANCE: "Running post-generation compliance check...",
        PipelineStage.COMPLETE: "✅ Video ready for download!",
        PipelineStage.FAILED: "❌ Pipeline failed",
    }.get(stage, str(stage))


# ── Run ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
