// NexaSupport Mock Data - Knowledge Base Articles

import type { KnowledgeArticle } from "@/lib/types";
import { agents } from "./agents";
import { mulberry32 } from "@/lib/random";

const rand = mulberry32(99);

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

const categories = [
  "شروع کار",
  "صورتحساب و پرداخت",
  "حساب کاربری",
  "فنی و تکنیکی",
  "سفارشات",
  "عیب‌یابی",
  "امنیت",
  "API و توسعه",
];

const articleData = [
  { title: "راهنمای سریع شروع کار با NexaSupport", category: "شروع کار", content: "محتویات کامل مقاله...", excerpt: "یاد بگیرید چگونه در کمترین زمان ممکن NexaSupport را راه‌اندازی کنید.", status: "Published" as const, views: 1250, helpful: 89, notHelpful: 3 },
  { title: "نحوه خرید و تمدید اشتراک", category: "صورتحساب و پرداخت", content: "محتویات کامل مقاله...", excerpt: "مراحل خرید، روش‌های پرداخت و تمدید اشتراک ماهانه و سالانه.", status: "Published" as const, views: 980, helpful: 67, notHelpful: 2 },
  { title: "بازیابی رمز عبور و احراز هویت دو مرحله‌ای", category: "حساب کاربری", content: "محتویات کامل مقاله...", excerpt: "راهنمای تغییر رمز عبور، فعال‌سازی 2FA و حل مشکلات ورود.", status: "Published" as const, views: 875, helpful: 54, notHelpful: 1 },
  { title: "خطاهای رایج API و نحوه رفع آن‌ها", category: "فنی و تکنیکی", content: "محتویات کامل مقاله...", excerpt: "کدهای خطای ۴۰۰، ۴۰۱، ۴۰۳، ۴۰۴، ۴۲۹، ۵۰۰ و راهکارهای رفع.", status: "Published" as const, views: 1120, helpful: 78, notHelpful: 4 },
  { title: "پیگیری وضعیت سفارش و کد رهگیری", category: "سفارشات", content: "محتویات کامل مقاله...", excerpt: "نحوه بررسی وضعیت سفارش، دریافت کد رهگیری و تماس با پست.", status: "Published" as const, views: 650, helpful: 45, notHelpful: 0 },
  { title: "عیب‌یابی مشکلات اتصال و عملکرد", category: "عیب‌یابی", content: "محتویات کامل مقاله...", excerpt: "مراحل عیب‌یابی عمومی: کش، کوکی، مرورگر، شبکه و افزونه‌ها.", status: "Published" as const, views: 720, helpful: 51, notHelpful: 2 },
  { title: "بهترین شیوه‌های امنیتی برای حساب کاربری", category: "امنیت", content: "محتویات کامل مقاله...", excerpt: "رمزهای قوی، 2FA، مدیریت جلسات، و شناسایی فیشینگ.", status: "Published" as const, views: 540, helpful: 38, notHelpful: 1 },
  { title: "مستندات کامل API نسخه ۲", category: "API و توسعه", content: "محتویات کامل مقاله...", excerpt: "احراز هویت، rate limiting، webhooks، و مثال‌های کد.", status: "Published" as const, views: 1340, helpful: 92, notHelpful: 5 },
  { title: "نحوه صادره فاکتور و دریافت قبض", category: "صورتحساب و پرداخت", content: "محتویات کامل مقاله...", excerpt: "دریافت فاکتورهای الکترونیکی، پرداخت آنلاین و آرشیو.", status: "Draft" as const, views: 0, helpful: 0, notHelpful: 0 },
  { title: "راهنمای مهاجرت از نسخه ۱ به ۲", category: "فنی و تکنیکی", content: "محتویات کامل مقاله...", excerpt: "تغییرات breaking، مراحل مهاجرت و موارد deprecated شده.", status: "Published" as const, views: 430, helpful: 31, notHelpful: 0 },
  { title: "تنظیمات نوتیفیکیشن و ایمیل", category: "حساب کاربری", content: "محتویات کامل مقاله...", excerpt: "شخصی‌سازی نوتیفیکیشن‌ها، انباشت ایمیل و تنظیمات زمان‌بندی.", status: "Published" as const, views: 380, helpful: 26, notHelpful: 1 },
  { title: "بررسی مشکلات پرداخت با کارت بانکی", category: "صورتحساب و پرداخت", content: "محتویات کامل مقاله...", excerpt: "خطاهای درگاه، کارت‌های مجاز، محدودیت‌ها و تماس با بانک.", status: "Published" as const, views: 590, helpful: 41, notHelpful: 2 },
  { title: "استفاده از Webhooks برای اتوماسیون", category: "API و توسعه", content: "محتویات کامل مقاله...", excerpt: "رویدادهای موجود، امضای امنیتی، retry policy و نمونه پیاده‌سازی.", status: "Draft" as const, views: 0, helpful: 0, notHelpful: 0 },
  { title: "سیاست حفظ داده‌ها و GDPR", category: "امنیت", content: "محتویات کامل مقاله...", excerpt: "حذف حساب، خروجی داده‌ها، مکان سرورها و مجوزها.", status: "Published" as const, views: 290, helpful: 19, notHelpful: 0 },
  { title: "شخصی‌سازی داشبورد و ویجت‌ها", category: "شروع کار", content: "محتویات کامل مقاله...", excerpt: "افزودن/حذف ویجت، تغییر چیدمان، ذخیره پیش‌فرض‌ها.", status: "Published" as const, views: 410, helpful: 28, notHelpful: 1 },
  { title: "مدیریت تیم و مجوزهای دسترسی", category: "حساب کاربری", content: "محتویات کامل مقاله...", excerpt: "نقش‌ها، سطح دسترسی، دعوت اعضا و حسابرسی فعالیت.", status: "Published" as const, views: 360, helpful: 24, notHelpful: 0 },
  { title: "عیب‌یابی خطاهای ۵xx سمت سرور", category: "عیب‌یابی", content: "محتویات کامل مقاله...", excerpt: "لاگ‌ها، monitoring، alerting و эскаلشن به تیم DevOps.", status: "Published" as const, views: 670, helpful: 48, notHelpful: 3 },
  { title: "راهنمای استفاده از پنل آنالیتیکس", category: "شروع کار", content: "محتویات کامل مقاله...", excerpt: "متریک‌ها، فیلترها، خروجی گزارش و اشتراک‌گذاری داشبورد.", status: "Draft" as const, views: 0, helpful: 0, notHelpful: 0 },
  { title: "تنظیم SLA و قوانین эскаلشن", category: "فنی و تکنیکی", content: "محتویات کامل مقاله...", excerpt: "تعریف SLA، اولویت‌بندی، قوانین эскаلشن و اعلان‌ها.", status: "Published" as const, views: 520, helpful: 36, notHelpful: 1 },
  { title: "یکپارچه‌سازی با Slack و Teams", category: "API و توسعه", content: "محتویات کامل مقاله...", excerpt: "نصب اپ، کانال‌ها، فرمت پیام‌ها و فیلتر رویدادها.", status: "Archived" as const, views: 180, helpful: 12, notHelpful: 0 },
];

export const articles: KnowledgeArticle[] = articleData.map((a, i) => ({
  id: `art-${String(i + 1).padStart(3, "0")}`,
  title: a.title,
  slug: a.title.toLowerCase().replace(/[\s\u200c]+/g, "-").replace(/[^\p{L}\p{N}\-]/gu, ""),
  category: a.category,
  content: a.content,
  excerpt: a.excerpt,
  status: a.status,
  views: a.views,
  helpful: a.helpful,
  notHelpful: a.notHelpful,
  authorId: randomItem(agents).id,
  tags: [a.category, "راهنمای"],
  createdAt: new Date(Date.now() - rand() * 365 * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - rand() * 30 * 86400000).toISOString(),
}));