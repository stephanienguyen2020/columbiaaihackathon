from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    # Google Gemini
    gemini_api_key: str

    # White Circle AI
    whitecircle_api_key: str
    whitecircle_base_url: str = "https://us.whitecircle.ai"
    whitecircle_deployment_id: str = ""

    # App
    upload_dir: Path = Path("./uploads")
    output_dir: Path = Path("./outputs")
    max_video_scenes: int = 8
    video_duration_seconds: int = 8

    # Gemini models
    gemini_flash_model: str = "gemini-2.5-flash"
    gemini_image_model: str = "gemini-2.5-flash-image"
    veo_model: str = "veo-3.1-generate-preview"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
settings.upload_dir.mkdir(parents=True, exist_ok=True)
settings.output_dir.mkdir(parents=True, exist_ok=True)
