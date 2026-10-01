// NexaSupport App Shell

"use client";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { MobileNav } from "./mobile-nav";
import { Toasts } from "./toasts";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/lib/store";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { open } = useSidebar();

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />

      {/* Whole content column is offset from the sidebar using logical (RTL-safe) padding */}
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-300",
          open ? "lg:ps-64" : "lg:ps-0"
        )}
      >
        <Topbar />
        <main className="flex-1 pb-24 lg:pb-10">
          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>

      <MobileNav />
      <Toasts />
    </div>
  );
}
