import { useEffect, useRef, useState } from "react";
import {
  Mic,
  FileText,
  Image,
  Video,
  Music,
  Sparkles,
  Layers,
  Wand2,
} from "lucide-react";

const features = [
  { label: "Voice input", icon: Mic, color: "bg-neo-lavender" },
  { label: "AI scripts", icon: FileText, color: "bg-neo-mint" },
  { label: "Generated visuals", icon: Image, color: "bg-neo-peach" },
  { label: "Voiceover", icon: Music, color: "bg-neo-lavender" },
  { label: "Transitions", icon: Layers, color: "bg-neo-mint" },
  { label: "Text overlays", icon: Wand2, color: "bg-neo-peach" },
  { label: "1-min format", icon: Video, color: "bg-neo-lavender" },
  { label: "AI-powered", icon: Sparkles, color: "bg-neo-mint" },
];

export default function Carousels() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-10 h-10 bg-neo-peach rotate-12 border-2 border-neo-black" />
      <div className="absolute bottom-40 left-10 w-8 h-8 bg-neo-mint rounded-full border-2 border-neo-black" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="inline-block px-4 py-2 bg-neo-mint border-2 border-neo-black rounded-full mb-4 shadow-[3px_3px_0px_0px_#1A1A1A]">
              <span className="font-bold text-neo-black">AI Video Studio</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neo-black mb-6">
              <span
                className="block"
                style={{ textShadow: "3px 3px 0px #A8E6CF" }}
              >
                Pro videos,
              </span>
              <span
                className="block font-script italic text-neo-lavender"
                style={{ WebkitTextStroke: "2px #1A1A1A" }}
              >
                zero agencies
              </span>
            </h2>

            <p className="text-lg text-neo-black mb-8 max-w-md font-medium">
              Skip the agency briefs, revision cycles, and premium invoices.
              Just speak your idea and get a polished marketing video in minutes, not weeks.
            </p>

            {/* Feature Tags Grid */}
            <div className="flex flex-wrap gap-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.label}
                    className={`flex items-center gap-2 px-4 py-2 ${feature.color} rounded-full
                               border-2 border-neo-black shadow-[2px_2px_0px_0px_#1A1A1A]
                               transition-all duration-300
                               hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none
                               ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
                    style={{ transitionDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <Icon className="w-4 h-4 text-neo-black" />
                    <span className="text-sm font-bold text-neo-black">
                      {feature.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phone Display */}
          <div className="relative flex justify-center">
            {/* Main Phone Card */}
            <div
              className={`relative bg-neo-white p-6 rounded-neo border-neo border-neo-black shadow-neo-xl
                         transition-all duration-1000 ${
                           isVisible
                             ? "opacity-100 translate-y-0 rotate-0"
                             : "opacity-0 translate-y-20 rotate-3"
                         }`}
            >
              {/* Phone */}
              <div className="relative w-56 sm:w-64 lg:w-72">
                <div className="relative rounded-[2rem] overflow-hidden border-neo border-neo-black bg-neo-white">
                  <img
                    src="/phone-carousel.jpg"
                    alt="SGStudio - AI Video Production"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Decorative elements around phone */}
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-neo-lavender rounded-full border-2 border-neo-black flex items-center justify-center font-bold animate-bounce">
                ✨
              </div>
              <div className="absolute -bottom-3 -left-3 px-3 py-1 bg-neo-peach rounded-full border-2 border-neo-black font-bold text-sm">
                Easy!
              </div>
            </div>

            {/* Secondary decorative card */}
            <div
              className={`absolute -z-10 top-8 -right-4 w-full h-full bg-neo-mint rounded-neo border-neo border-neo-black
                         transition-all duration-1000 delay-200 ${
                           isVisible ? "opacity-100" : "opacity-0"
                         }`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
