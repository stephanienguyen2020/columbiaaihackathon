import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Play, ArrowLeft, Loader2, Film, Plus } from "lucide-react";
import { listVideos, getVideoUrl, type VideoSummary } from "../services/api";

export default function GalleryPage() {
  const [videos, setVideos] = useState<VideoSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    listVideos()
      .then(setVideos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-neo-cream pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-6">
        <Link
          to="/"
          className="mb-8 flex items-center gap-2 text-sm font-bold text-neo-black hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center mb-10">
          <div className="tag-neo mx-auto mb-4 w-fit">
            <Sparkles className="w-4 h-4" />
            Gallery
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neo-black mb-3">
            Generated Videos
          </h1>
          <p className="text-lg text-neo-black/70">
            Browse all your AI-generated marketing videos.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-neo-black" />
            <span className="ml-3 font-bold text-lg">Loading videos...</span>
          </div>
        )}

        {error && (
          <div className="card-neo-peach p-6 text-center">
            <p className="font-bold">{error}</p>
          </div>
        )}

        {!loading && !error && videos.length === 0 && (
          <div className="card-neo p-12 text-center">
            <Film className="w-16 h-16 mx-auto mb-4 text-neo-black/30" />
            <h2 className="text-2xl font-bold mb-2">No videos yet</h2>
            <p className="text-neo-black/60 mb-6">
              Create your first AI-generated marketing video!
            </p>
            <Link to="/create" className="btn-neo-peach inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Video
            </Link>
          </div>
        )}

        {!loading && videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.job_id} className="card-neo overflow-hidden flex flex-col">
                {/* Video / Thumbnail */}
                <div className="aspect-[9/16] max-h-[360px] bg-neo-black relative">
                  {playingId === video.job_id ? (
                    <video
                      src={getVideoUrl(video.job_id)}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                      playsInline
                    />
                  ) : (
                    <button
                      onClick={() => setPlayingId(video.job_id)}
                      className="w-full h-full flex items-center justify-center group"
                    >
                      <div className="w-16 h-16 rounded-full bg-neo-white/90 border-neo border-neo-black flex items-center justify-center shadow-neo group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-neo-hover transition-all">
                        <Play className="w-7 h-7 text-neo-black ml-1" />
                      </div>
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-1 line-clamp-2">
                    {video.title || "Untitled Video"}
                  </h3>
                  <p className="text-sm text-neo-black/50 mb-4">
                    {formatDate(video.created_at)}
                  </p>
                  <div className="mt-auto flex gap-3">
                    <Link
                      to={`/result/${video.job_id}`}
                      className="btn-neo-mint text-sm py-2 px-4 flex-1 text-center"
                    >
                      View Details
                    </Link>
                    <a
                      href={getVideoUrl(video.job_id)}
                      download
                      className="btn-neo-black text-sm py-2 px-4 flex-1 text-center"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating create button */}
        {!loading && videos.length > 0 && (
          <div className="mt-10 text-center">
            <Link to="/create" className="btn-neo-peach inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Another Video
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
