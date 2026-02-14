import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sparkles, Loader2, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { getJobStatus, type PipelineStage } from "../services/api";

const STAGE_CONFIG: {
  key: PipelineStage;
  label: string;
  color: string;
}[] = [
  { key: "uploaded", label: "Audio Uploaded", color: "bg-neo-mint" },
  { key: "transcribing", label: "Transcribing Audio", color: "bg-neo-lavender" },
  { key: "pre_compliance_check", label: "Pre-Compliance Check", color: "bg-neo-lavender" },
  { key: "scripting", label: "Generating Script", color: "bg-neo-lavender" },
  { key: "generating_images", label: "Generating Scene Images", color: "bg-neo-peach" },
  { key: "generating_video", label: "Generating Video Clips", color: "bg-neo-peach" },
  { key: "stitching", label: "Assembling Final Video", color: "bg-neo-mint" },
  { key: "post_compliance_check", label: "Final Compliance Check", color: "bg-neo-lavender" },
  { key: "complete", label: "Complete!", color: "bg-neo-mint" },
];

function getStageIndex(stage: PipelineStage): number {
  const idx = STAGE_CONFIG.findIndex((s) => s.key === stage);
  return idx === -1 ? 0 : idx;
}

export default function ProgressPage() {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const [currentStage, setCurrentStage] = useState<PipelineStage>("generating_images");
  const [detail, setDetail] = useState("Starting video generation...");
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const poll = async () => {
      try {
        const status = await getJobStatus(jobId);
        setCurrentStage(status.stage);
        setDetail(status.progress_detail || "");

        if (status.stage === "complete") {
          if (pollRef.current) clearInterval(pollRef.current);
          navigate(`/result/${jobId}`);
        }
        if (status.stage === "failed") {
          if (pollRef.current) clearInterval(pollRef.current);
          setError(status.error || "Pipeline failed.");
        }
      } catch (err) {
        // don't stop polling on transient errors
        console.error("Status poll error:", err);
      }
    };

    poll();
    pollRef.current = setInterval(poll, 3000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [jobId, navigate]);

  const currentIndex = getStageIndex(currentStage);

  return (
    <div className="min-h-screen bg-neo-cream pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center mb-12">
          <div className="tag-neo mx-auto mb-4 w-fit">
            <Sparkles className="w-4 h-4" />
            Step 4 of 4
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neo-black mb-3">
            Creating Your Video
          </h1>
          <p className="text-lg text-neo-black/70">
            Sit back while our AI generates your marketing video.
          </p>
        </div>

        {/* Progress Card */}
        <div className="card-neo p-8 mb-8">
          {/* Current Status */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {currentStage !== "failed" ? (
              <Loader2 className="w-6 h-6 animate-spin text-neo-black" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600" />
            )}
            <span className="text-lg font-bold">{detail}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-4 bg-neo-cream border-2 border-neo-black rounded-full mb-10 overflow-hidden">
            <div
              className="h-full bg-neo-lavender transition-all duration-700 ease-out"
              style={{
                width: `${Math.max(5, ((currentIndex + 1) / STAGE_CONFIG.length) * 100)}%`,
              }}
            />
          </div>

          {/* Stage List */}
          <div className="space-y-3">
            {STAGE_CONFIG.map((stage, i) => {
              const isDone = i < currentIndex;
              const isCurrent = i === currentIndex && currentStage !== "failed";
              const isPending = i > currentIndex;

              return (
                <div
                  key={stage.key}
                  className={`flex items-center gap-3 p-3 rounded-neo border-2 transition-all ${
                    isCurrent
                      ? `${stage.color} border-neo-black font-bold`
                      : isDone
                      ? "bg-neo-mint/30 border-neo-black/20"
                      : "bg-neo-white/50 border-neo-black/10"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-neo-black/30 shrink-0" />
                  )}
                  <span
                    className={
                      isPending ? "text-neo-black/40" : "text-neo-black"
                    }
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="card-neo-peach p-6 text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-3" />
            <p className="font-bold text-lg mb-2">Generation Failed</p>
            <p className="text-neo-black/70 mb-4">{error}</p>
            <button onClick={() => navigate("/create")} className="btn-neo">
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
