from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    # Anthropic Claude (script generation)
    anthropic_api_key: str = ""
    claude_model: str = "claude-sonnet-4-20250514"

    # OpenAI Whisper (transcription; Claude does not support audio input)
    openai_api_key: str = ""

    # ElevenLabs (voice / TTS)
    elevenlabs_api_key: str = ""
    elevenlabs_voice_id: str = "21m00Tcm4TlvDq8ikWAM"  # Rachel default

    # Replicate (scene images for video)
    replicate_api_token: str = ""
    replicate_flux_model: str = "black-forest-labs/flux-schnell"

    # White Circle AI
    whitecircle_api_key: str = ""
    whitecircle_base_url: str = "https://us.whitecircle.ai"
    whitecircle_deployment_id: str = ""

    # App
    upload_dir: Path = Path("./uploads")
    output_dir: Path = Path("./outputs")
    max_video_scenes: int = 8
    video_duration_seconds: int = 8

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
settings.upload_dir.mkdir(parents=True, exist_ok=True)
settings.output_dir.mkdir(parents=True, exist_ok=True)
