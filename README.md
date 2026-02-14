# SGStudio — Voice Memo to Marketing Video

Turn a short voice memo into a 1-minute marketing video. Upload audio → get a transcript, AI-generated script, scene images, ElevenLabs narration, and a stitched video—with optional compliance checks.

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Voice Memo │────▶│  Whisper (OpenAI)│────▶│  Claude          │
│  (upload)   │     │  (transcribe)     │     │  (script gen)    │
└─────────────┘     └──────────────────┘     └────────┬─────────┘
                                                       │
                                              ┌────────▼─────────┐
                                              │  White Circle AI │
                                              │  PRE-compliance  │
                                              └────────┬─────────┘
                                                       │ ✅ pass
                                              ┌────────▼─────────┐
                                              │  ElevenLabs      │
                                              │  (narration TTS) │
                                              └────────┬─────────┘
                                                       │
                                              ┌────────▼─────────┐
                                              │  White Circle AI │
                                              │  POST-compliance  │
                                              └────────┬─────────┘
                                                       │ ✅ pass
                                              ┌────────▼─────────┐
                                              │  Final .mp4      │
                                              └──────────────────┘
```

## Tech Stack

| Layer              | Tech                         |
| ------------------ | ---------------------------- |
| **Backend**        | FastAPI (Python)             |
| **Transcription**  | OpenAI Whisper               |
| **Script**         | Anthropic Claude             |
| **Images**         | Replicate (FLUX)             |
| **Voice**          | ElevenLabs (TTS)             |
| **Compliance**     | White Circle AI (pre + post) |
| **Video assembly** | MoviePy                      |
| **Frontend**       | React + TypeScript + Vite    |

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
# Create .env with keys (see Environment section below)
uvicorn main:app --reload --port 8000
```

API docs: **http://localhost:8000/docs**

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Environment (backend)

Create `backend/.env` with:

```env
# Required for full pipeline
OPENAI_API_KEY=sk-...           # Whisper (transcription)
ANTHROPIC_API_KEY=sk-ant-...    # Claude (script)
ELEVENLABS_API_KEY=...          # Voice
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
REPLICATE_API_TOKEN=r8_...      # Scene images (FLUX)

# Optional: compliance
WHITECIRCLE_API_KEY=...
WHITECIRCLE_BASE_URL=https://us.whitecircle.ai
```

## API Overview

| Method | Endpoint                  | Description                                    |
| ------ | ------------------------- | ---------------------------------------------- |
| `POST` | `/pipeline/upload`        | Upload voice memo → get `job_id` + transcript  |
| `POST` | `/pipeline/{id}/script`   | Generate script + pre-compliance               |
| `POST` | `/pipeline/{id}/generate` | Run images → voice → stitch (background)       |
| `GET`  | `/pipeline/{id}/status`   | Poll job progress                              |
| `GET`  | `/pipeline/{id}/video`    | Download final video                           |
| `GET`  | `/pipeline/videos`        | List completed videos                          |
| `POST` | `/pipeline/full`          | One-shot: upload → full pipeline in background |
| `GET`  | `/health`                 | Health check                                   |

### Example: upload and run

```bash
# Upload voice memo
curl -X POST http://localhost:8000/pipeline/upload -F "audio=@voice_memo.m4a"

# Generate script (use job_id from response)
curl -X POST http://localhost:8000/pipeline/{job_id}/script

# Start video generation
curl -X POST http://localhost:8000/pipeline/{job_id}/generate

# Poll until complete, then download
curl -O -J "http://localhost:8000/pipeline/{job_id}/video"
```

## Project Structure

```
SGS/
├── backend/
│   ├── main.py              # FastAPI app + routes
│   ├── config.py            # Settings (env)
│   ├── schemas.py           # Pydantic models
│   ├── pipeline.py          # Orchestrator
│   ├── whisper_service.py    # Transcription
│   ├── claude_service.py    # Script generation
│   ├── image_service.py    # Replicate FLUX images
│   ├── elevenlabs_service.py # TTS
│   ├── video_stitcher.py    # MoviePy (images + audio → video)
│   ├── whitecircle_service.py # Compliance
│   ├── instagram_service.py # Optional: post to Instagram
│   ├── requirements.txt
│   └── README.md
├── frontend/                # React + Vite app
│   └── ...
└── README.md                 # This file
```

## License

Private repository.
