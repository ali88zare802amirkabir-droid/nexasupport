// NexaSupport Mock Data - Departments

import type { Department } from "@/lib/types";

export const departments: Department[] = [
  {
    id: "dept-01",
    name: "پشتیبانی فنی",
    description: "حل مشکلات فنی، باگ‌ها و خطاهای سیستمی",
    color: "#55a1ff",
    agentIds: ["agt-01", "agt-02", "agt-03"],
    slaFirstResponseMinutes: 60,
    slaResolutionMinutes: 480,
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "dept-02",
    name: "صورتحساب و پرداخت",
    description: "مدیریت اشتراک‌ها، فاکتورها و مشکلات پرداخت",
    color: "#34d399",
    agentIds: ["agt-04", "agt-05"],
    slaFirstResponseMinutes: 120,
    slaResolutionMinutes: 720,
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "dept-03",
    name: "فروش و پیش‌فروش",
    description: "مشاوره خرید، دمو و قیمت‌گذاری",
    color: "#fbbf24",
    agentIds: ["agt-06"],
    slaFirstResponseMinutes: 30,
    slaResolutionMinutes: 240,
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "dept-04",
    name: "سفارشات و لاجستیک",
    description: "پیگیری سفارشات، ارسال و مرجوعی‌ها",
    color: "#f472b6",
    agentIds: ["agt-07", "agt-08"],
    slaFirstResponseMinutes: 90,
    slaResolutionMinutes: 960,
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "dept-05",
    name: "پشتیبانی عمومی",
    description: "سوالات عمومی، راهنمای استفاده و بازخورد",
    color: "#a78bfa",
    agentIds: ["agt-01", "agt-04", "agt-06", "agt-07"],
    slaFirstResponseMinutes: 180,
    slaResolutionMinutes: 1440,
    createdAt: "2024-01-15T09:00:00Z",
  },
];