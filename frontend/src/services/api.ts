const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface TranscribeResponse {
  job_id: string;
  transcript: string;
}

export interface SceneScript {
  scene_number: number;
  duration_seconds: number;
  narration: string;
  visual_description: string;
  camera_direction: string;
  transition: string;
}

export interface MarketingScript {
  title: string;
  target_audience: string;
  tone: string;
  total_duration_seconds: number;
  cta: string;
  scenes: SceneScript[];
}

export interface ComplianceResult {
  passed: boolean;
  decision: string;
  actions: string[];
  flagged_issues: string[];
  raw_response?: Record<string, unknown>;
}

export interface ScriptResponse {
  job_id: string;
  script: MarketingScript;
  compliance: ComplianceResult;
}

export type PipelineStage =
  | "uploaded"
  | "transcribing"
  | "pre_compliance_check"
  | "scripting"
  | "generating_images"
  | "generating_video"
  | "stitching"
  | "post_compliance_check"
  | "complete"
  | "failed";

export interface JobStatusResponse {
  job_id: string;
  stage: PipelineStage;
  progress_detail: string;
  final_video_url: string | null;
  error: string | null;
}

export async function uploadAudio(file: File): Promise<TranscribeResponse> {
  const form = new FormData();
  form.append("audio", file);
  const res = await fetch(`${API_BASE}/pipeline/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail || "Upload failed");
  }
  return res.json();
}

export async function generateScript(jobId: string): Promise<ScriptResponse> {
  const res = await fetch(`${API_BASE}/pipeline/${jobId}/script`, {
    method: "POST",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Script generation failed" }));
    throw new Error(err.detail || "Script generation failed");
  }
  return res.json();
}

export async function startGeneration(
  jobId: string,
  approvedScript?: MarketingScript
): Promise<JobStatusResponse> {
  const res = await fetch(`${API_BASE}/pipeline/${jobId}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      approvedScript ? { approved_script: approvedScript } : {}
    ),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Generation failed" }));
    throw new Error(err.detail || "Generation failed");
  }
  return res.json();
}

export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  const res = await fetch(`${API_BASE}/pipeline/${jobId}/status`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Status check failed" }));
    throw new Error(err.detail || "Status check failed");
  }
  return res.json();
}

export function getVideoUrl(jobId: string): string {
  return `${API_BASE}/pipeline/${jobId}/video`;
}

export interface VideoSummary {
  job_id: string;
  title: string;
  stage: PipelineStage;
  created_at: string;
  video_url: string | null;
}

export async function listVideos(): Promise<VideoSummary[]> {
  const res = await fetch(`${API_BASE}/pipeline/videos`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to load videos" }));
    throw new Error(err.detail || "Failed to load videos");
  }
  return res.json();
}
