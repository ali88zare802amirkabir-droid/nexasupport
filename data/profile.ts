// NexaSupport Mock Data - Profile & Settings

import type { UserProfile, AppSettings, TicketPriority, TicketStatus } from "@/lib/types";

export const userProfile: UserProfile = {
  name: "علی رضایی",
  email: "ali.rezaei@nexasupport.com",
  avatarColor: "#55a1ff",
  role: "مدیر پشتیبانی",
  department: "پشتیبانی فنی",
  dailyGoalTickets: 15,
  preferredLanguage: "fa",
  timezone: "Asia/Tehran",
};

export const defaultSettings: AppSettings = {
  companyName: "NexaSupport",
  supportEmail: "support@nexasupport.com",
  timezone: "Asia/Tehran",
  defaultPriority: "Medium",
  defaultStatus: "New",
  autoAssignment: true,
  slaFirstResponseMinutes: 60,
  slaResolutionMinutes: 480,
  notifications: {
    slaWarnings: true,
    newTickets: true,
    customerReplies: true,
    internalMentions: true,
  },
  appearance: {
    theme: "dark",
    density: "comfortable",
    reducedMotion: false,
  },
};