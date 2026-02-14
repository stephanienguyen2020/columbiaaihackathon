/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#1A1A1A",
          foreground: "#FFFEF0",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Neobrutalism color palette
        neo: {
          cream: "#F5E6A3",      // Yellow/cream background
          black: "#1A1A1A",      // Black for borders and text
          lavender: "#C4A8E0",   // Purple/lavender
          mint: "#A8E6CF",       // Mint green
          peach: "#F4B393",      // Peach/salmon
          white: "#FFFEF0",      // Off-white
          pink: "#FFB5BA",       // Soft pink accent
        },
      },
      fontFamily: {
        sans: ['Inter Tight', 'sans-serif'],
        script: ['Petrona', 'serif'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        full: "9999px",
        neo: "16px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        // Neobrutalism hard shadows
        neo: "4px 4px 0px 0px #1A1A1A",
        "neo-lg": "6px 6px 0px 0px #1A1A1A",
        "neo-xl": "8px 8px 0px 0px #1A1A1A",
        "neo-hover": "2px 2px 0px 0px #1A1A1A",
        "neo-lavender": "4px 4px 0px 0px #1A1A1A",
        "neo-mint": "4px 4px 0px 0px #1A1A1A",
        "neo-peach": "4px 4px 0px 0px #1A1A1A",
      },
      borderWidth: {
        neo: "3px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        float: "float 4s ease-in-out infinite",
        wiggle: "wiggle 0.5s ease-in-out infinite",
        bounce: "bounce 1s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
