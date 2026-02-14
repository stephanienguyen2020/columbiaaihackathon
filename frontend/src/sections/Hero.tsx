import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Star } from "lucide-react";

function Starburst({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <path d="M50 0 L58 38 L100 40 L62 58 L70 100 L50 68 L30 100 L38 58 L0 40 L42 38 Z" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16">
      {/* Decorative starbursts */}
      <Starburst className="absolute left-4 top-24 h-16 w-16 text-neo-black/90 md:left-12 md:h-24 md:w-24" />
      <Starburst className="absolute right-4 top-32 h-12 w-12 text-neo-black/90 md:right-16 md:h-20 md:w-20" />
      <Starburst className="absolute bottom-20 left-8 h-10 w-10 text-neo-black/90 md:left-20 md:h-16 md:w-16" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-neo border-neo border-neo-black bg-neo-lavender/30 px-5 py-2 text-sm font-bold text-neo-black shadow-neo-hover">
          <Sparkles className="h-4 w-4" />
          <span>AI-Powered Video Generation</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl font-black leading-tight tracking-tight text-neo-black md:text-8xl">
          Voice to video
          <br />
          <span
            className="relative inline-block rounded-neo bg-neo-lavender px-4 py-1 text-neo-black"
            style={{ WebkitTextStroke: "1px #1A1A1A" }}
          >
            in minutes
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-neo-black/70 md:text-xl">
          Stop overpaying agencies for marketing videos. Record a voice memo
          describing your idea, and let AI generate the script, visuals, and a
          polished 1-minute video — 100x faster, 100x cheaper.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/create"
            className="inline-flex items-center gap-2 rounded-neo border-neo border-neo-black bg-neo-peach px-8 py-4 text-base font-bold text-neo-black shadow-neo transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
          >
            Start Creating Free
            <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-neo border-neo border-neo-black bg-neo-white px-8 py-4 text-base font-bold text-neo-black shadow-neo transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
          >
            See How It Works
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 inline-flex flex-wrap items-center justify-center gap-4 rounded-neo border-neo border-neo-black bg-neo-white p-6 shadow-neo md:gap-8">
          <div className="text-center px-4">
            <p className="text-3xl font-black text-neo-black md:text-4xl">
              100x
            </p>
            <p className="mt-1 text-sm font-semibold text-neo-black/60">
              Faster Than Agencies
            </p>
          </div>
          <div className="h-12 w-[3px] bg-neo-black" />
          <div className="text-center px-4">
            <p className="text-3xl font-black text-neo-black md:text-4xl">
              100x
            </p>
            <p className="mt-1 text-sm font-semibold text-neo-black/60">
              Cheaper To Produce
            </p>
          </div>
          <div className="h-12 w-[3px] bg-neo-black" />
          <div className="text-center px-4">
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-neo-peach text-neo-peach"
                />
              ))}
            </div>
            <p className="mt-1 text-sm font-semibold text-neo-black/60">
              Voice-First Workflow
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
