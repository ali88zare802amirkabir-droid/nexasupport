// NexaSupport Sidebar Component

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, ICONS } from "./nav";
import { useSidebar } from "@/lib/store";
import { Avatar } from "@/components/ui";

export function Sidebar() {
  const pathname = usePathname();
  const { open, toggle, setOpen } = useSidebar();

  return (
    <>
      {!open && (
        <button
          onClick={toggle}
          className="fixed top-4 right-4 z-40 lg:hidden p-2 rounded-xl bg-surface border border-edge text-ink hover:bg-surface-2 transition-colors"
          aria-label="باز کردن منوی کناری"
          aria-expanded={open}
        >
          <ICONS.Menu className="size-5" />
        </button>
      )}

      <aside
        className={cn(
          "fixed top-0 start-0 z-30 flex h-full w-64 max-w-[80vw] flex-col glass border-e border-edge transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
        aria-label="منوی اصلی"
        aria-hidden={!open}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-edge">
            <Link href="/overview" className="flex items-center gap-2" aria-label="NexaSupport Home">
              <div className="size-9 rounded-xl bg-accent/20 flex items-center justify-center">
                <svg className="size-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4" />
                  <path d="M15 12v6" />
                  <path d="M9 12v6" />
                </svg>
              </div>
              <span className="font-display text-lg font-bold text-ink">NexaSupport</span>
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden p-1 rounded-lg text-ink-3 hover:bg-surface-2 hover:text-ink transition-colors"
              aria-label="بستن منو"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1" role="navigation" aria-label="منوی اصلی">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/overview" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-fast",
                    isActive
                      ? "bg-accent/10 text-accent border-s-2 border-accent"
                      : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                  {item.badge && <span className="ms-auto px-2 py-0.5 text-xs font-semibold bg-accent-soft text-accent rounded-full">{item.badge}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-edge">
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar name="علی رضایی" color="#55a1ff" size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">علی رضایی</p>
                <p className="text-xs text-ink-3 truncate">مدیر پشتیبانی</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-edge flex items-center gap-2 text-xs text-ink-3">
              <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-ok" /> آنلاین</span>
              <span className="flex-1" />
              <ICONS.LogOut className="size-4 opacity-50 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-20 lg:hidden bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}