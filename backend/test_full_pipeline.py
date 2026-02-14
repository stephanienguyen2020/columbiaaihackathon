#!/usr/bin/env python3
"""
Run the full VidPipe pipeline with a real voice file (in-process, no server).

Usage:
  python test_full_pipeline.py <path_to_audio>
  .venv/bin/python test_full_pipeline.py ./my_voice_memo.wav

Supported: .wav, .mp3, .m4a, .webm, .ogg
"""
import asyncio
import sys
from pathlib import Path

# Project root on path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from config import settings
from pipeline import create_job, get_job, run_full_pipeline
from schemas import PipelineStage


EXT_TO_MIME = {
    ".wav": "audio/wav",
    ".mp3": "audio/mpeg",
    ".m4a": "audio/mp4",
    ".webm": "audio/webm",
    ".ogg": "audio/ogg",
}


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        print("Example:  python test_full_pipeline.py /path/to/voice.wav")
        sys.exit(1)

    audio_path = Path(sys.argv[1]).resolve()
    if not audio_path.exists():
        print(f"File not found: {audio_path}")
        sys.exit(1)

    suffix = audio_path.suffix.lower()
    mime = EXT_TO_MIME.get(suffix, "audio/wav")
    if suffix and suffix not in EXT_TO_MIME:
        print(f"Warning: unknown extension {suffix}, using audio/wav")

    job = create_job()
    job_id = job.job_id
    print(f"Job ID: {job_id}")
    print(f"Audio:  {audio_path} ({mime})")
    print("Running full pipeline: transcribe → script → pre-compliance → images → videos → stitch → post-compliance")
    print("-" * 60)

    async def run():
        return await run_full_pipeline(job_id, audio_path, mime)

    try:
        final_job = asyncio.run(run())
    except Exception as e:
        print(f"Pipeline error: {e}")
        job = get_job(job_id)
        if job:
            print(f"Stage: {job.stage.value if job.stage else '?'}")
            if job.error:
                print(f"Detail: {job.error}")
        sys.exit(1)

    print("-" * 60)
    print(f"Stage: {final_job.stage.value}")
    if final_job.error:
        print(f"Error: {final_job.error}")
    if final_job.transcript:
        print(f"Transcript (first 200 chars): {final_job.transcript[:200]}...")
    if final_job.script:
        print(f"Script title: {final_job.script.title}")
    if final_job.pre_compliance:
        print(f"Pre-compliance passed: {final_job.pre_compliance.passed}")
    if final_job.final_video_path:
        print(f"Final video: {final_job.final_video_path}")
        if Path(final_job.final_video_path).exists():
            print(f"  (file exists, size {Path(final_job.final_video_path).stat().st_size} bytes)")
    if final_job.post_compliance:
        print(f"Post-compliance passed: {final_job.post_compliance.passed}")

    if final_job.stage == PipelineStage.COMPLETE:
        print("\n✅ Full pipeline completed successfully.")
    else:
        print("\n❌ Pipeline did not complete (see stage/error above).")
        if "401" in (final_job.error or "") or "Invalid API key" in (final_job.error or ""):
            print("   Tip: Check WHITECIRCLE_API_KEY (and WHITECIRCLE_DEPLOYMENT_ID) in .env")
        sys.exit(1)


if __name__ == "__main__":
    main()
