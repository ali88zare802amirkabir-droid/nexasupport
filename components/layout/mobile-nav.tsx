// NexaSupport Mobile Navigation

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, ICONS } from "./nav";
import { useSidebar } from "@/lib/store";

export function MobileNav() {
  const pathname = usePathname();
  const { open, setOpen } = useSidebar();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-edge shadow-elevated" aria-label="ناوبری موبایل">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const isActive = pathname === item.href || (item.href !== "/overview" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors",
                isActive ? "text-accent" : "text-ink-3 hover:text-ink hover:bg-surface-2"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="size-6">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}