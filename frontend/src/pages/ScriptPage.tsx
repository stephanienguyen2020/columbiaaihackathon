import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Sparkles,
  ArrowLeft,
  Loader2,
  Film,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Users,
  Volume2,
  Camera,
} from "lucide-react";
import {
  startGeneration,
  type MarketingScript,
  type ComplianceResult,
} from "../services/api";

export default function ScriptPage() {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const location = useLocation();
  const script = (location.state as { script?: MarketingScript })?.script;
  const compliance = (location.state as { compliance?: ComplianceResult })
    ?.compliance;

  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!jobId) return;
    setIsStarting(true);
    setError(null);
    try {
      await startGeneration(jobId, script || undefined);
      navigate(`/progress/${jobId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start generation."
      );
    } finally {
      setIsStarting(false);
    }
  };

  if (!script) {
    return (
      <div className="min-h-screen bg-neo-cream pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h1 className="text-3xl font-bold mb-4">No Script Found</h1>
          <p className="text-neo-black/70 mb-6">
            Something went wrong. Please start over.
          </p>
          <button onClick={() => navigate("/create")} className="btn-neo">
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const compliancePassed = compliance?.passed !== false;

  return (
    <div className="min-h-screen bg-neo-cream pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm font-bold text-neo-black hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center mb-10">
          <div className="tag-neo mx-auto mb-4 w-fit">
            <Sparkles className="w-4 h-4" />
            Step 3 of 4
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neo-black mb-3">
            Your Marketing Script
          </h1>
          <p className="text-lg text-neo-black/70">
            Review the AI-generated script and approve it to start video
            generation.
          </p>
        </div>

        {/* Script Header */}
        <div className="card-neo p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">{script.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-neo-black/70" />
              <span className="text-sm">
                <span className="font-bold">Audience:</span>{" "}
                {script.target_audience}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-neo-black/70" />
              <span className="text-sm">
                <span className="font-bold">Tone:</span> {script.tone}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neo-black/70" />
              <span className="text-sm">
                <span className="font-bold">Duration:</span>{" "}
                {script.total_duration_seconds}s
              </span>
            </div>
          </div>
          {script.cta && (
            <div className="mt-4 p-3 bg-neo-mint/40 border-2 border-neo-black/20 rounded-neo">
              <span className="text-sm font-bold">CTA: </span>
              <span className="text-sm">{script.cta}</span>
            </div>
          )}
        </div>

        {/* Compliance */}
        <div
          className={`p-6 mb-6 border-neo border-neo-black rounded-neo shadow-neo ${
            compliancePassed ? "bg-neo-mint" : "bg-neo-peach"
          }`}
        >
          <div className="flex items-center gap-3">
            {compliancePassed ? (
              <ShieldCheck className="w-6 h-6" />
            ) : (
              <ShieldAlert className="w-6 h-6" />
            )}
            <div>
              <h3 className="font-bold">
                {compliancePassed
                  ? "Compliance Check Passed - by White Circle AI"
                  : "Compliance Issues Found - by White Circle AI"}
              </h3>
              {compliance?.flagged_issues &&
                compliance.flagged_issues.length > 0 && (
                  <ul className="mt-2 text-sm space-y-1">
                    {compliance.flagged_issues.map((issue, i) => (
                      <li key={i}>- {issue}</li>
                    ))}
                  </ul>
                )}
            </div>
          </div>
        </div>

        {/* Video Scene */}
        {script.scenes.length > 0 && (
          <div className="card-neo p-8 mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-neo-peach border-neo border-neo-black flex items-center justify-center">
                <Film className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">Video Scene</h3>
              <div className="ml-auto flex items-center gap-3 text-sm text-neo-black/70">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {script.scenes[0].duration_seconds}s
                </span>
                <span className="flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  {script.scenes[0].camera_direction}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-neo-cream/60 border-2 border-neo-black/20 rounded-neo p-5">
                <p className="text-sm font-bold text-neo-black/60 mb-2">Narration</p>
                <p className="text-neo-black italic text-lg">"{script.scenes[0].narration}"</p>
              </div>
              <div className="bg-neo-lavender/20 border-2 border-neo-black/20 rounded-neo p-5">
                <p className="text-sm font-bold text-neo-black/60 mb-2">Visual Description</p>
                <p className="text-neo-black/80">{script.scenes[0].visual_description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="card-neo-peach p-4 mb-6 text-center">
            <p className="font-bold text-neo-black">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/create")}
            className="btn-neo flex-1 text-center"
          >
            Start Over
          </button>
          <button
            onClick={handleGenerate}
            disabled={isStarting || !compliancePassed}
            className={`flex-1 py-4 text-lg font-bold rounded-neo border-neo border-neo-black transition-all duration-150 ${
              !isStarting && compliancePassed
                ? "bg-neo-black text-neo-cream shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                : "bg-neo-black/30 text-neo-black/50 cursor-not-allowed"
            }`}
          >
            {isStarting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Starting...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Film className="w-5 h-5" />
                Generate Video
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
