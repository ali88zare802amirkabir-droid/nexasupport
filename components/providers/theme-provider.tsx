// NexaSupport Theme Provider — single source of truth for the color theme

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "nexasupport-theme";

function resolveIsLight(theme: Theme) {
  if (theme === "light") return true;
  if (theme === "system") return window.matchMedia("(prefers-color-scheme: light)").matches;
  return false;
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("light", resolveIsLight(theme));
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial: Theme = stored === "dark" || stored === "light" || stored === "system" ? stored : "dark";
    applyTheme(initial);
    const frame = requestAnimationFrame(() => {
      setThemeState(initial);
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Follow OS preference while "system" is selected
  useEffect(() => {
    if (!mounted || theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme, mounted]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  const value = { theme, setTheme };

  if (!mounted) {
    return (
      <ThemeContext.Provider value={value}>
        <div className="min-h-screen bg-bg">{children}</div>
      </ThemeContext.Provider>
    );
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
