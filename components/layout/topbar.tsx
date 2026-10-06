// NexaSupport Topbar Component

"use client";

import { cn } from "@/lib/utils";
import { ICONS } from "./nav";
import { useSearch, useProfile, useSettings } from "@/lib/store";
import { useTheme } from "@/components/providers/theme-provider";
import { Avatar } from "@/components/ui";
import { NotificationsPanel } from "./notifications-panel";
import { CommandSearch } from "./command-search";

export function Topbar() {
  const { toggle: toggleSearch } = useSearch();
  const { profile } = useProfile();
  const { settings, update: updateSettings } = useSettings();
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: "dark" | "light" | "system") => {
    setTheme(newTheme);
    updateSettings({ appearance: { ...settings.appearance, theme: newTheme } });
  };

  return (
    <header className="sticky top-0 z-20 glass border-b border-edge">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left: Search + Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSearch}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-edge text-ink placeholder:text-ink-3 transition-all duration-fast",
              "hover:border-accent/50 focus-within:border-accent",
              "w-full sm:w-[320px]"
            )}
            aria-label="جستجوی سراسری"
          >
            <ICONS.Search className="size-5 text-ink-3 shrink-0" />
            <span className="text-sm text-ink-3 truncate">جستجوی تیکت، مشتری، مقاله... (⌘K)</span>
            <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-surface-2 rounded text-ink-3">⌘K</kbd>
          </button>
        </div>

        {/* Right: Notifications, Theme, Profile */}
        <div className="flex items-center gap-2">
          <NotificationsPanel />

          {/* Theme Toggle */}
          <div className="flex items-center gap-1 bg-surface rounded-xl border border-edge p-1">
            {["dark", "light", "system"].map((t) => (
              <button
                key={t}
                onClick={() => handleThemeChange(t as "dark" | "light" | "system")}
                className={cn(
                  "p-1.5 rounded-lg text-ink-3 transition-colors",
                  theme === t ? "bg-accent/10 text-accent" : "hover:bg-surface-2 hover:text-ink"
                )}
                aria-label={`تم ${t === "dark" ? "تاریک" : t === "light" ? "روشن" : "سیستم"}`}
                aria-pressed={theme === t}
              >
                {t === "dark" && <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>}
                {t === "light" && <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>}
                {t === "system" && <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>}
              </button>
            ))}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-edge hover:border-accent/50 transition-colors"
              aria-label="منوی کاربر"
              aria-expanded={false}
              aria-haspopup="true"
            >
              <Avatar name={profile.name} color={profile.avatarColor} size="sm" />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-ink truncate max-w-[140px]">{profile.name}</p>
                <p className="text-xs text-ink-3 truncate max-w-[140px]">{profile.role}</p>
              </div>
              <svg className="size-4 text-ink-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Command Search */}
      <CommandSearch />
    </header>
  );
}