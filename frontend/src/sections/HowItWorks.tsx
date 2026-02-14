import { useEffect, useRef, useState } from 'react';
import { Mic, FileText, Image, Video } from 'lucide-react';

const steps = [
  {
    number: '1',
    title: 'Record a voice memo',
    description: 'Describe your video idea in your own words — as simple as a 30-second voice note',
    icon: Mic,
    color: 'bg-neo-lavender',
  },
  {
    number: '2',
    title: 'AI writes the script',
    description: 'AI generates a structured marketing script from your voice memo, optimized for a 1-minute video',
    icon: FileText,
    color: 'bg-neo-mint',
  },
  {
    number: '3',
    title: 'Visuals are generated',
    description: 'AI creates matching images, product shots, and backgrounds tailored to your script',
    icon: Image,
    color: 'bg-neo-peach',
  },
  {
    number: '4',
    title: 'Get your video',
    description: 'Everything is assembled into a polished video with voiceover, transitions, and text overlays',
    icon: Video,
    color: 'bg-neo-lavender',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>([false, false, false, false]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            steps.forEach((_, index) => {
              setTimeout(() => {
                setVisibleSteps((prev) => {
                  const newState = [...prev];
                  newState[index] = true;
                  return newState;
                });
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-24 px-4 sm:px-6 lg:px-8">
      {/* Decorative zigzag */}
      <div className="absolute top-10 left-10 w-8 h-8 bg-neo-mint rotate-45 border-2 border-neo-black" />
      <div className="absolute bottom-20 right-10 w-6 h-6 bg-neo-lavender rounded-full border-2 border-neo-black" />

      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-3 bg-neo-white border-neo border-neo-black rounded-neo shadow-neo mb-6">
            <h2 className="text-4xl sm:text-5xl font-black text-neo-black">
              How it works
            </h2>
          </div>
          <p className="text-lg text-neo-black font-medium">
            From voice memo to marketing video in four simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isVisible = visibleSteps[index];

            return (
              <div
                key={step.number}
                className={`relative transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Step Card */}
                <div className={`relative p-8 ${step.color} border-neo border-neo-black rounded-neo shadow-neo-lg
                                hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-neo
                                active:translate-x-[6px] active:translate-y-[6px] active:shadow-none
                                transition-all duration-150 h-full`}>
                  {/* Number Badge */}
                  <div className="absolute -top-5 -left-3 w-12 h-12 bg-neo-black text-neo-cream rounded-full 
                                  border-2 border-neo-black flex items-center justify-center font-black text-xl
                                  shadow-[3px_3px_0px_0px_#F4B393]">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 bg-neo-white rounded-neo border-2 border-neo-black 
                                  flex items-center justify-center mb-4 shadow-[3px_3px_0px_0px_#1A1A1A]">
                    <Icon className="w-7 h-7 text-neo-black" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-black text-neo-black mb-3">{step.title}</h3>
                  <p className="text-neo-black font-medium">{step.description}</p>
                </div>

                {/* Arrow connector (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 bg-neo-black rounded-full flex items-center justify-center border-2 border-neo-cream">
                      <svg className="w-4 h-4 text-neo-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
