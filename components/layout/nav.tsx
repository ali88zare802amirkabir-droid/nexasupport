// NexaSupport Navigation Configuration

import { LayoutDashboard, TicketCheck, Users, MessageSquare, BookOpen, UserCheck, Building2, Timer, BarChart3, Settings, Bell, Search, User, Menu, X, ChevronLeft, LogOut } from "lucide-react";
import type { ReactNode } from "react";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "نمای کلی", href: "/overview", icon: <LayoutDashboard className="size-5" /> },
  { id: "tickets", label: "تیکت‌ها", href: "/tickets", icon: <TicketCheck className="size-5" /> },
  { id: "customers", label: "مشتریان", href: "/customers", icon: <Users className="size-5" /> },
  { id: "conversations", label: "مکالمات", href: "/conversations", icon: <MessageSquare className="size-5" /> },
  { id: "knowledge-base", label: "دانش‌نامه", href: "/knowledge-base", icon: <BookOpen className="size-5" /> },
  { id: "agents", label: "کارشناسان", href: "/agents", icon: <UserCheck className="size-5" /> },
  { id: "departments", label: "دپارتمان‌ها", href: "/departments", icon: <Building2 className="size-5" /> },
  { id: "sla", label: "SLA", href: "/sla", icon: <Timer className="size-5" /> },
  { id: "analytics", label: "آنالیتیکس", href: "/analytics", icon: <BarChart3 className="size-5" /> },
  { id: "settings", label: "تنظیمات", href: "/settings", icon: <Settings className="size-5" /> },
];

export const ICONS = {
  LayoutDashboard,
  TicketCheck,
  Users,
  MessageSquare,
  BookOpen,
  UserCheck,
  Building2,
  Timer,
  BarChart3,
  Settings,
  Bell,
  Search,
  User,
  Menu,
  X,
  ChevronLeft,
  LogOut,
};