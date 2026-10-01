// NexaSupport Utility Functions

import { cn as cnLocal } from "./clsx";
import type { TicketStatus, TicketPriority, AgentStatus, CustomerStatus, SLAStatus, SatisfactionRating, NotificationType, ArticleStatus } from "./types";

export const cn = cnLocal;

export function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
}

export function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "همین الان";
  if (diffMins < 60) return `${diffMins} دقیقه پیش`;
  if (diffHours < 24) return `${diffHours} ساعت پیش`;
  if (diffDays < 7) return `${diffDays} روز پیش`;
  return formatDate(dateString);
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} دقیقه`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} ساعت`;
  return `${hours} ساعت ${mins} دقیقه`;
}

export function getStatusBadge(status: TicketStatus): string {
  const variants: Record<TicketStatus, string> = {
    New: "info",
    Open: "primary",
    Pending: "warning",
    Resolved: "success",
    Closed: "default",
  };
  return variants[status];
}

export function getPriorityBadge(priority: TicketPriority): string {
  const variants: Record<TicketPriority, string> = {
    Low: "success",
    Medium: "info",
    High: "warning",
    Urgent: "danger",
  };
  return variants[priority];
}

export function getAgentStatusBadge(status: AgentStatus): string {
  const variants: Record<AgentStatus, string> = {
    Online: "success",
    Away: "warning",
    Offline: "default",
  };
  return variants[status];
}

export function getCustomerStatusBadge(status: CustomerStatus): string {
  const variants: Record<CustomerStatus, string> = {
    Active: "success",
    Inactive: "default",
    VIP: "warning",
    Blocked: "danger",
  };
  return variants[status];
}

export function getSLAStatusBadge(status: SLAStatus): string {
  const variants: Record<SLAStatus, string> = {
    Within: "success",
    "At Risk": "warning",
    Breached: "danger",
  };
  return variants[status];
}

export function getSatisfactionBadge(rating: SatisfactionRating) {
  const variants: Record<SatisfactionRating, "success" | "warning" | "danger"> = {
    Positive: "success",
    Neutral: "warning",
    Negative: "danger",
  };
  return variants[rating];
}

export function getNotificationIcon(type: NotificationType) {
  const icons: Record<NotificationType, string> = {
    ticket_assigned: "TicketPlus",
    sla_warning: "AlertTriangle",
    customer_replied: "MessageSquare",
    ticket_resolved: "CheckCircle2",
    internal_mention: "AtSign",
  };
  return icons[type];
}

export function getArticleStatusBadge(status: ArticleStatus) {
  const variants: Record<ArticleStatus, "success" | "default" | "warning"> = {
    Published: "success",
    Draft: "default",
    Archived: "warning",
  };
  return variants[status];
}

export function calculateSLAStatus(targetAt: string | null, completedAt: string | null) {
  if (!targetAt) return "Within" as SLAStatus;
  const target = new Date(targetAt).getTime();
  const now = Date.now();
  const completed = completedAt ? new Date(completedAt).getTime() : null;

  if (completed !== null) {
    return completed <= target ? "Within" : "Breached";
  }
  const remaining = target - now;
  if (remaining <= 0) return "Breached";
  if (remaining < 3600000) return "At Risk"; // 1 hour
  return "Within";
}

export function getSLAStatus(targetAt: string | null, completedAt: string | null) {
  return calculateSLAStatus(targetAt, completedAt);
}

export function getSLARemaining(targetAt: string | null) {
  if (!targetAt) return null;
  const remaining = new Date(targetAt).getTime() - Date.now();
  if (remaining <= 0) return "Breached";
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  if (hours > 0) return `${hours}س ${minutes}د`;
  return `${minutes}د`;
}

export const STATUS_LABELS_FA: Record<string, string> = {
  New: "جدید",
  Open: "باز",
  Pending: "در انتظار",
  Resolved: "حل شده",
  Closed: "بسته",
};

export const PRIORITY_LABELS_FA: Record<string, string> = {
  Low: "کم",
  Medium: "متوسط",
  High: "بالا",
  Urgent: "فوری",
};

export const CHANNEL_LABELS_FA: Record<string, string> = {
  Email: "ایمیل",
  Chat: "چت",
  Phone: "تلفن",
  Portal: "پرتال",
  Social: "شبکه اجتماعی",
};

export const AGENT_STATUS_LABELS_FA: Record<string, string> = {
  Online: "آنلاین",
  Away: "دور از دستگاه",
  Offline: "آفلاین",
};

export const CUSTOMER_STATUS_LABELS_FA: Record<string, string> = {
  Active: "فعال",
  Inactive: "غیرفعال",
  VIP: "ویژه",
  Blocked: "مسدود",
};

export const SATISFACTION_LABELS_FA: Record<string, string> = {
  Positive: "مثبت",
  Neutral: "خنثی",
  Negative: "منفی",
};

export const ARTICLE_STATUS_LABELS_FA: Record<string, string> = {
  Published: "منتشر شده",
  Draft: "پیش‌نویس",
  Archived: "بایگانی",
};

export const NOTIFICATION_LABELS_FA: Record<string, string> = {
  ticket_assigned: "تیکت تخصیص داده شد",
  sla_warning: "هشدار SLA",
  customer_replied: "پاسخ مشتری",
  ticket_resolved: "تیکت حل شد",
  internal_mention: "منشن داخلی",
};