"use client";

import { ArrowRight, Sparkles, Star } from "lucide-react";
import Image from "next/image";

function Starburst({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <path d="M50 0 L58 38 L100 40 L62 58 L70 100 L50 68 L30 100 L38 58 L0 40 L42 38 Z" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16">
      {/* Decorative starbursts */}
      <Starburst className="absolute left-4 top-24 h-16 w-16 text-foreground/90 md:left-12 md:h-24 md:w-24" />
      <Starburst className="absolute right-4 top-32 h-12 w-12 text-foreground/90 md:right-16 md:h-20 md:w-20" />
      <Starburst className="absolute bottom-20 left-8 h-10 w-10 text-foreground/90 md:left-20 md:h-16 md:w-16" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-xl border-[3px] border-foreground bg-primary/20 px-5 py-2 text-sm font-bold text-foreground neo-shadow-sm">
          <Sparkles className="h-4 w-4" />
          <span>AI-Powered Content Generation</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-balance text-5xl font-bold leading-tight tracking-tight text-foreground md:text-8xl">
          Create stunning
          <br />
          content{" "}
          <span className="relative inline-block rounded-xl bg-primary px-4 py-1 text-primary-foreground">
            in seconds
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-8 max-w-2xl text-pretty text-lg font-medium leading-relaxed text-muted-foreground md:text-xl">
          Draft uses advanced AI to generate platform-specific content for
          Telegram, LinkedIn, Threads, Instagram Reels, and Email. Just describe
          your idea and let AI do the rest.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-xl border-[3px] border-foreground bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none neo-shadow"
          >
            Start Creating Free
            <ArrowRight className="h-5 w-5" />
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-xl border-[3px] border-foreground bg-card px-8 py-4 text-base font-bold text-foreground transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none neo-shadow"
          >
            See How It Works
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 inline-flex flex-wrap items-center justify-center gap-4 rounded-2xl border-[3px] border-foreground bg-card p-6 neo-shadow md:gap-8">
          <div className="text-center px-4">
            <p className="font-display text-3xl font-bold text-foreground md:text-4xl">
              10K+
            </p>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              Content Creators
            </p>
          </div>
          <div className="h-12 w-[3px] bg-foreground" />
          <div className="text-center px-4">
            <p className="font-display text-3xl font-bold text-foreground md:text-4xl">
              1M+
            </p>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              Posts Generated
            </p>
          </div>
          <div className="h-12 w-[3px] bg-foreground" />
          <div className="text-center px-4">
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-primary text-primary" />
              ))}
            </div>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              5-Star Rated
            </p>
          </div>
        </div>
      </div>

      {/* Hero illustration */}
      <div className="relative z-10 mx-auto mt-16 w-full max-w-4xl px-4">
        <div className="rounded-2xl border-[3px] border-foreground bg-card overflow-hidden neo-shadow-lg">
          <Image
            src="/images/hero-illustration.jpg"
            alt="SGStudio content generation platform showing a creative workspace"
            width={900}
            height={500}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
}
