// NexaSupport Mock Data - Notifications

import type { Notification, NotificationType } from "@/lib/types";
import { tickets } from "./tickets";
import { agents } from "./agents";
import { customers } from "./customers";
import { mulberry32 } from "@/lib/random";

const rand = mulberry32(555);

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function randomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(rand() * daysAgo));
  date.setHours(Math.floor(rand() * 24));
  date.setMinutes(Math.floor(rand() * 60));
  return date.toISOString();
}

const notificationTemplates: Record<NotificationType, { title: string; message: string }> = {
  ticket_assigned: {
    title: "تیکت جدید به شما تخصیص یافت",
    message: "تیکت {ticketId} با موضوع «{subject}» به شما ارجاع داده شد.",
  },
  sla_warning: {
    title: "هشدار SLA: زمان پاسخ‌دهی در حال انقضا",
    message: "تیکت {ticketId} تنها {remaining} تا موعد اول پاسخ باقی مانده.",
  },
  customer_replied: {
    title: "پاسخ جدید از مشتری",
    message: "مشتری {customerName} به تیکت {ticketId} پاسخ داده است.",
  },
  ticket_resolved: {
    title: "تیکت حل شد",
    message: "تیکت {ticketId} توسط {agentName} به عنوان حل شده علامت‌گذاری گردید.",
  },
  internal_mention: {
    title: "منشن در یادداشت داخلی",
    message: "{agentName} شما را در تیکت {ticketId} منشن کرده است.",
  },
};

export const notifications: Notification[] = Array.from({ length: 25 }, (_, i) => {
  const type = randomItem<NotificationType>(["ticket_assigned", "sla_warning", "customer_replied", "ticket_resolved", "internal_mention"]);
  const ticket = randomItem(tickets);
  const agent = randomItem(agents);
  const customer = customers.find((c) => c.id === ticket.customerId);
  const template = notificationTemplates[type];

  return {
    id: `notif-${String(i + 1).padStart(3, "0")}`,
    type,
    title: template.title,
    message: template.message
      .replace("{ticketId}", ticket.id)
      .replace("{subject}", ticket.subject)
      .replace("{customerName}", customer?.name ?? "مشتری")
      .replace("{agentName}", agent.name)
      .replace("{remaining}", "۱۵ دقیقه"),
    read: rand() > 0.4,
    relatedId: ticket.id,
    relatedType: "ticket",
    createdAt: randomDate(7),
  };
});