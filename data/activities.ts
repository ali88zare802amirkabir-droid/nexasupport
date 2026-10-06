// NexaSupport Mock Data - Activities

import type { Activity } from "@/lib/types";
import { tickets } from "./tickets";
import { customers } from "./customers";
import { agents } from "./agents";
import { mulberry32 } from "@/lib/random";
import { STATUS_LABELS_FA, PRIORITY_LABELS_FA } from "@/lib/utils";

const rand = mulberry32(7);

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

const activityTemplates = [
  { type: "ticket_created" as const, desc: "تیکت {ticketId} با موضوع «{subject}» ایجاد شد" },
  { type: "ticket_assigned" as const, desc: "تیکت {ticketId} به {agentName} ارجاع داده شد" },
  { type: "ticket_replied" as const, desc: "{actorName} به تیکت {ticketId} پاسخ داد" },
  { type: "ticket_resolved" as const, desc: "تیکت {ticketId} به عنوان حل شده علامت‌گذاری شد" },
  { type: "ticket_status_changed" as const, desc: "وضعیت تیکت {ticketId} از {oldStatus} به {newStatus} تغییر کرد" },
  { type: "priority_changed" as const, desc: "اولویت تیکت {ticketId} از {oldPriority} به {newPriority} تغییر کرد" },
  { type: "customer_added" as const, desc: "مشتری جدید {customerName} اضافه شد" },
  { type: "internal_note" as const, desc: "یادداشت داخلی به تیکت {ticketId} اضافه شد" },
];

const statuses = ["New", "Open", "Pending", "Resolved", "Closed"];
const priorities = ["Low", "Medium", "High", "Urgent"];

export const activities: Activity[] = Array.from({ length: 40 }, (_, i) => {
  const template = randomItem(activityTemplates);
  const ticket = randomItem(tickets);
  const customer = customers.find((c) => c.id === ticket.customerId);
  const agent = ticket.agentId ? agents.find((a) => a.id === ticket.agentId) : randomItem(agents);
  const actor = rand() > 0.5 ? agent : customer;
  const actorType = actor === agent ? "agent" : "customer";

  const createdAt = randomDate(14);
  const oldStatus = randomItem(statuses);
  let newStatus = randomItem(statuses);
  while (newStatus === oldStatus) newStatus = randomItem(statuses);
  const oldPriority = randomItem(priorities);
  let newPriority = randomItem(priorities);
  while (newPriority === oldPriority) newPriority = randomItem(priorities);

  const description = template.desc
    .replace("{ticketId}", ticket.id)
    .replace("{subject}", ticket.subject)
    .replace("{agentName}", agent?.name ?? "سیستم")
    .replace("{actorName}", actor?.name ?? "سیستم")
    .replace("{customerName}", customer?.name ?? "مشتری")
    .replace("{oldStatus}", STATUS_LABELS_FA[oldStatus])
    .replace("{newStatus}", STATUS_LABELS_FA[newStatus])
    .replace("{oldPriority}", PRIORITY_LABELS_FA[oldPriority])
    .replace("{newPriority}", PRIORITY_LABELS_FA[newPriority]);

  return {
    id: `act-${String(i + 1).padStart(3, "0")}`,
    type: template.type,
    actorId: actor?.id ?? "system",
    actorName: actor?.name ?? "سیستم",
    actorType: actorType === "agent" ? "agent" : actorType === "customer" ? "customer" : "system",
    ticketId: ticket.id,
    customerId: customer?.id ?? null,
    description,
    metadata: { ticketId: ticket.id },
    createdAt,
  };
});