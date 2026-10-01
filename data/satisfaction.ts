// NexaSupport Mock Data - Satisfaction Records

import type { SatisfactionRecord, SatisfactionRating } from "@/lib/types";
import { tickets } from "./tickets";
import { customers } from "./customers";

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date.toISOString();
}

const ratings: SatisfactionRating[] = ["Positive", "Neutral", "Negative"];
const positiveComments = [
  "پشتیبانی فوق‌العاده سریع و مفید بود. ممنون!",
  "مشکل در کمترین زمان ممکن حل شد. تیم حرفه‌ای دارید.",
  "راضی از پاسخگویی و دقت تیم پشتیبانی.",
  "بسیار خوش‌حنون و صبور بودند. تشکر.",
  "راهنمایی کامل و دقیق. عالی!",
];
const neutralComments = [
  "حل شد اما زمان‌بر بود.",
  "پاسخ کلی بود، جزئیات کم‌تر.",
  "معمول، نه خیلی خوب نه بد.",
  "منتظر پاسخ طولانی بودم.",
];
const negativeComments = [
  "زمان پاسخ‌دهی خیلی طولانی بود.",
  "راه‌حل ارائه شده کار نکرد.",
  "پشتیبانی بی‌توجهی کرد.",
  "نیاز به eskcalation داشتم تا حل بشه.",
];

export const satisfactionRecords: SatisfactionRecord[] = tickets
  .filter((t) => t.status === "Resolved" || t.status === "Closed")
  .map((ticket) => {
    const rating = randomItem(ratings);
    let comment: string | null = null;
    if (rating === "Positive") comment = randomItem(positiveComments);
    else if (rating === "Neutral") comment = randomItem(neutralComments);
    else comment = randomItem(negativeComments);

    return {
      id: `sat-${ticket.id}`,
      ticketId: ticket.id,
      customerId: ticket.customerId,
      rating,
      comment,
      createdAt: ticket.resolvedAt ? addMinutes(ticket.resolvedAt, Math.floor(Math.random() * 1440)) : randomDate(7),
    };
  });

function addMinutes(dateStr: string, minutes: number): string {
  return new Date(new Date(dateStr).getTime() + minutes * 60000).toISOString();
}