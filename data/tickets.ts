// NexaSupport Mock Data - Tickets (50 tickets)

import type { Ticket, TicketChannel, TicketStatus, TicketPriority } from "@/lib/types";
import { customers } from "./customers";
import { agents } from "./agents";
import { departments } from "./departments";
import { mulberry32 } from "@/lib/random";

const rand = mulberry32(42);

const channels: TicketChannel[] = ["Email", "Chat", "Phone", "Portal", "Social"];
const statuses: TicketStatus[] = ["New", "Open", "Pending", "Resolved", "Closed"];
const priorities: TicketPriority[] = ["Low", "Medium", "High", "Urgent"];

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

function addMinutes(dateStr: string, minutes: number): string {
  return new Date(new Date(dateStr).getTime() + minutes * 60000).toISOString();
}

const ticketSubjects = [
  "خطای 500 در فراخوانی API کاربران",
  "مشکل در پرداخت اشتراک ماهانه",
  "درخواست دمو برای تیم ۱۵ نفره",
  "سفارش شماره ۱۲۳۴۵ ارسال نشده",
  "نحوه تغییر رمز عبور ادمین",
  "خطای CORS در اتصال به وب‌سرویس",
  "افزایش محدودیت آپلود فایل",
  "پرسش در مورد قیمت‌گذاری انبوه",
  "عدم دریافت ایمیل تایید ثبت‌نام",
  "باگ در نمایش گزارش‌های مالی",
  "درخواست افزودن فیلد سفارشی",
  "مشکل همگام‌سازی تقویم",
  "خطای احراز هویت دو مرحله‌ای",
  "پیشنهاد ویژگی جدید برای داشبورد",
  "سوال در مورد SLA پشتیبانی",
  "عدم نمایش داده‌ها در اپلیکیشن موبایل",
  "درخواست تغییر ایمیل حسابداری",
  "مشکل در xuất فایل اکسل",
  "خطای ۴۰۴ در مستندات API",
  "پرسش در مورد امنیت داده‌ها",
  "عدم عملکرد دکمه ذخیره در تنظیمات",
  "درخواست آموزش ویدئویی آنبوردینگ",
  "مشکل در یکپارچه‌سازی با سامانه بانک",
  "خطای اعتبار سنجی فرم تماس",
  "پیشنهاد بهبود UX داشبورد",
  "سوال در مورد بک‌آپ خودکار",
  "عدم ارسال نوتیفیکیشن‌های Push",
  "درخواست دسترسی به محیط استیجینگ",
  "مشکل در محاسبه مالیات بر ارزش افزوده",
  "خطای نمایش تاریخ شمسی در گزارشات",
  "پرسش در مورد محدودیت‌های API",
  "درخواست افزودن زبان جدید",
  "مشکل در فرآیند مرجوعی کالا",
  "خطای timeout در کوئری‌های سنگین",
  "پیشنهاد: حالت تاریک برای پورتال",
  "سوال در مورد مجوزهای کاربران",
  "عدم کارکرد فیلتر پیشرفته جستجو",
  "درخواست خروجی PDF برای فاکتورها",
  "مشکل در بازیابی رمز عبور",
  "خطای اعتبارسنجی کدملی در فرم",
  "پرسش در مورد� DATA RETENTION",
  "درخواست لاگ‌های خطا برای دیباگ",
  "مشکل در نمایش نمودارهای آنالیتیکس",
  "خطای همگام‌سازی با CRM خارجی",
  "پیشنهاد: میانبرهای کیبورد",
  "سوال در مورد برنامه‌ریزی پشتیبان‌گیری",
];

const ticketDescriptions = [
  "با سلام، عندلیب به خطای 500 برخورد می‌کنیم هنگام فراخوانی endpoint /api/users. لاگ‌های سرور نشان می‌دهد...",
  "اشتراک ماهانه ما از دیروز قابل تمدید نیست. درگاه پرداخت خطای تراکنش ناموفق می‌دهد...",
  "تیم ما ۱۵ نفره است و می‌خواهیم قبل از خرید، دموی کامل محصول را ببینیم...",
  "سفارش با شناسه ۱۲۳۴۵ از تاریخ ۱۴۰۳/۱۰/۱۵ در وضعیت پردازش مانده و ارسال نشده...",
  "چطور می‌توان رمز عبور حساب ادمین را تغییر داد؟ گزینه‌ای در پنل تنظیمات پیدا نکردیم...",
  "عندلیب از مرورگر به وب‌سرویس شما وصل می‌شویم و خطای CORS می‌گیریم...",
  "حداکثر حجم آپلود فایل فعلاً ۱۰ مگابایت است. آیا امکان افزایش به ۵۰ مگابایت وجود دارد؟...",
  "برای خرید ۱۰۰ لایسنس به طور یکجا، چه تخفیفی در نظر گرفته شده است؟...",
  "کاربر جدید ثبت‌نام کرده اما ایمیل تایید برای او ارسال نشده است. چک کنید...",
  "در بخش گزارش‌های مالی، ستون جمع کل عددی نادرست نشان می‌دهد...",
];

export const tickets: Ticket[] = Array.from({ length: 50 }, (_, i) => {
  const customer = randomItem(customers);
  const dept = randomItem(departments);
  const agent = dept.agentIds.length > 0 && rand() > 0.3
    ? agents.find((a) => a.id === randomItem(dept.agentIds))
    : null;
  const status = randomItem(statuses);
  const priority = randomItem(priorities);
  const channel = randomItem(channels);
  const createdAt = randomDate(30);
  const updatedAt = addMinutes(createdAt, Math.floor(rand() * 1440 * 7));

  const slaFirstResponseMinutes = dept.slaFirstResponseMinutes;
  const slaResolutionMinutes = dept.slaResolutionMinutes;
  const slaFirstResponseAt = addMinutes(createdAt, slaFirstResponseMinutes);
  const slaResolutionAt = addMinutes(createdAt, slaResolutionMinutes);

  let firstResponseAt: string | null = null;
  let resolvedAt: string | null = null;
  let closedAt: string | null = null;

  if (status !== "New" && status !== "Open") {
    firstResponseAt = addMinutes(createdAt, Math.floor(rand() * slaFirstResponseMinutes * 1.5));
  }
  if (status === "Resolved" || status === "Closed") {
    resolvedAt = addMinutes(createdAt, Math.floor(rand() * slaResolutionMinutes * 1.2));
  }
  if (status === "Closed") {
    closedAt = addMinutes(resolvedAt || createdAt, Math.floor(rand() * 1440));
  }

  return {
    id: `TKT-${String(i + 1).padStart(4, "0")}`,
    subject: ticketSubjects[i % ticketSubjects.length],
    description: ticketDescriptions[i % ticketDescriptions.length],
    status,
    priority,
    channel,
    customerId: customer.id,
    agentId: agent?.id ?? null,
    departmentId: dept.id,
    tags: Array.from({ length: Math.floor(rand() * 3) + 1 }, () => randomItem(["bug", "feature", "billing", "api", "ui", "security", "performance", "integration"])),
    slaFirstResponseAt,
    slaResolutionAt,
    firstResponseAt,
    resolvedAt,
    closedAt,
    createdAt,
    updatedAt,
  };
});