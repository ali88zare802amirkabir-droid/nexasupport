// NexaSupport Mock Data - Conversations

import type { Conversation } from "@/lib/types";
import { tickets } from "./tickets";
import { customers } from "./customers";
import { agents } from "./agents";

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const channels: ("Email" | "Chat" | "Phone" | "Portal" | "Social")[] = ["Email", "Chat", "Phone", "Portal", "Social"];

export const conversations: Conversation[] = Array.from({ length: 25 }, (_, i) => {
  const ticket = randomItem(tickets);
  const customer = customers.find((c) => c.id === ticket.customerId);
  const agent = ticket.agentId ? agents.find((a) => a.id === ticket.agentId) : null;
  const lastMsgTime = ticket.updatedAt;

  return {
    id: `conv-${String(i + 1).padStart(3, "0")}`,
    subject: ticket.subject,
    customerId: ticket.customerId,
    agentId: ticket.agentId,
    lastMessage: ticket.status === "New" ? "تیکت جدید ایجاد شده" : `آخرین پاسخ: ${ticket.status === "Resolved" ? "حل شده" : "در حال بررسی"}`,
    lastMessageAt: lastMsgTime,
    unreadCount: ticket.status === "New" || ticket.status === "Open" ? Math.floor(Math.random() * 3) + 1 : 0,
    status: ticket.status === "Closed" ? "closed" : ticket.status === "Pending" ? "waiting" : "active",
    channel: ticket.channel,
    createdAt: ticket.createdAt,
  };
});