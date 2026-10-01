import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "NexaSupport — پلتفرم مدیریت پشتیبانی مشتری",
  description: "سیستم حرفه‌ای مدیریت تیکت، مکالمات، دانش‌نامه و آنالیتیکس پشتیبانی",
  keywords: ["پشتیبانی", "تیکت", "مشتری", "مدیریت", "SLA", "دانش‌نامه"],
  authors: [{ name: "NexaSupport Team" }],
  openGraph: {
    title: "NexaSupport",
    description: "پلتفرم مدیریت پشتیبانی مشتری",
    type: "website",
    locale: "fa_IR",
  },
};

export const viewport: Viewport = {
  themeColor: "#070b12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning className={vazirmatn.variable}>
      <body className="min-h-screen bg-bg text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}