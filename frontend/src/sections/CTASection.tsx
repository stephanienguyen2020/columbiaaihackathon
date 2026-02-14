import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function Starburst({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <path d="M50 0 L58 38 L100 40 L62 58 L70 100 L50 68 L30 100 L38 58 L0 40 L42 38 Z" />
    </svg>
  );
}

export default function CTASection() {
  return (
    <section className="relative px-6 py-24 md:py-32 bg-primary/[0.08]">
      <div className="relative mx-auto max-w-5xl">
        <Starburst className="absolute -left-8 -top-8 h-20 w-20 text-foreground/90 md:-left-12 md:-top-12 md:h-28 md:w-28" />
        <Starburst className="absolute -bottom-6 -right-6 h-16 w-16 text-foreground/90 md:-bottom-10 md:-right-10 md:h-24 md:w-24" />

        <div className="relative rounded-2xl border-[3px] border-foreground bg-primary p-12 text-center neo-shadow-lg md:p-16">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:text-left">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-primary-foreground md:text-5xl">
                Stop overpaying for marketing videos.
              </h2>
              <p className="mt-4 max-w-xl text-lg font-medium leading-relaxed text-primary-foreground/80">
                Record a voice memo. Get a polished marketing video in minutes.
                No agencies, no delays, no big budgets.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                <Link
                  to="/create"
                  className="inline-flex items-center gap-2 rounded-xl border-[3px] border-foreground bg-card px-8 py-4 text-base font-bold text-foreground transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none neo-shadow"
                >
                  Start Creating Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
