// NexaSupport Overview Dashboard

"use client";

import { Users, TicketCheck, CheckCircle2, Clock, AlertTriangle, Star, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardTitle, Badge, Avatar } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";
import { TrendChart, CountBarChart, DonutChart, SimpleAreaChart } from "@/components/charts";
import { getDashboardMetrics, getTicketVolumeData, getTicketsByPriority, getTicketsByStatus, getTicketsByDepartment, getSLAOverview, getAgentPerformance, getResolutionTrend, getSatisfactionTrend } from "@/lib/metrics";
import { tickets } from "@/data/tickets";
import { agents } from "@/data/agents";
import { activities } from "@/data/activities";
import { departments } from "@/data/departments";
import { slaRecords } from "@/data/sla";
import { cn, formatRelativeTime, STATUS_LABELS_FA, PRIORITY_LABELS_FA } from "@/lib/utils";

export default function OverviewPage() {
  const metrics = getDashboardMetrics();
  const volumeData = getTicketVolumeData(7);
  const priorityData = getTicketsByPriority();
  const statusData = getTicketsByStatus();
  const deptData = getTicketsByDepartment();
  const slaData = getSLAOverview();
  const agentData = getAgentPerformance();
  const resolutionTrend = getResolutionTrend(7);
  const satisfactionTrend = getSatisfactionTrend(7);
  const recentActivities = activities.slice(0, 8);

  const kpiCards = [
    { label: "تیکت‌های باز", value: metrics.openTickets, icon: TicketCheck, color: "#55a1ff", trend: "+12%", trendUp: true },
    { label: "در انتظار", value: metrics.pendingTickets, icon: Clock, color: "#fbbf24", trend: "-5%", trendUp: false },
    { label: "حل شده امروز", value: metrics.resolvedToday, icon: CheckCircle2, color: "#34d399", trend: "+8%", trendUp: true },
    { label: "میانگین پاسخ", value: `${metrics.avgResponseMinutes} دقیقه`, icon: Clock, color: "#35d3f2", trend: "-3 دق", trendUp: true },
    { label: "SLA در خطر", value: metrics.slaAtRisk, icon: AlertTriangle, color: "#f87171", trend: "+2", trendUp: false },
    { label: "رضایت مشتری", value: `${metrics.satisfactionScore}%`, icon: Star, color: "#a78bfa", trend: "+2%", trendUp: true },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="نمای کلی" subtitle="داشبورد عملیات پشتیبانی" />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpiCards.map((kpi, i) => (
          <Card key={i} hover>
            <CardContent className="pt-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-ink-3">{kpi.label}</p>
                  <p className="mt-1 font-display text-2xl font-bold text-ink">{kpi.value}</p>
                  <div className="mt-2 flex items-center gap-1">
                    <span className={cn("text-xs font-medium", kpi.trendUp ? "text-ok" : "text-danger")}>
                      {kpi.trendUp ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                      {kpi.trend}
                    </span>
                    <span className="text-xs text-ink-3">از هفته قبل</span>
                  </div>
                </div>
                <div className="size-12 rounded-xl flex items-center justify-center" style={{ color: kpi.color, backgroundColor: `${kpi.color}15` }}>
                  <kpi.icon className="size-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>حجم تیکت‌ها (۷ روز اخیر)</CardTitle>
          <CardContent className="pt-0">
            <TrendChart
              data={volumeData.map((d) => ({ label: d.label, value: d.new + d.resolved + d.pending }))}
              color="#55a1ff"
              height={250}
            />
          </CardContent>
        </Card>

        <Card>
          <CardTitle>توزیع اولویت‌ها</CardTitle>
          <CardContent className="pt-0">
            <DonutChart
              data={priorityData.map((d) => ({ label: d.label, value: d.value }))}
              height={250}
            />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>وضعیت تیکت‌ها</CardTitle>
          <CardContent className="pt-0">
            <CountBarChart
              data={statusData.map((d) => ({ label: d.label, value: d.value, color: d.status === "Resolved" ? "#34d399" : d.status === "Pending" ? "#fbbf24" : d.status === "New" ? "#55a1ff" : d.status === "Open" ? "#35d3f2" : "#94a3b8" }))}
              height={250}
            />
          </CardContent>
        </Card>

        <Card>
          <CardTitle>SLA - وضعیت کلی</CardTitle>
          <CardContent className="pt-0">
            <DonutChart
              data={slaData.map((d) => ({ label: d.label, value: d.value, color: d.status === "Within" ? "#34d399" : d.status === "At Risk" ? "#fbbf24" : "#f87171" }))}
              height={250}
            />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle>روند حل تیکت‌ها (۷ روز اخیر)</CardTitle>
          <CardContent className="pt-0">
            <SimpleAreaChart
              data={resolutionTrend.map((d) => ({ label: d.label, value: d.resolved }))}
              color="#34d399"
              height={250}
            />
          </CardContent>
        </Card>

        <Card>
          <CardTitle>عملکرد کارشناسان</CardTitle>
          <CardContent className="pt-0">
            <CountBarChart
              data={agentData.map((d) => ({ label: d.label, value: d.resolved, color: d.satisfaction >= 95 ? "#34d399" : d.satisfaction >= 90 ? "#55a1ff" : "#fbbf24" }))}
              layout="horizontal"
              height={250}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <div className="flex items-center justify-between p-5 border-b border-edge">
          <CardTitle>فعالیت‌های اخیر</CardTitle>
        </div>
        <div className="p-5">
          <ul className="divide-y divide-edge/50">
            {recentActivities.map((act) => (
              <li key={act.id} className="py-3 flex items-start gap-3">
                <div className="size-8 flex items-center justify-center rounded-xl bg-surface-2">
                  <ActivityIcon type={act.type} className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink">{act.description}</p>
                  <p className="text-xs text-ink-3 mt-0.5">{formatRelativeTime(act.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}

function ActivityIcon({ type, className }: { type: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    ticket_created: <TicketCheck className="text-accent" />,
    ticket_assigned: <Users className="text-cyan" />,
    ticket_replied: <MessageSquare className="text-ok" />,
    ticket_resolved: <CheckCircle2 className="text-ok" />,
    ticket_status_changed: <TrendingUp className="text-warn" />,
    priority_changed: <AlertTriangle className="text-danger" />,
    customer_added: <Users className="text-accent" />,
    internal_note: <FileText className="text-ink-3" />,
  };
  return icons[type] || <TicketCheck className="text-ink-3" />;
}

import { FileText, MessageSquare } from "lucide-react";