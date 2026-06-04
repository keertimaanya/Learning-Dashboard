import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      /* ── Color Palette (Dark theme) ────────────────────────── */
      colors: {
        background: {
          DEFAULT: "#09090b",    // near-black base
          card: "#111113",       // slightly lighter for cards
          elevated: "#18181b",   // sidebar / elevated surfaces
        },
        surface: {
          DEFAULT: "#1c1c1f",
          hover: "#27272a",
          border: "#2a2a2e",
        },
        accent: {
          DEFAULT: "#818cf8",    // indigo-400 glow
          secondary: "#a78bfa",  // violet-400
          emerald: "#34d399",    // for progress bars
          amber: "#fbbf24",      // for streak indicators
        },
        text: {
          primary: "#fafafa",
          secondary: "#a1a1aa",
          muted: "#71717a",
        },
      },

      /* ── Fonts ─────────────────────────────────────────────── */
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },

      /* ── Glow / Shadow Tokens ──────────────────────────────── */
      boxShadow: {
        glow: "0 0 20px rgba(129, 140, 248, 0.15)",
        "glow-lg": "0 0 40px rgba(129, 140, 248, 0.2)",
      },

      /* ── Grid Template for Bento Layout ────────────────────── */
      gridTemplateColumns: {
        bento: "repeat(4, 1fr)",
        "bento-tablet": "repeat(2, 1fr)",
      },

      /* ── Animation Tokens ──────────────────────────────────── */
      keyframes: {
        "skeleton-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "skeleton-pulse": "skeleton-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
