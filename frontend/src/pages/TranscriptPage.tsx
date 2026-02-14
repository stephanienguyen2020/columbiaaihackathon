import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Sparkles, ArrowLeft, ArrowRight, Loader2, FileText, Headphones } from "lucide-react";
import { generateScript } from "../services/api";

export default function TranscriptPage() {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const location = useLocation();
  const locationState = location.state as { transcript?: string; audioUrl?: string } | null;
  const transcript = locationState?.transcript || "";
  const audioUrl = locationState?.audioUrl || null;

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateScript = async () => {
    if (!jobId) return;
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateScript(jobId);
      navigate(`/script/${jobId}`, {
        state: { script: result.script, compliance: result.compliance },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Script generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Split transcript into sections
  const parts = transcript.split(/\n\n(?=BRIEF:)/);
  const transcriptionText = parts[0]?.replace(/^TRANSCRIPTION:\n?/, "").trim() || transcript;
  const briefText = parts[1]?.replace(/^BRIEF:\n?/, "").trim() || "";

  return (
    <div className="min-h-screen bg-neo-cream pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-6">
        <button
          onClick={() => navigate("/create")}
          className="mb-8 flex items-center gap-2 text-sm font-bold text-neo-black hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Record Again
        </button>

        <div className="text-center mb-10">
          <div className="tag-neo mx-auto mb-4 w-fit">
            <Sparkles className="w-4 h-4" />
            Step 2 of 4
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neo-black mb-3">
            Your Transcript
          </h1>
          <p className="text-lg text-neo-black/70">
            Here's what we heard. Review it before we generate your marketing script.
          </p>
        </div>

        {/* Audio Playback */}
        {audioUrl && (
          <div className="card-neo-mint p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-neo-white border-neo border-neo-black flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Your Voice Memo</h2>
            </div>
            <audio
              src={audioUrl}
              controls
              className="w-full"
              style={{ borderRadius: "16px" }}
            />
          </div>
        )}

        {/* Transcription */}
        <div className="card-neo p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-neo-lavender border-neo border-neo-black flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">Transcription</h2>
          </div>
          <div className="bg-neo-cream/60 border-2 border-neo-black/20 rounded-neo p-5">
            <p className="text-neo-black leading-relaxed whitespace-pre-wrap">
              {transcriptionText || "No transcription available."}
            </p>
          </div>
        </div>

        {/* Brief */}
        {briefText && (
          <div className="card-neo-lavender p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-neo-white border-neo border-neo-black flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Extracted Marketing Brief</h2>
            </div>
            <div className="bg-neo-white/60 border-2 border-neo-black/20 rounded-neo p-5">
              <p className="text-neo-black leading-relaxed whitespace-pre-wrap">
                {briefText}
              </p>
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
        <button
          onClick={handleGenerateScript}
          disabled={isGenerating}
          className={`w-full py-4 text-lg font-bold rounded-neo border-neo border-neo-black transition-all duration-150 ${
            !isGenerating
              ? "bg-neo-black text-neo-cream shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              : "bg-neo-black/30 text-neo-black/50 cursor-not-allowed"
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Marketing Script...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Generate Script
              <ArrowRight className="w-5 h-5" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
