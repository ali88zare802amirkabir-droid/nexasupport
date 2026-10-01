import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-elevated": "var(--bg-elevated)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        "surface-3": "var(--surface-3)",
        edge: "var(--edge)",
        "edge-strong": "var(--edge-strong)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        cyan: "var(--cyan)",
        "cyan-soft": "var(--cyan-soft)",
        ok: "var(--ok)",
        "ok-soft": "var(--ok-soft)",
        warn: "var(--warn)",
        "warn-soft": "var(--warn-soft)",
        danger: "var(--danger)",
        "danger-soft": "var(--danger-soft)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.2), 0 1px 2px -1px rgb(0 0 0 / 0.15)",
        "card-hover": "0 4px 12px 0 rgb(0 0 0 / 0.25), 0 2px 4px -2px rgb(0 0 0 / 0.15)",
        elevated: "0 10px 40px 0 rgb(0 0 0 / 0.3), 0 4px 12px -4px rgb(0 0 0 / 0.2)",
        glass: "0 4px 24px 0 rgb(0 0 0 / 0.2), inset 0 1px 0 0 rgb(255 255 255 / 0.03)",
      },
      transitionDuration: {
        fast: "120ms",
        normal: "200ms",
        slow: "300ms",
      },
    },
  },
  plugins: [],
};

export default config;