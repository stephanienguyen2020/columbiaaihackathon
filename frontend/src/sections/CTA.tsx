import { useEffect, useRef, useState } from "react";

export default function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background with pattern */}
      <div className="absolute inset-0 bg-neo-black">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-4 border-neo-cream rotate-12" />
          <div className="absolute top-40 right-20 w-16 h-16 border-4 border-neo-cream rounded-full" />
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border-4 border-neo-cream rotate-45" />
          <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-neo-cream rounded-full" />
          <div className="absolute top-1/2 left-20 w-6 h-6 bg-neo-lavender rotate-12" />
          <div className="absolute top-20 right-1/2 w-10 h-10 bg-neo-mint rounded-full" />
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Decorative star */}
        <div
          className={`absolute -top-8 left-1/4 text-6xl transition-all duration-1000 ${
            isVisible ? "opacity-100 rotate-0" : "opacity-0 -rotate-45"
          }`}
        >
          ✦
        </div>

        {/* Main Heading */}
        <div
          className={`inline-block px-8 py-4 bg-neo-lavender border-neo border-neo-cream rounded-neo shadow-[6px_6px_0px_0px_#F5E6A3] mb-6
                     transition-all duration-1000 ${
                       isVisible
                         ? "opacity-100 scale-100"
                         : "opacity-0 scale-90"
                     }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neo-black">
            Stop overpaying for marketing videos.
          </h2>
        </div>

        {/* Subheading */}
        <p
          className={`text-3xl sm:text-4xl lg:text-5xl font-script italic text-neo-cream mb-8 
                     transition-all duration-1000 delay-200 ${
                       isVisible
                         ? "opacity-100 translate-y-0"
                         : "opacity-0 translate-y-8"
                     }`}
          style={{ textShadow: "3px 3px 0px #C4A8E0" }}
        >
          Just speak. We'll produce.
        </p>

        {/* Description */}
        <p
          className={`text-lg sm:text-xl text-neo-cream/90 mb-12 max-w-2xl mx-auto font-medium
                     transition-all duration-1000 delay-300 ${
                       isVisible
                         ? "opacity-100 translate-y-0"
                         : "opacity-0 translate-y-8"
                     }`}
        >
          Record a voice memo. Get a polished marketing video. No agencies, no delays, no big budgets.
        </p>

        {/* CTA Button */}
        <div
          className={`transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-5 bg-neo-peach text-neo-black text-lg font-black rounded-neo 
                       border-neo border-neo-black shadow-neo-xl
                       hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-neo
                       active:translate-x-[8px] active:translate-y-[8px] active:shadow-none
                       transition-all duration-150"
          >
            Start creating for free →
          </a>
        </div>

        {/* Decorative elements */}
        <div
          className={`absolute -bottom-4 right-1/4 text-5xl transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 rotate-0" : "opacity-0 rotate-45"
          }`}
        >
          ✦
        </div>
      </div>
    </section>
  );
}
