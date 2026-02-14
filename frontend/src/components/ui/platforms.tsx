const platforms = [
  {
    name: "Telegram",
    description: "Rich text posts with formatting, bold, italic, links, and custom layouts.",
    color: "bg-[#54a9eb]",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-foreground">
        <path d="M20.572 3.014a1.5 1.5 0 00-1.476.086L3.285 12.636a1.5 1.5 0 00.18 2.678l4.283 1.68 1.612 5.154a1.5 1.5 0 002.508.457l2.5-2.833 4.496 1.763a1.5 1.5 0 002.038-1.1l2.5-15.5a1.5 1.5 0 00-.83-1.721z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    description: "Professional posts and articles optimized for engagement and reach.",
    color: "bg-[#0a66c2]",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-card">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Threads",
    description: "Multi-post thread sequences designed for storytelling and engagement.",
    color: "bg-foreground",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-card">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.432 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.343-.783-.987-1.418-1.819-1.84-.354 2.312-1.199 4.074-2.553 5.124-1.097.852-2.47 1.236-3.855 1.08-1.14-.128-2.148-.6-2.838-1.328-.743-.783-1.122-1.814-1.066-2.901.1-1.903 1.554-3.382 3.542-3.598.997-.108 1.943.019 2.818.346-.072-.56-.19-1.075-.362-1.533-.4-1.061-1.09-1.663-2.052-1.79-.865-.114-1.69.103-2.315.61l-1.313-1.57c.978-.818 2.2-1.239 3.537-1.063 1.56.206 2.716 1.125 3.342 2.663.326.801.52 1.728.59 2.78l.022.278c1.138.44 2.063 1.188 2.688 2.196.893 1.44 1.065 3.392.459 5.218-.744 2.24-2.674 3.988-5.724 4.175l-.088.003c-.179.011-.361.017-.543.017zm-1.72-9.478c-1.103.127-1.89.845-1.937 1.764-.03.585.186 1.113.608 1.558.416.438 1.01.7 1.672.774.962.108 1.896-.122 2.663-.733.921-.734 1.552-1.975 1.873-3.685-.773-.2-1.6-.29-2.432-.2l-.447.053z" />
      </svg>
    ),
  },
  {
    name: "Instagram Reels",
    description: "Video script hooks, captions, and content ideas for maximum reach.",
    color: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-card">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "Email",
    description: "Professional email templates, newsletters, and outreach sequences.",
    color: "bg-primary",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
]

export function Platforms() {
  return (
    <section id="platforms" className="relative px-6 py-24 md:py-32 bg-primary/8">
      <div className="relative mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-xl border-[3px] border-foreground bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground neo-shadow-sm">
            Platforms
          </span>
          <h2 className="mt-6 font-display text-balance text-4xl font-bold text-foreground md:text-6xl">
            One idea, every platform
          </h2>
          <p className="mt-4 text-pretty text-lg font-medium leading-relaxed text-muted-foreground">
            Generate platform-specific content that respects each channel{"'"}s
            unique format, tone, and best practices.
          </p>
        </div>

        {/* Scrolling platform ticker */}
        <div className="mt-12 overflow-hidden rounded-2xl border-[3px] border-foreground bg-card py-4 neo-shadow">
          <div className="flex whitespace-nowrap" style={{ animation: 'marquee 20s linear infinite' }}>
            {[...platforms, ...platforms].map((platform, idx) => (
              <div key={idx} className="mx-6 inline-flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg border-[2px] border-foreground ${platform.color}`}>
                  {platform.icon}
                </div>
                <span className="font-display text-lg font-bold text-foreground">{platform.name}</span>
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
              <h3 className="font-display text-xl font-bold text-foreground">
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
  )
}
