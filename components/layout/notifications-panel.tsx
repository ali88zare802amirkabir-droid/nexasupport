// NexaSupport Notifications Panel

"use client";

import { useState, useEffect } from "react";
import { cn, formatRelativeTime, getNotificationIcon } from "@/lib/utils";
import { ICONS } from "./nav";
import { TicketCheck, AlertTriangle, MessageSquare, CheckCircle2, AtSign } from "lucide-react";

function getNotificationIconComponent(type: string) {
  switch (type) {
    case "ticket_assigned": return <TicketCheck className="size-4" />;
    case "sla_warning": return <AlertTriangle className="size-4" />;
    case "customer_replied": return <MessageSquare className="size-4" />;
    case "ticket_resolved": return <CheckCircle2 className="size-4" />;
    case "internal_mention": return <AtSign className="size-4" />;
    default: return <TicketCheck className="size-4" />;
  }
}
import { useNotificationsPanel, useNotifications, useApp } from "@/lib/store";
import { Badge } from "@/components/ui";

export function NotificationsPanel() {
  const { open, toggle } = useNotificationsPanel();
  const notifications = useNotifications();
  const { markNotificationRead, markAllNotificationsRead, addActivity } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <button
        onClick={toggle}
        className="relative p-2 rounded-xl text-ink-3 hover:bg-surface-2 hover:text-ink transition-colors"
        aria-label={`اعلان‌ها${unreadCount > 0 ? `، ${unreadCount} خوانده نشده` : ""}`}
        aria-expanded={open}
      >
        <ICONS.Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -left-1 size-5 flex items-center justify-center text-[10px] font-bold bg-danger text-white rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed top-16 left-4 right-4 sm:w-96 sm:right-auto z-50 glass rounded-2xl border border-edge shadow-elevated overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-edge">
            <h3 className="font-display text-base font-bold text-ink">اعلان‌ها</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => { markAllNotificationsRead(); addActivity({ type: "ticket_resolved", actorId: "user-01", actorName: "شما", actorType: "agent", ticketId: null, customerId: null, description: "همه اعلان‌ها خوانده شد", metadata: {} }); }}
                  className="text-xs text-accent hover:underline"
                >
                  همۀ را خوانده شده
                </button>
              )}
              <button onClick={toggle} className="p-1 rounded-lg text-ink-3 hover:bg-surface-2 hover:text-ink transition-colors" aria-label="بستن">
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <ICONS.Bell className="size-12 mx-auto text-ink-3 mb-3" />
                <p className="text-ink-3">اعلانی وجود ندارد</p>
              </div>
            ) : (
              <ul className="divide-y divide-edge/50">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    onClick={() => { if (!notif.read) markNotificationRead(notif.id); }}
                    className={cn("p-4 hover:bg-surface-2/50 transition-colors cursor-pointer", !notif.read && "bg-accent/5")}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("size-8 flex items-center justify-center rounded-xl", !notif.read && "bg-accent/10")}>
                        {getNotificationIconComponent(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-medium", !notif.read && "text-ink", notif.read && "text-ink-2")}>{notif.title}</p>
                        <p className="text-xs text-ink-3 mt-0.5 line-clamp-2">{notif.message}</p>
                        <p className="text-[10px] text-ink-3 mt-1">{formatRelativeTime(notif.createdAt)}</p>
                      </div>
                      {!notif.read && <div className="size-2 rounded-full bg-accent mt-1.5 shrink-0" />}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}