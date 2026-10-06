// NexaSupport Analytics Page

"use client";

import { useState } from "react";
import { Calendar, TrendingUp, TrendingDown, Target, Star, Users, TicketCheck, Clock, CheckCircle2, AlertTriangle, Download } from "lucide-react";
import { Card, Badge, Button, Select, Avatar } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";
import { TrendChart, CountBarChart, DonutChart, StackedBarChart, SimpleAreaChart } from "@/components/charts";
import { getDashboardMetrics, getTicketVolumeData, getTicketsByPriority, getTicketsByStatus, getTicketsByDepartment, getSLAOverview, getAgentPerformance, getResolutionTrend, getSatisfactionTrend, getSLAComplianceByPriority, getSLAComplianceByDepartment } from "@/lib/metrics";
import { tickets } from "@/data/tickets";
import { agents } from "@/data/agents";
import { departments } from "@/data/departments";
import { slaRecords } from "@/data/sla";
import { satisfactionRecords } from "@/data/satisfaction";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d");
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;

  const metrics = getDashboardMetrics();
  const volumeData = getTicketVolumeData(days);
  const priorityData = getTicketsByPriority();
  const statusData = getTicketsByStatus();
  const deptData = getTicketsByDepartment();
  const slaData = getSLAOverview();
  const agentData = getAgentPerformance();
  const resolutionTrend = getResolutionTrend(days);
  const satisfactionTrend = getSatisfactionTrend(days);
  const slaByPriority = getSLAComplianceByPriority();
  const slaByDept = getSLAComplianceByDepartment();

  const resolvedTotal = tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length;
  const resolutionRate = tickets.length > 0 ? Math.round((resolvedTotal / tickets.length) * 100) : 0;

  const positiveSatisfactions = satisfactionRecords.filter((s) => s.rating === "Positive").length;
  const avgSatisfaction = satisfactionRecords.length > 0 ? Math.round((positiveSatisfactions / satisfactionRecords.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="آنالیتیکس"
        subtitle="تحلیل عملکرد پشتیبانی"
        actions={
          <div className="flex items-center gap-2">
            <Select value={period} onChange={(e) => setPeriod(e.target.value as typeof period)}>
              <option value="7d">۷ روز اخیر</option>
              <option value="30d">۳۰ روز اخیر</option>
              <option value="90d">۹۰ روز اخیر</option>
            </Select>
            <Button variant="outline" size="sm"><Download className="size-4" /> خروجی گزارش</Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {[
          { label: "کل تیکت‌ها", value: tickets.length, icon: TicketCheck, color: "#55a1ff" },
          { label: "نرخ حل", value: `${resolutionRate}%`, icon: CheckCircle2, color: "#34d399" },
          { label: "میانگین پاسخ", value: `${metrics.avgResponseMinutes} دقیقه`, icon: Clock, color: "#35d3f2" },
          { label: "رضایت مشتری", value: `${avgSatisfaction}%`, icon: Star, color: "#a78bfa" },
          { label: "SLA در چارچوب", value: `${slaData.find((d) => d.status === "Within")?.value ?? 0}%`, icon: Target, color: "#fbbf24" },
          { label: "کارشناسان فعال", value: agents.filter((a) => a.status === "Online").length, icon: Users, color: "#f472b6" },
        ].map((kpi, i) => (
          <Card key={i} hover>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ink-3">{kpi.label}</p>
                  <p className="font-display text-2xl font-bold text-ink">{kpi.value}</p>
                </div>
                <div className="size-12 rounded-xl flex items-center justify-center" style={{ color: kpi.color, backgroundColor: `${kpi.color}15` }}>
                  <kpi.icon className="size-6" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Volume Trend */}
      <Card className="lg:col-span-2">
        <h3 className="font-display text-base font-bold text-ink mb-4">حجم تیکت‌ها ({period === "7d" ? "۷ روزه" : period === "30d" ? "۳۰ روزه" : "۹۰ روزه"})</h3>
        <TrendChart
          data={volumeData.map((d) => ({ label: d.label, value: d.new + d.resolved + d.pending }))}
          color="#55a1ff"
          height={300}
        />
      </Card>

      {/* Distribution Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <h3 className="font-display text-base font-bold text-ink mb-4">توزیع اولویت‌ها</h3>
          <DonutChart data={priorityData.map((d) => ({ label: d.label, value: d.value }))} height={250} />
        </Card>
        <Card>
          <h3 className="font-display text-base font-bold text-ink mb-4">توزیع وضعیت‌ها</h3>
          <DonutChart data={statusData.map((d) => ({ label: d.label, value: d.value }))} height={250} />
        </Card>
        <Card>
          <h3 className="font-display text-base font-bold text-ink mb-4">SLA - وضعیت</h3>
          <DonutChart data={slaData.map((d) => ({ label: d.label, value: d.value, color: d.status === "Within" ? "#34d399" : d.status === "At Risk" ? "#fbbf24" : "#f87171" }))} height={250} />
        </Card>
      </div>

      {/* Department & Channel */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-display text-base font-bold text-ink mb-4">تیکت‌ها بر اساس دپارتمان</h3>
          <CountBarChart
            data={deptData.map((d) => ({ label: d.label, value: d.value, color: departments.find((dep) => dep.id === d.departmentId)?.color ?? "#55a1ff" }))}
            layout="horizontal"
            height={280}
          />
        </Card>
        <Card>
          <h3 className="font-display text-base font-bold text-ink mb-4">تیکت‌ها بر اساس کانال</h3>
          <CountBarChart
            data={["Email", "Chat", "Phone", "Portal", "Social"].map((c) => ({ label: c === "Email" ? "ایمیل" : c === "Chat" ? "چت" : c === "Phone" ? "تلفن" : c === "Portal" ? "پرتال" : "شبکه اجتماعی", value: tickets.filter((t) => t.channel === c).length, color: c === "Email" ? "#55a1ff" : c === "Chat" ? "#34d399" : c === "Phone" ? "#fbbf24" : c === "Portal" ? "#a78bfa" : "#f472b6" }))}
            layout="horizontal"
            height={280}
          />
        </Card>
      </div>

      {/* Resolution & Satisfaction Trends */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <h3 className="font-display text-base font-bold text-ink mb-4">روند حل تیکت‌ها</h3>
          <div className="h-[300px]">
            <StackedBarChart
              data={resolutionTrend.map((d) => ({ label: d.label, created: d.created, resolved: d.resolved }))}
              keys={["created", "resolved"]}
              colors={["var(--accent)", "var(--ok)"]}
              height={300}
            />
          </div>
        </Card>

        <Card>
          <h3 className="font-display text-base font-bold text-ink mb-4">روند رضایت مشتری</h3>
          <TrendChart data={satisfactionTrend.map((d) => ({ label: d.label, value: d.score }))} color="#a78bfa" height={250} />
        </Card>

        <Card>
          <h3 className="font-display text-base font-bold text-ink mb-4">عملکرد کارشناسان (تعداد حل شده)</h3>
          <CountBarChart
            data={agentData.map((d) => ({ label: d.label, value: d.resolved }))}
            layout="horizontal"
            height={280}
          />
        </Card>
      </div>

      {/* SLA Compliance */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-display text-base font-bold text-ink mb-4">انطباق SLA بر اساس اولویت</h3>
          <CountBarChart
            data={slaByPriority.map((d) => ({ label: d.label, value: d.value, color: d.priority === "Urgent" ? "#f87171" : d.priority === "High" ? "#fbbf24" : d.priority === "Medium" ? "#55a1ff" : "#34d399" }))}
            layout="horizontal"
            height={280}
          />
        </Card>
        <Card>
          <h3 className="font-display text-base font-bold text-ink mb-4">انطباق SLA بر اساس دپارتمان</h3>
          <CountBarChart
            data={slaByDept.map((d) => ({ label: d.label, value: d.value, color: departments.find((dep) => dep.id === d.departmentId)?.color ?? "#55a1ff" }))}
            layout="horizontal"
            height={280}
          />
        </Card>
      </div>

      {/* Agent Performance Detail */}
      <Card>
        <h3 className="font-display text-base font-bold text-ink mb-4">جزئیات عملکرد کارشناسان</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-edge">
                {["کارشناس", "تخصیص‌یافته", "حل شده", "نرخ حل", "میانگین پاسخ (دقیقه)", "رضایت", "وضعیت"].map((h) => (
                  <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-ink-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-b border-edge/50 hover:bg-surface-2/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={agent.name} color={agent.avatarColor} size="sm" />
                      <span className="font-medium text-ink">{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-2">{agent.assignedTickets}</td>
                  <td className="px-4 py-3 text-ok">{agent.resolvedTickets}</td>
                  <td className="px-4 py-3">
                    <Badge variant={agent.assignedTickets > 0 && agent.resolvedTickets / agent.assignedTickets > 0.8 ? "success" : agent.assignedTickets > 0 && agent.resolvedTickets / agent.assignedTickets > 0.5 ? "warning" : "danger"}>
                      {agent.assignedTickets > 0 ? Math.round((agent.resolvedTickets / agent.assignedTickets) * 100) : 0}%
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-ink">{agent.avgResponseMinutes}</td>
                  <td className="px-4 py-3">{agent.satisfactionScore}% <Star className="size-3.5 text-warn inline" /></td>
                  <td className="px-4 py-3"><Badge variant={agent.status === "Online" ? "success" : agent.status === "Away" ? "warning" : "default"}>{agent.status === "Online" ? "آنلاین" : agent.status === "Away" ? "دور از دستگاه" : "آفلاین"}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}