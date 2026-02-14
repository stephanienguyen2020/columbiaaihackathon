import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative py-12 px-4 sm:px-6 lg:px-8 bg-neo-cream border-t-neo border-neo-black">
      {/* Decorative top border pattern */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-neo-black">
        <div className="flex h-full">
          <div className="flex-1 bg-neo-lavender" />
          <div className="flex-1 bg-neo-mint" />
          <div className="flex-1 bg-neo-peach" />
          <div className="flex-1 bg-neo-lavender" />
          <div className="flex-1 bg-neo-mint" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neo-black rounded-lg flex items-center justify-center border-2 border-neo-black shadow-[2px_2px_0px_0px_#F4B393]">
              <Sparkles className="w-5 h-5 text-neo-cream" />
            </div>
            <span className="font-black text-xl text-neo-black">SGStudio</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a
              href="/terms"
              className="px-4 py-2 bg-neo-white border-2 border-neo-black rounded-full font-bold text-sm text-neo-black
                         shadow-[2px_2px_0px_0px_#1A1A1A]
                         hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none
                         transition-all duration-150"
            >
              Terms of Service
            </a>
          </div>

          {/* Copyright */}
          <div
            className="px-4 py-2 bg-neo-lavender border-2 border-neo-black rounded-full font-bold text-sm text-neo-black
                          shadow-[2px_2px_0px_0px_#1A1A1A]"
          >
            &copy; {new Date().getFullYear()} SGStudio
          </div>
        </div>
      </div>
    </footer>
  );
}
