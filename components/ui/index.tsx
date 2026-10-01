// NexaSupport UI Components

"use client";

import { forwardRef, useEffect, useRef, useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"; size?: "sm" | "md" | "lg" }>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "bg-accent text-white hover:bg-accent/90 active:bg-accent": variant === "primary",
          "bg-surface-2 text-ink hover:bg-surface-3 active:bg-surface-3": variant === "secondary",
          "border border-edge bg-transparent hover:bg-surface-2 active:bg-surface-2": variant === "outline",
          "bg-transparent hover:bg-surface-2 active:bg-surface-2": variant === "ghost",
          "bg-danger text-white hover:bg-danger/90 active:bg-danger": variant === "danger",
          "px-3 py-1.5 text-xs gap-1.5": size === "sm",
          "px-4 py-2.5 text-sm gap-2": size === "md",
          "px-6 py-3 text-base gap-2": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: { value: string; label: string }[];
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, children, label, error, id, ...props }, ref) => (
    <div className="w-full">
      {label && <label htmlFor={id} className="label">{label}</label>}
      <select
        ref={ref}
        id={id}
        className={cn(
          "rounded-xl border border-edge bg-surface px-4 py-2.5 text-sm text-ink transition-all duration-fast focus-ring",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      >
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
);
Select.displayName = "Select";

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="w-full">
      {label && <label htmlFor={id} className="label">{label}</label>}
      <input
        ref={ref}
        id={id}
        className={cn(
          "w-full rounded-xl border border-edge bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-3 transition-all duration-fast focus-ring",
          error && "border-danger focus:ring-danger",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
);
TextInput.displayName = "TextInput";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="w-full">
      {label && <label htmlFor={id} className="label">{label}</label>}
      <textarea
        ref={ref}
        id={id}
        className={cn(
          "w-full rounded-xl border border-edge bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-3 transition-all duration-fast focus-ring resize-y min-h-[80px]",
          error && "border-danger focus:ring-danger",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
);
TextArea.displayName = "TextArea";

export const Avatar = ({ name, color = "#55a1ff", size = "md", className, src }: {
  name: string;
  color?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  src?: string;
}) => {
  const sizes = {
    xs: "size-6 text-[10px]",
    sm: "size-8 text-[11px]",
    md: "size-10 text-[12px]",
    lg: "size-12 text-[14px]",
    xl: "size-16 text-[18px]",
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    return <img src={src} alt={name} className={cn("rounded-full object-cover", sizes[size], className)} />;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold text-white select-none",
        sizes[size],
        className
      )}
      style={{ backgroundColor: color }}
      aria-label={name}
    >
      {initials}
    </div>
  );
};

export const Badge = ({ children, variant = "default", className, size, style, onClick }: {
  children: ReactNode;
  variant?: string;
  className?: string;
  size?: "xs" | "sm";
  style?: React.CSSProperties;
  onClick?: () => void;
}) => (
  <span
    style={style}
    onClick={onClick}
    className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold",
      size === "xs" ? "text-[10px]" : "text-xs",
      {
        "bg-surface-2 text-ink-2": variant === "default",
        "bg-accent-soft text-accent": variant === "primary",
        "bg-ok-soft text-ok": variant === "success",
        "bg-warn-soft text-warn": variant === "warning",
        "bg-danger-soft text-danger": variant === "danger",
        "bg-cyan-soft text-cyan": variant === "info",
      },
      className
    )}
  >
    {children}
  </span>
);

export const Card = ({ children, className, padding = "md", hover, style }: {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  style?: React.CSSProperties;
}) => (
  <div
    style={style}
    className={cn(
      "glass rounded-2xl transition-all duration-fast",
      {
        "p-3": padding === "sm",
        "p-5 sm:p-6": padding === "md",
        "p-6 sm:p-8": padding === "lg",
        "hover:shadow-card-hover": hover,
      },
      className
    )}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("mb-4", className)}>{children}</div>
);

export const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={cn("font-display text-base font-bold text-ink", className)}>{children}</h3>
);

export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("", className)}>{children}</div>
);

export const EmptyState = ({ icon, title, description, action }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <h3 className="empty-state-title">{title}</h3>
    <p className="empty-state-desc">{description}</p>
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export const Modal = ({ isOpen, onClose, title, children, className, size = "md" }: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[90vw]",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby={title ? "modal-title" : undefined}>
      <div className={cn("w-full glass rounded-2xl shadow-elevated overflow-hidden", sizes[size], className)} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-edge">
            <h2 id="modal-title" className="font-display text-lg font-bold text-ink">{title}</h2>
            <button onClick={onClose} className="p-1 rounded-lg text-ink-3 hover:bg-surface-2 hover:text-ink transition-colors" aria-label="بستن">
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export const Dropdown = ({ trigger, items, align = "right", className }: {
  trigger: React.ReactNode;
  items: { label: string; onClick: () => void; icon?: React.ReactNode; danger?: boolean; disabled?: boolean }[];
  align?: "left" | "right";
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">{trigger}</div>
      {open && (
        <div className={cn("fixed z-50 mt-1.5 min-w-[180px] glass rounded-xl border border-edge shadow-elevated py-1.5", align === "right" ? "right-0" : "left-0")}>
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => { item.onClick(); setOpen(false); }}
              disabled={item.disabled}
              className={cn("w-full flex items-center gap-2 px-3 py-2 text-sm text-right transition-colors", item.danger && "text-danger", item.disabled && "opacity-50 cursor-not-allowed", "hover:bg-surface-2")}
            >
              {item.icon && <span className="size-4">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const Tabs = ({ tabs, activeTab, onChange, className }: {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}) => (
  <div className={cn("flex gap-1 bg-surface-2 rounded-xl p-1", className)} role="tablist">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={cn(
          "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-fast",
          activeTab === tab.id
            ? "bg-white text-ink shadow-card"
            : "text-ink-3 hover:text-ink hover:bg-surface"
        )}
        role="tab"
        aria-selected={activeTab === tab.id}
      >
        {tab.icon && <span className="size-4">{tab.icon}</span>}
        {tab.label}
      </button>
    ))}
  </div>
);

export const Table = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("table-container", className)}>
    <table className="table">{children}</table>
  </div>
);

export const Switch = ({ checked, onChange, label, id }: {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  id?: string;
}) => (
  <label className="inline-flex items-center gap-2 cursor-pointer">
    <span className="sr-only">{label}</span>
    <input id={id} type="checkbox" role="switch" checked={checked} onChange={onChange}
      className="peer sr-only" />
    <span className="relative h-6 w-11 rounded-full bg-surface-3 transition-colors peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg after:content-[''] after:absolute after:top-0.5 after:right-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:-translate-x-5" />
  </label>
);

export const Progress = ({ value, max = 100, className, barClassName }: {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
}) => {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-2", className)}
      role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div className={cn("h-full rounded-full bg-accent transition-all", barClassName)} style={{ width: `${pct}%` }} />
    </div>
  );
};