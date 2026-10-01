// NexaSupport Toasts

"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useToasts, useApp } from "@/lib/store";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

const ToastIcons = {
  success: CheckCircle2,
  danger: AlertCircle,
  info: Info,
  warning: AlertTriangle,
} as const;

export function Toasts() {
  const { toasts, dismissToast } = useToasts();

  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => dismissToast(toast.id), 5000);
      return () => clearTimeout(timer);
    });
  }, [toasts, dismissToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2" role="region" aria-label="اعلان‌ها" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = ToastIcons[toast.variant];
        return (
          <div
            key={toast.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl glass border border-edge shadow-elevated min-w-[280px] max-w-md animate-in slide-in-from-bottom-4 duration-fast",
              {
                "border-l-4 border-ok": toast.variant === "success",
                "border-l-4 border-danger": toast.variant === "danger",
                "border-l-4 border-accent": toast.variant === "info",
                "border-l-4 border-warn": toast.variant === "warning",
              }
            )}
            role="alert"
          >
            <Icon className={cn("size-5 shrink-0", toast.variant === "success" && "text-ok", toast.variant === "danger" && "text-danger", toast.variant === "info" && "text-accent", toast.variant === "warning" && "text-warn")} />
            <p className="text-sm font-medium text-ink flex-1">{toast.title}</p>
            <button onClick={() => dismissToast(toast.id)} className="p-1 rounded-lg text-ink-3 hover:bg-surface-2 hover:text-ink transition-colors shrink-0" aria-label="بستن">
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}