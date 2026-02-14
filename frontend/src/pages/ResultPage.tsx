import { useParams, useNavigate } from "react-router-dom";
import { Sparkles, Download, RotateCcw, Home } from "lucide-react";
import { getVideoUrl } from "../services/api";

export default function ResultPage() {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();

  const videoUrl = jobId ? getVideoUrl(jobId) : "";

  return (
    <div className="min-h-screen bg-neo-cream pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-10">
          <div className="tag-neo mx-auto mb-4 w-fit">
            <Sparkles className="w-4 h-4" />
            Done!
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neo-black mb-3">
            Your Video is Ready
          </h1>
          <p className="text-lg text-neo-black/70">
            Your AI-generated marketing video is ready to preview and download.
          </p>
        </div>

        {/* Video Player */}
        <div className="card-neo p-4 mb-8">
          <div className="aspect-[9/16] max-h-[600px] mx-auto bg-neo-black rounded-lg overflow-hidden">
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={videoUrl}
            download
            className="btn-neo-black flex-1 text-center flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Video
          </a>
          <button
            onClick={() => navigate("/create")}
            className="btn-neo-mint flex-1 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Create Another
          </button>
          <button
            onClick={() => navigate("/")}
            className="btn-neo flex-1 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
