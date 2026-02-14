from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional
from datetime import datetime


# ── Pipeline Status ──────────────────────────────────────────────────────────

class PipelineStage(str, Enum):
    UPLOADED = "uploaded"
    TRANSCRIBING = "transcribing"
    PRE_COMPLIANCE = "pre_compliance_check"
    SCRIPTING = "scripting"
    IMAGE_GEN = "generating_images"
    VIDEO_GEN = "generating_video"
    STITCHING = "stitching"
    POST_COMPLIANCE = "post_compliance_check"
    COMPLETE = "complete"
    FAILED = "failed"


class ComplianceResult(BaseModel):
    passed: bool
    decision: str = ""
    actions: list[str] = []
    flagged_issues: list[str] = []
    raw_response: Optional[dict] = None


class SceneScript(BaseModel):
    scene_number: int
    duration_seconds: float = Field(ge=1, le=12)
    narration: str
    visual_description: str
    camera_direction: str = ""
    transition: str = "cut"


class MarketingScript(BaseModel):
    title: str
    target_audience: str
    tone: str
    total_duration_seconds: float
    scenes: list[SceneScript]
    cta: str = ""  # call to action


class PipelineJob(BaseModel):
    job_id: str
    stage: PipelineStage = PipelineStage.UPLOADED
    created_at: datetime = Field(default_factory=datetime.utcnow)
    transcript: Optional[str] = None
    script: Optional[MarketingScript] = None
    pre_compliance: Optional[ComplianceResult] = None
    post_compliance: Optional[ComplianceResult] = None
    image_paths: list[str] = []
    video_clip_paths: list[str] = []
    final_video_path: Optional[str] = None
    error: Optional[str] = None


# ── API Request/Response ─────────────────────────────────────────────────────

class TranscribeResponse(BaseModel):
    job_id: str
    transcript: str


class ScriptResponse(BaseModel):
    job_id: str
    script: MarketingScript
    compliance: ComplianceResult


class GenerateRequest(BaseModel):
    """Optional overrides when triggering generation after script approval."""
    approved_script: Optional[MarketingScript] = None


class JobStatusResponse(BaseModel):
    job_id: str
    stage: PipelineStage
    progress_detail: str = ""
    final_video_url: Optional[str] = None
    error: Optional[str] = None


class VideoSummary(BaseModel):
    job_id: str
    title: str = ""
    stage: PipelineStage
    created_at: datetime
    video_url: Optional[str] = None
