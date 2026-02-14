import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Square, Upload, Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { uploadAudio } from "../services/api";

export default function UploadPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"idle" | "recording" | "uploading">("idle");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4",
      });
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType,
        });
        setRecordedBlob(blob);
        setSelectedFile(null);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setMode("recording");
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch {
      setError("Microphone access denied. Please allow microphone access and try again.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setMode("idle");
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = [
      "audio/wav",
      "audio/mpeg",
      "audio/mp3",
      "audio/mp4",
      "audio/m4a",
      "audio/webm",
      "audio/ogg",
      "audio/x-m4a",
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(wav|mp3|m4a|webm|ogg)$/i)) {
      setError("Unsupported format. Please use WAV, MP3, M4A, WebM, or OGG.");
      return;
    }
    setError(null);
    setSelectedFile(file);
    setRecordedBlob(null);
  };

  const handleSubmit = async () => {
    const audioSource = selectedFile || (recordedBlob
      ? new File(
          [recordedBlob],
          `recording.${recordedBlob.type.includes("webm") ? "webm" : "m4a"}`,
          { type: recordedBlob.type }
        )
      : null);

    if (!audioSource) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const result = await uploadAudio(audioSource);
      navigate(`/transcript/${result.job_id}`, {
        state: { transcript: result.transcript },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasAudio = !!recordedBlob || !!selectedFile;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-neo-cream pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-6">
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-2 text-sm font-bold text-neo-black hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="text-center mb-10">
          <div className="tag-neo mx-auto mb-4 w-fit">
            <Sparkles className="w-4 h-4" />
            Step 1 of 4
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neo-black mb-3">
            Share Your Vision
          </h1>
          <p className="text-lg text-neo-black/70">
            Record a voice memo or upload an audio file describing your marketing video idea.
          </p>
        </div>

        {/* Record Section */}
        <div className="card-neo p-8 mb-6">
          <h2 className="text-xl font-bold mb-6 text-center">Record a Voice Memo</h2>

          <div className="flex flex-col items-center gap-6">
            {mode === "recording" ? (
              <>
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-red-400 border-neo border-neo-black flex items-center justify-center animate-pulse">
                    <Mic className="w-10 h-10 text-neo-black" />
                  </div>
                </div>
                <span className="text-2xl font-bold font-mono">
                  {formatTime(recordingTime)}
                </span>
                <button onClick={stopRecording} className="btn-neo-peach flex items-center gap-2">
                  <Square className="w-4 h-4" />
                  Stop Recording
                </button>
              </>
            ) : (
              <>
                {recordedBlob && (
                  <div className="w-full card-neo-mint p-4 text-center">
                    <p className="font-bold">Recording captured!</p>
                    <p className="text-sm text-neo-black/70">
                      Duration: {formatTime(recordingTime)}
                    </p>
                  </div>
                )}
                <button
                  onClick={startRecording}
                  disabled={isSubmitting}
                  className="btn-neo flex items-center gap-2"
                >
                  <Mic className="w-5 h-5" />
                  {recordedBlob ? "Record Again" : "Start Recording"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-[3px] bg-neo-black/20" />
          <span className="font-bold text-neo-black/50 text-sm">OR</span>
          <div className="flex-1 h-[3px] bg-neo-black/20" />
        </div>

        {/* Upload Section */}
        <div className="card-neo p-8 mb-8">
          <h2 className="text-xl font-bold mb-6 text-center">Upload an Audio File</h2>
          <div className="flex flex-col items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".wav,.mp3,.m4a,.webm,.ogg,audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              className="btn-neo-mint flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Choose File
            </button>
            {selectedFile && (
              <div className="card-neo-lavender p-4 w-full text-center">
                <p className="font-bold truncate">{selectedFile.name}</p>
                <p className="text-sm text-neo-black/70">
                  {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
            )}
            <p className="text-xs text-neo-black/50">
              Supported: WAV, MP3, M4A, WebM, OGG
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="card-neo-peach p-4 mb-6 text-center">
            <p className="font-bold text-neo-black">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!hasAudio || isSubmitting || mode === "recording"}
          className={`w-full py-4 text-lg font-bold rounded-neo border-neo border-neo-black transition-all duration-150 ${
            hasAudio && !isSubmitting && mode !== "recording"
              ? "bg-neo-black text-neo-cream shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              : "bg-neo-black/30 text-neo-black/50 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Uploading & Transcribing...
            </span>
          ) : (
            "Transcribe My Voice Memo"
          )}
        </button>
      </div>
    </div>
  );
}
