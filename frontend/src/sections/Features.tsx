import { Mic, Zap, Image, Video, FileText, Sparkles } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Voice-First Input",
    description:
      "Record a quick voice memo on your phone describing your video idea. As simple as a 30-second voice note.",
    color: "bg-primary",
  },
  {
    icon: FileText,
    title: "AI Script Generation",
    description:
      "AI generates a structured marketing script from your voice memo, optimized for a 1-minute video format.",
    color: "bg-accent",
  },
  {
    icon: Image,
    title: "Visual Asset Creation",
    description:
      "AI generates matching product shots, lifestyle imagery, and backgrounds tailored to your script.",
    color: "bg-secondary",
  },
  {
    icon: Video,
    title: "Automated Video Assembly",
    description:
      "Everything is assembled into a polished video with voiceover, transitions, and text overlays.",
    color: "bg-accent",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Quality",
    description:
      "Powered by Claude and Gemini to deliver professional-grade results that rival agency output.",
    color: "bg-primary",
  },
  {
    icon: Zap,
    title: "Minutes, Not Weeks",
    description:
      "What used to take agencies days or weeks now takes minutes. Go from idea to finished video in one session.",
    color: "bg-accent",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-xl border-[3px] border-foreground bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground neo-shadow-sm">
            Features
          </span>
          <h2 className="mt-6 text-4xl font-bold text-foreground md:text-6xl">
            Everything you need to create marketing videos
          </h2>
          <p className="mt-4 text-lg font-medium leading-relaxed text-muted-foreground">
            From voice memo to polished video, SGStudio handles every step of
            the production process with AI.
          </p>
        </div>

        {/* Feature images row */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border-[3px] border-foreground bg-card overflow-hidden neo-shadow">
            <img
              src="/phone-1.jpg"
              alt="Voice input feature"
              className="w-full h-auto"
            />
          </div>
          <div className="rounded-2xl border-[3px] border-foreground bg-card overflow-hidden neo-shadow">
            <img
              src="/phone-2.jpg"
              alt="AI video generation"
              className="w-full h-auto"
            />
          </div>
          <div className="rounded-2xl border-[3px] border-foreground bg-card overflow-hidden neo-shadow">
            <img
              src="/phone-3.jpg"
              alt="Final video output"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Features grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border-[3px] border-foreground bg-card p-6 transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none neo-shadow"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-foreground ${feature.color} neo-shadow-sm`}
              >
                <feature.icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
