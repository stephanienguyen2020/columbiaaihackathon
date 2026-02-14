const platforms = [
  {
    name: "TikTok",
    description:
      "Short-form marketing videos optimized for TikTok's fast-paced, trend-driven audience.",
    color: "bg-foreground",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-card"
      >
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z" />
      </svg>
    ),
  },
  {
    name: "Instagram Reels",
    description:
      "Engaging video content with hooks, captions, and visuals designed for maximum Instagram reach.",
    color: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-card"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "YouTube Shorts",
    description:
      "Vertical video scripts and visuals tailored for YouTube Shorts' discovery algorithm.",
    color: "bg-[#FF0000]",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-card"
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    description:
      "Professional video content optimized for B2B engagement and thought leadership.",
    color: "bg-[#0a66c2]",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-card"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Twitter / X",
    description:
      "Attention-grabbing video clips and ads optimized for the Twitter feed.",
    color: "bg-foreground",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-card"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function Platforms() {
  return (
    <section id="platforms" className="relative px-6 py-24 md:py-32 bg-primary/[0.08]">
      <div className="relative mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-xl border-[3px] border-foreground bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground neo-shadow-sm">
            Platforms
          </span>
          <h2 className="mt-6 text-4xl font-bold text-foreground md:text-6xl">
            One video, every platform
          </h2>
          <p className="mt-4 text-lg font-medium leading-relaxed text-muted-foreground">
            Generate marketing videos optimized for each platform{"'"}s format,
            aspect ratio, and best practices.
          </p>
        </div>

        {/* Scrolling platform ticker */}
        <div className="mt-12 overflow-hidden rounded-2xl border-[3px] border-foreground bg-card py-4 neo-shadow">
          <div
            className="flex whitespace-nowrap"
            style={{ animation: "marquee 20s linear infinite" }}
          >
            {[...platforms, ...platforms].map((platform, idx) => (
              <div key={idx} className="mx-6 inline-flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border-[2px] border-foreground ${platform.color}`}
                >
                  {platform.icon}
                </div>
                <span className="text-lg font-bold text-foreground">
                  {platform.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Platforms grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="group rounded-2xl border-[3px] border-foreground bg-card p-6 transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none neo-shadow"
            >
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl border-[3px] border-foreground ${platform.color} neo-shadow-sm`}
              >
                {platform.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {platform.name}
              </h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
                {platform.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
