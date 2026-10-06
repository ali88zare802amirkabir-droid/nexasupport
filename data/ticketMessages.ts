// NexaSupport Mock Data - Ticket Messages

import type { TicketMessage, Attachment } from "@/lib/types";
import { tickets } from "./tickets";
import { customers } from "./customers";
import { agents } from "./agents";
import { mulberry32 } from "@/lib/random";

const rand = mulberry32(1337);

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function addMinutes(dateStr: string, minutes: number): string {
  return new Date(new Date(dateStr).getTime() + minutes * 60000).toISOString();
}

const customerMessages = [
  "سلام، این مشکل از دیروز برای ما پیش اومده و کار رو متوقف کرده.",
  "ممنون از پیگیری‌تون. آیا راه‌حل موقتی وجود داره؟",
  "بله، دقیقاً همین خطا رو می‌گیریم. لاگ‌ها رو پیوست کردم.",
  "این مشکل فقط در محیط پروداکشن پیش میاد، استیجینگ 괜찮ه.",
  "آیا می‌تونید اولویت این تیکت رو بالا ببرید؟ برای ما بحرانیه.",
  "متشکرم، پاسخ شما راه‌گشا بود. تست می‌کنیم و نتیجه رو می‌گیم.",
  "مشکل حل شد! تشکر از تیم پشتیبانی عالی شما.",
  "متاسفانه هنوز حل نشده. لطفاً مجدد چک کنید.",
  "آیا امکان تماس تلفنی هست؟ توضیح دادن از اینجا سخت‌تره.",
  "این باگ از آپدیت نسخه ۲.۳.۱ به بعد شروع شده.",
];

const agentMessages = [
  "سلام، ممنون از گزارش. دارم بررسی می‌کنم و به‌زودی آپدیت می‌دم.",
  "مشکل شناسایی شد. مربوط به تنظیمات CORS در nginx هست. در حال اعمال Fix هستم.",
  "راه‌حل موقتی: از header 'Access-Control-Allow-Origin: *' در درخواست‌های خود استفاده کنید تا Patch منتشر شه.",
  "اولویت تیکت به High ارتقا یافت. تیم فنی در حال بررسی است.",
  "Patch امنیتی منتشر شد. لطفاً کش مرورگر رو پاک کنید و تست کنید.",
  "برای بررسی دقیق‌تر، آیا می‌تونید لاگ‌های کامل رو بفرستید؟",
  "این باگ در نسخه ۲.۳.۲ رفع خواهد شد.リリース 예정: این هفته.",
  "تیکت به مهندس ارشد ارجاع داده شد. تا فردا پاسخ نهایی می‌گیریم.",
  "مشکل از سمت دیتابیس بود. ایندکس‌ها rebuild شدند و حالا درسته.",
  "مستقیم با تیم محصول در میان گذاشتم. بازخوردشان رو به شما می‌گم.",
];

const internalNotes = [
  "نکته داخلی: این مشتری VIP است، اولویت بالا نگه داشته شود.",
  "یادداشت: مشتری قبلاً ۳ تیکت مشابه داشته، احتمالاً باگ تکراری.",
  "داخلی: نیاز به اسکیل کردن دیتابیس برای حل ریشه‌ای.",
  "نوت: بررسی کنید آیا پچ امنیتی هفته قبل باعث رگرسیون شده.",
  "داخلی: مشتری در حال تست در محیط استیجینگ است.",
];

export const ticketMessages: TicketMessage[] = [];

tickets.forEach((ticket) => {
  const msgCount = Math.floor(rand() * 5) + 2;
  let lastTime = ticket.createdAt;

  for (let i = 0; i < msgCount; i++) {
    const isCustomer = i === 0 || (i % 2 === 0 && ticket.status !== "New");
    const isInternal = !isCustomer && rand() < 0.2;

    if (isCustomer) {
      lastTime = addMinutes(lastTime, Math.floor(rand() * 120) + 5);
      ticketMessages.push({
        id: `msg-${ticket.id}-${i}`,
        ticketId: ticket.id,
        sender: "customer",
        senderId: ticket.customerId,
        content: randomItem(customerMessages),
        isInternal: false,
        attachments: [],
        createdAt: lastTime,
      });
    } else if (ticket.agentId) {
      lastTime = addMinutes(lastTime, Math.floor(rand() * 180) + 10);
      ticketMessages.push({
        id: `msg-${ticket.id}-${i}`,
        ticketId: ticket.id,
        sender: "agent",
        senderId: ticket.agentId,
        content: isInternal ? randomItem(internalNotes) : randomItem(agentMessages),
        isInternal,
        attachments: [],
        createdAt: lastTime,
      });
    }
  }

  if (ticket.status === "Resolved" || ticket.status === "Closed") {
    lastTime = addMinutes(lastTime, Math.floor(rand() * 60) + 5);
    ticketMessages.push({
      id: `msg-${ticket.id}-resolve`,
      ticketId: ticket.id,
      sender: "agent",
      senderId: ticket.agentId || agents[0].id,
      content: "مشکل رفع شد. در صورت بروز مجدد، این تیکت را باز کنید.",
      isInternal: false,
      attachments: [],
      createdAt: lastTime,
    });
  }
});