// NexaSupport Customer Detail Page

"use client";

import { use, useState } from "react";
import { ArrowLeft, TicketCheck, MessageSquare, Clock, Star, TrendingUp, TrendingDown, Building2, Mail, MapPin, Phone, X, Activity } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useCustomers } from "@/lib/store";
import { tickets } from "@/data/tickets";
import { ticketMessages } from "@/data/ticketMessages";
import { formatDate, formatRelativeTime, getStatusBadge, getPriorityBadge, getCustomerStatusBadge, cn, STATUS_LABELS_FA, PRIORITY_LABELS_FA, CUSTOMER_STATUS_LABELS_FA } from "@/lib/utils";
import { Card, Badge, Avatar, Button, Tabs } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";
import { TrendChart, CountBarChart, DonutChart } from "@/components/charts";

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const customersList = useCustomers();
  const customer = customersList.find((c) => c.id === id);
  if (!customer) notFound();

  const customerTickets = tickets.filter((t) => t.customerId === customer.id);
  const customerMessages = ticketMessages.filter((m) => customerTickets.some((t) => t.id === m.ticketId));
  const openTickets = customerTickets.filter((t) => t.status === "Open" || t.status === "New" || t.status === "Pending");
  const resolvedTickets = customerTickets.filter((t) => t.status === "Resolved" || t.status === "Closed");

  const [activeTab, setActiveTab] = useState<"tickets" | "conversations" | "activity" | "stats">("tickets");

  const ticketsByStatus = ["New", "Open", "Pending", "Resolved", "Closed"].map((s) => ({
    label: STATUS_LABELS_FA[s],
    value: customerTickets.filter((t) => t.status === s).length,
  }));
  const ticketsByPriority = ["Low", "Medium", "High", "Urgent"].map((p) => ({
    label: PRIORITY_LABELS_FA[p],
    value: customerTickets.filter((t) => t.priority === p).length,
  }));

  return (
    <div className="flex flex-col gap-6">
      <Link href="/customers" className="text-sm text-accent hover:underline flex items-center gap-1">
        <ArrowLeft className="size-4" /> بازگشت به مشتریان
      </Link>

      {/* Header */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <Avatar name={customer.name} color={customer.avatarColor} size="xl" />
            <div>
              <h1 className="font-display text-2xl font-bold text-ink">{customer.name}</h1>
              <p className="text-ink-3">{customer.company}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-ink-3">
                <span className="flex items-center gap-1"><Mail className="size-3.5" />{customer.email}</span>
                <Badge variant={getCustomerStatusBadge(customer.status)}>{CUSTOMER_STATUS_LABELS_FA[customer.status]}</Badge>
              </div>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 sm:mt-0">
            <div className="p-3 rounded-xl bg-surface border border-edge">
              <p className="text-xs text-ink-3">کل تیکت‌ها</p>
              <p className="font-display text-xl font-bold text-ink">{customer.totalTickets}</p>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-edge">
              <p className="text-xs text-ink-3">باز</p>
              <p className="font-display text-xl font-bold text-accent">{openTickets.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-edge">
              <p className="text-xs text-ink-3">حل شده</p>
              <p className="font-display text-xl font-bold text-ok">{resolvedTickets.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-edge">
              <p className="text-xs text-ink-3">رضایت</p>
              <p className="font-display text-xl font-bold text-warn">{customer.satisfactionScore}%</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={[
        { id: "tickets", label: "تیکت‌ها", icon: <TicketCheck className="size-4" /> },
        { id: "conversations", label: "مکالمات", icon: <MessageSquare className="size-4" /> },
        { id: "activity", label: "فعالیت", icon: <Activity className="size-4" /> },
        { id: "stats", label: "آمار", icon: <TrendingUp className="size-4" /> },
      ]} activeTab={activeTab} onChange={(id) => setActiveTab(id as typeof activeTab)} />

      {/* Tab Content */}
      {activeTab === "tickets" && (
        <Card padding="none">
          <div className="p-5 border-b border-edge">
            <h2 className="font-display text-base font-bold text-ink">تیکت‌های مشتری</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-edge">
                  <th className="px-4 py-3 text-right text-xs font-semibold text-ink-3">تیکت</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-ink-3">موضوع</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-ink-3">اولویت</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-ink-3">وضعیت</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-ink-3">ایجاد شده</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-ink-3">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {customerTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-edge/50 hover:bg-surface-2/40">
                    <td className="px-4 py-3 font-mono text-xs text-ink-2"><Link href={`/tickets/${ticket.id}`} className="text-accent hover:underline">{ticket.id}</Link></td>
                    <td className="px-4 py-3 text-ink truncate max-w-[300px]">{ticket.subject}</td>
                    <td className="px-4 py-3"><Badge variant={getPriorityBadge(ticket.priority)}>{PRIORITY_LABELS_FA[ticket.priority]}</Badge></td>
                    <td className="px-4 py-3"><Badge variant={getStatusBadge(ticket.status)}>{STATUS_LABELS_FA[ticket.status]}</Badge></td>
                    <td className="px-4 py-3 text-sm text-ink-2">{formatDate(ticket.createdAt)}</td>
                    <td className="px-4 py-3"><Link href={`/tickets/${ticket.id}`} className="text-accent hover:underline text-sm">مشاهده</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {customerTickets.length === 0 && <div className="p-10 text-center"><TicketCheck className="size-12 mx-auto text-ink-3 mb-3" /><p className="text-ink-3">تیکتی برای این مشتری وجود ندارد</p></div>}
          </div>
        </Card>
      )}

      {activeTab === "conversations" && (
        <Card padding="md">
          <h2 className="font-display text-base font-bold text-ink mb-4">مکالمات اخیر</h2>
          <div className="space-y-3">
            {customerMessages.slice(0, 10).map((msg) => (
              <div key={msg.id} className="p-3 rounded-xl bg-surface border border-edge">
                <div className="flex items-start gap-3">
                  <Avatar name={msg.sender === "customer" ? customer.name : "کارشناس"} color={msg.sender === "customer" ? customer.avatarColor : "#55a1ff"} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-ink">{msg.sender === "customer" ? customer.name : "کارشناس پشتیبانی"}</span>
                      <span className="text-xs text-ink-3 shrink-0">{formatRelativeTime(msg.createdAt)}</span>
                    </div>
                    <p className="text-sm text-ink-2 mt-1">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {customerMessages.length === 0 && <p className="text-center text-ink-3 py-8">مکالمه‌ای وجود ندارد</p>}
          </div>
        </Card>
      )}

      {activeTab === "activity" && (
        <Card padding="md">
          <h2 className="font-display text-base font-bold text-ink mb-4">زمان‌بندی فعالیت</h2>
          <div className="space-y-3">
            {customerTickets.slice(0, 5).flatMap((t) => [
              { id: `act-${t.id}-created`, desc: `تیکت ${t.id} ایجاد شد`, time: t.createdAt },
              ...(t.resolvedAt ? [{ id: `act-${t.id}-resolved`, desc: `تیکت ${t.id} حل شد`, time: t.resolvedAt }] : []),
            ]).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10).map((act) => (
              <div key={act.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-edge">
                <div className="size-8 flex items-center justify-center rounded-xl bg-accent/10"><Activity className="size-4 text-accent" /></div>
                <div>
                  <p className="text-sm text-ink">{act.desc}</p>
                  <p className="text-xs text-ink-3 mt-0.5">{formatRelativeTime(act.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "stats" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <h3 className="font-display text-base font-bold text-ink mb-4">توزیع وضعیت</h3>
            <DonutChart data={ticketsByStatus.filter((d) => d.value > 0)} height={250} />
          </Card>
          <Card>
            <h3 className="font-display text-base font-bold text-ink mb-4">توزیع اولویت</h3>
            <DonutChart data={ticketsByPriority.filter((d) => d.value > 0)} height={250} />
          </Card>
        </div>
      )}
    </div>
  );
}