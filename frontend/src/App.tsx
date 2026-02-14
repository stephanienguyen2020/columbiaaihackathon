import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UploadPage from "./pages/UploadPage";
import TranscriptPage from "./pages/TranscriptPage";
import ScriptPage from "./pages/ScriptPage";
import ProgressPage from "./pages/ProgressPage";
import ResultPage from "./pages/ResultPage";
import GalleryPage from "./pages/GalleryPage";

function App() {
  return (
    <div className="min-h-screen bg-neo-cream">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<UploadPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/transcript/:jobId" element={<TranscriptPage />} />
        <Route path="/script/:jobId" element={<ScriptPage />} />
        <Route path="/progress/:jobId" element={<ProgressPage />} />
        <Route path="/result/:jobId" element={<ResultPage />} />
      </Routes>
    </div>
  );
}

export default App;
