import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        scrolled ? "w-[95%] max-w-6xl" : "w-auto"
      }`}
    >
      <nav
        className={`flex items-center justify-between px-6 py-3 rounded-neo border-neo border-neo-black
                    transition-all duration-300 ${
                      scrolled
                        ? "bg-neo-white shadow-neo"
                        : "bg-neo-lavender shadow-neo"
                    }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neo-black rounded-lg flex items-center justify-center border-2 border-neo-black shadow-[2px_2px_0px_0px_#F4B393]">
            <Sparkles className="w-5 h-5 text-neo-cream" />
          </div>
          <span className="font-bold text-xl text-neo-black">SGStudio</span>
        </div>

        {/* CTA Button */}
        <a
          href="https://apps.apple.com"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 px-5 py-2.5 bg-neo-mint text-neo-black text-sm font-bold rounded-neo 
                     border-neo border-neo-black shadow-neo 
                     hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover
                     active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
                     transition-all duration-150"
        >
          Get started free
        </a>
      </nav>
    </header>
  );
}
