import { useEffect, useRef, useState } from 'react';
import { Clock, DollarSign } from 'lucide-react';

const formats = [
  {
    title: 'Agency: days & $$$',
    description: 'Brief calls, script revisions, storyboard approvals, multiple drafts — weeks of back and forth at premium prices',
    icon: Clock,
    color: 'bg-neo-lavender',
    image: '/phone-formats.jpg',
  },
  {
    title: 'SGStudio: minutes & cents',
    description: 'Record a voice memo, AI handles the script, visuals, and assembly — a polished video for a few dozen prompts',
    icon: DollarSign,
    color: 'bg-neo-mint',
    image: '/phone-1.jpg',
  },
];

export default function Formats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
    <section ref={sectionRef} className="relative py-24 px-4 sm:px-6 lg:px-8">
      {/* Decorative elements */}
      <div className="absolute top-10 right-1/4 w-6 h-6 bg-neo-peach rotate-45 border-2 border-neo-black" />
      <div className="absolute bottom-20 left-10 w-10 h-10 bg-neo-lavender rounded-full border-2 border-neo-black" />

      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-block px-6 py-3 bg-neo-peach border-neo border-neo-black rounded-neo shadow-neo mb-6">
            <h2 className="text-4xl sm:text-5xl font-black text-neo-black">
              Why SGStudio?
            </h2>
          </div>
          <p className="text-lg text-neo-black font-medium">
            100x faster and 100x cheaper than traditional video production
          </p>
        </div>

        {/* Format Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {formats.map((format, index) => {
            const Icon = format.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={format.title}
                className={`group relative transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${0.2 + index * 0.15}s` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Background layer for depth */}
                <div 
                  className={`absolute inset-0 rounded-neo border-neo border-neo-black transition-all duration-300 ${
                    index === 0 ? 'bg-neo-mint' : 'bg-neo-peach'
                  } ${isHovered ? 'translate-x-[6px] translate-y-[6px]' : 'translate-x-[4px] translate-y-[4px]'}`}
                />

                {/* Main Card */}
                <div 
                  className={`relative ${format.color} rounded-neo border-neo border-neo-black p-8
                             transition-all duration-300 ${
                    isHovered ? 'translate-x-[-2px] translate-y-[-2px]' : ''
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-neo-white rounded-neo border-2 border-neo-black 
                                    flex items-center justify-center shadow-[3px_3px_0px_0px_#1A1A1A]">
                      <Icon className="w-7 h-7 text-neo-black" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-neo-black">{format.title}</h3>
                    </div>
                  </div>
                  
                  <p className="text-neo-black font-medium mb-8">{format.description}</p>

                  {/* Phone Image */}
                  <div className="relative">
                    <div 
                      className={`relative mx-auto w-48 sm:w-56 rounded-[2rem] overflow-hidden 
                                 border-neo border-neo-black bg-neo-white
                                 transition-transform duration-300 ${
                        isHovered ? 'scale-105 rotate-1' : ''
                      }`}
                    >
                      <img
                        src={format.image}
                        alt={format.title}
                        className="w-full h-auto"
                      />
                    </div>
                    
                    {/* Decorative badge */}
                    <div className={`absolute -bottom-3 right-4 px-3 py-1 bg-neo-white rounded-full 
                                    border-2 border-neo-black font-bold text-sm shadow-[2px_2px_0px_0px_#1A1A1A]
                                    transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
                      {index === 0 ? '⏱️ Weeks of waiting' : '⚡ Ready in minutes'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
