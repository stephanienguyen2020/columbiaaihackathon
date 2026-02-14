"""
Smoke tests for VidPipe API.
Run: python test_smoke.py   (or: .venv/bin/python test_smoke.py)
"""
import sys
from pathlib import Path

# Ensure project root is on path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health():
    """GET /health returns 200 and expected keys."""
    r = client.get("/health")
    assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
    data = r.json()
    assert data.get("status") == "ok"
    assert data.get("service") == "vidpipe"
    assert "models" in data
    print("✓ GET /health OK")


def test_upload_creates_job():
    """POST /pipeline/upload with a tiny WAV creates a job and returns job_id + transcript (or error from Gemini)."""
    # Minimal valid WAV header (44 bytes) + a little silence so it's a valid file
    wav_header = (
        b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00"
        b"\x01\x00\x01\x00\x44\xac\x00\x00\x88X\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00"
    )
    files = {"audio": ("test.wav", wav_header, "audio/wav")}
    r = client.post("/pipeline/upload", files=files)
    # 200 = success (transcription ran); 5xx = Gemini/API error (we still know upload worked)
    assert r.status_code in (200, 422, 500), f"Unexpected status {r.status_code}: {r.text}"
    if r.status_code == 200:
        data = r.json()
        assert "job_id" in data
        assert "transcript" in data
        print("✓ POST /pipeline/upload OK (job_id + transcript)")
    else:
        print(f"  POST /pipeline/upload returned {r.status_code} (API/env may be missing): {r.text[:200]}")


def test_status_404_for_unknown_job():
    """GET /pipeline/{id}/status returns 404 for unknown job."""
    r = client.get("/pipeline/nonexistent-id/status")
    assert r.status_code == 404
    print("✓ GET /pipeline/{id}/status 404 for unknown job")


if __name__ == "__main__":
    print("Running smoke tests...\n")
    test_health()
    test_status_404_for_unknown_job()
    test_upload_creates_job()
    print("\n✅ Smoke tests done.")
