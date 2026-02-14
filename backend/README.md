# 🎬 VidPipe — Voice Memo to Marketing Video Pipeline

**Turn a 30-second voice memo into a 1-minute marketing video.**  
What used to cost $$$ with an agency now costs a few dozen prompts.

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Voice Memo │────▶│  Gemini Flash    │────▶│  Gemini Flash    │
│  (phone)    │     │  (transcribe)    │     │  (script gen)    │
└─────────────┘     └──────────────────┘     └────────┬─────────┘
                                                       │
                                              ┌────────▼─────────┐
                                              │  White Circle AI │
                                              │  PRE-compliance  │
                                              └────────┬─────────┘
                                                       │ ✅ pass
                                              ┌────────▼─────────┐
                                              │  Nano Banana     │
                                              │  (scene images)  │
                                              └────────┬─────────┘
                                                       │
                                              ┌────────▼─────────┐
                                              │  Veo 3           │
                                              │  (scene videos)  │
                                              └────────┬─────────┘
                                                       │
                                              ┌────────▼─────────┐
                                              │  MoviePy         │
                                              │  (stitch clips)  │
                                              └────────┬─────────┘
                                                       │
                                              ┌────────▼─────────┐
                                              │  White Circle AI │
                                              │  POST-compliance │
                                              └────────┬─────────┘
                                                       │ ✅ pass
                                              ┌────────▼─────────┐
                                              │  Final .mp4      │
                                              │  ready to ship   │
                                              └──────────────────┘
```

## Tech Stack

| Layer | Tech |
|-------|------|
| **Backend** | FastAPI (Python) |
| **Transcription** | Gemini 2.5 Flash (multimodal audio) |
| **Script Generation** | Gemini 2.5 Flash |
| **Image Generation** | Nano Banana (gemini-2.5-flash-image) |
| **Video Generation** | Veo 3 (veo-3.0-generate-preview) |
| **Compliance** | White Circle AI (pre + post gen) |
| **Video Assembly** | MoviePy |
| **Frontend** | v0 (separate repo) |

## Quick Start

```bash
# 1. Clone & install
cd vidpipe
pip install -r requirements.txt

# 2. Configure
cp .env.example .env
# Edit .env with your API keys

# 3. Run
uvicorn main:app --reload --port 8000

# 4. Open docs
open http://localhost:8000/docs
```

## API Endpoints

### Step-by-step mode (recommended for frontend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/pipeline/upload` | Upload voice memo → get transcript |
| `POST` | `/pipeline/{id}/script` | Generate script + pre-compliance |
| `POST` | `/pipeline/{id}/generate` | Approve → images + video (background) |
| `GET` | `/pipeline/{id}/status` | Poll progress |
| `GET` | `/pipeline/{id}/video` | Download final video |
| `GET` | `/pipeline/{id}/details` | Full job details (debug) |

### One-shot mode

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/pipeline/full` | Upload → full pipeline in background |

## Frontend Integration (v0)

The API is designed for a step-by-step UX:

```
Screen 1: Record/upload voice memo
    → POST /pipeline/upload
    → Show transcript for review

Screen 2: Review generated script
    → POST /pipeline/{id}/script
    → Show script + compliance status
    → User can edit scenes before approving

Screen 3: Generation progress
    → POST /pipeline/{id}/generate
    → Poll GET /pipeline/{id}/status
    → Show progress bar with stage descriptions

Screen 4: Preview & download
    → GET /pipeline/{id}/video
    → Video player + download button
```

### Example: Upload voice memo

```bash
curl -X POST http://localhost:8000/pipeline/upload \
  -F "audio=@my_voice_memo.m4a"
```

Response:
```json
{
  "job_id": "a1b2c3d4",
  "transcript": "TRANSCRIPTION:\nI want to create a video for our new coffee brand...\n\nBRIEF:\n- Product: Artisan cold brew coffee..."
}
```

### Example: Generate script

```bash
curl -X POST http://localhost:8000/pipeline/a1b2c3d4/script
```

Response:
```json
{
  "job_id": "a1b2c3d4",
  "script": {
    "title": "Rise & Brew",
    "target_audience": "millennial coffee enthusiasts",
    "tone": "warm, energetic",
    "total_duration_seconds": 60,
    "scenes": [
      {
        "scene_number": 1,
        "duration_seconds": 8,
        "narration": "Every morning deserves a perfect start.",
        "visual_description": "Golden sunrise over a misty mountain...",
        "camera_direction": "slow aerial pull back",
        "transition": "fade"
      }
    ],
    "cta": "Try Rise & Brew — order now at riseandrew.com"
  },
  "compliance": {
    "passed": true,
    "decision": "allow",
    "actions": [],
    "flagged_issues": []
  }
}
```

## White Circle Integration

White Circle AI runs at two checkpoints:

1. **Pre-generation** (`/pipeline/{id}/script`): Validates the script before spending on expensive image/video generation. Catches misleading claims, regulatory issues, brand safety problems.

2. **Post-generation** (`/pipeline/{id}/generate` → final step): Final compliance sweep on the assembled content before delivery.

If either check fails, the pipeline stops and returns flagged issues to the frontend for the user to address.

## Project Structure

```
vidpipe/
├── main.py                    # FastAPI app + routes
├── app/
│   └── config.py              # Pydantic settings
├── models/
│   └── schemas.py             # Request/response schemas
├── services/
│   ├── gemini_service.py      # Gemini: transcribe, script, images, video
│   ├── whitecircle_service.py # White Circle: compliance checks
│   ├── video_stitcher.py      # MoviePy: stitch clips
│   └── pipeline.py            # Orchestrator
├── requirements.txt
├── .env.example
└── README.md
```

## Cost Estimate (per video)

| Step | Model | Est. Cost |
|------|-------|-----------|
| Transcription | Gemini Flash | ~$0.001 |
| Script Gen | Gemini Flash | ~$0.002 |
| Images (6 scenes) | Nano Banana | ~$0.02 |
| Videos (6 clips) | Veo 3 | ~$4.50 |
| Compliance (2 checks) | White Circle | TBD |
| **Total** | | **~$4.50** |

vs. Agency: **$5,000 - $50,000+**
