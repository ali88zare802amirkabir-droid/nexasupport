// NexaSupport Departments Page

"use client";

import { Building2, Users, TicketCheck, Clock, TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle2, XCircle, Settings } from "lucide-react";
import { departments } from "@/data/departments";
import { agents } from "@/data/agents";
import { tickets } from "@/data/tickets";
import { slaRecords } from "@/data/sla";
import { formatDuration, cn, getSLAStatusBadge } from "@/lib/utils";
import { Card, Badge, Avatar, Button, Progress } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";
import { CountBarChart, DonutChart, TrendChart } from "@/components/charts";

export default function DepartmentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="دپارتمان‌ها" subtitle={`${departments.length} دپارتمان پشتیبانی`} />

      {/* Department Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {departments.map((dept) => {
          const deptAgents = agents.filter((a) => a.departmentId === dept.id);
          const deptTickets = tickets.filter((t) => t.departmentId === dept.id);
          const openTickets = deptTickets.filter((t) => t.status === "Open" || t.status === "New" || t.status === "Pending").length;
          const resolvedTickets = deptTickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length;
          const deptSLA = slaRecords.filter((s) => s.departmentId === dept.id);
          const slaCompliance = deptSLA.length > 0 ? Math.round((deptSLA.filter((s) => s.firstResponseStatus === "Within" && s.resolutionStatus === "Within").length / deptSLA.length) * 100) : 100;

          return (
            <Card key={dept.id} hover className="flex flex-col" style={{ borderLeft: `4px solid ${dept.color}` }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: dept.color + "20" }}>
                    <Building2 className="size-6" style={{ color: dept.color }} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">{dept.name}</h3>
                    <p className="text-sm text-ink-3">{dept.description}</p>
                  </div>
                </div>
                <Badge variant="default" style={{ backgroundColor: dept.color + "20", color: dept.color }}>{deptAgents.length} کارشناس</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-xl bg-surface border border-edge">
                <div className="text-center">
                  <p className="text-xs text-ink-3">تیکت‌های باز</p>
                  <p className="font-display text-xl font-bold text-accent">{openTickets}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-ink-3">حل شده</p>
                  <p className="font-display text-xl font-bold text-ok">{resolvedTickets}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-ink-3">SLA</p>
                  <p className="font-display text-xl font-bold" style={{ color: slaCompliance >= 90 ? "var(--ok)" : slaCompliance >= 70 ? "var(--warn)" : "var(--danger)" }}>{slaCompliance}%</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-3">SLA پاسخ اول</span>
                  <span className="font-mono text-ink">{formatDuration(dept.slaFirstResponseMinutes)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-3">SLA حل</span>
                  <span className="font-mono text-ink">{formatDuration(dept.slaResolutionMinutes)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-3">کارشناسان فعال</span>
                  <span className="font-medium text-ink">{deptAgents.filter((a) => a.status === "Online").length} از {deptAgents.length}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-edge">
                <Button variant="outline" size="sm" className="flex-1"><Settings className="size-4" /> تنظیمات</Button>
                <Button size="sm" className="flex-1" style={{ backgroundColor: dept.color, borderColor: dept.color }}>مشاهده تیکت‌ها</Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Department Analytics */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-display text-base font-bold text-ink mb-4">توزیع تیکت‌ها بر اساس دپارتمان</h3>
          <CountBarChart
            data={departments.map((d) => ({
              label: d.name,
              value: tickets.filter((t) => t.departmentId === d.id).length,
              color: d.color,
            }))}
            layout="horizontal"
            height={300}
          />
        </Card>

        <Card>
          <h3 className="font-display text-base font-bold text-ink mb-4">انطباق SLA بر اساس دپارتمان</h3>
          <CountBarChart
            data={departments.map((d) => {
              const deptSLA = slaRecords.filter((s) => s.departmentId === d.id);
              const within = deptSLA.filter((s) => s.firstResponseStatus === "Within" && s.resolutionStatus === "Within").length;
              return { label: d.name, value: deptSLA.length > 0 ? Math.round((within / deptSLA.length) * 100) : 100, color: d.color };
            })}
            layout="horizontal"
            height={300}
          />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <h3 className="font-display text-base font-bold text-ink mb-4">عملکرد دپارتمان‌ها</h3>
          <div className="space-y-3">
            {departments.map((d) => {
              const deptSLA = slaRecords.filter((s) => s.departmentId === d.id);
              const within = deptSLA.filter((s) => s.firstResponseStatus === "Within" && s.resolutionStatus === "Within").length;
              const compliance = deptSLA.length > 0 ? Math.round((within / deptSLA.length) * 100) : 100;
              return (
                <div key={d.id} className="p-3 rounded-xl bg-surface border border-edge">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-ink" style={{ color: d.color }}>{d.name}</span>
                    <Badge variant={compliance >= 90 ? "success" : compliance >= 70 ? "warning" : "danger"}>{compliance}%</Badge>
                  </div>
                  <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ backgroundColor: d.color, width: `${compliance}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="font-display text-base font-bold text-ink mb-4">توزیع اولویت در دپارتمان‌ها</h3>
          <DonutChart
            data={["Low", "Medium", "High", "Urgent"].map((p) => ({
              label: p === "Low" ? "کم" : p === "Medium" ? "متوسط" : p === "High" ? "بالا" : "فوری",
              value: tickets.filter((t) => t.priority === p).length,
            }))}
            height={250}
          />
        </Card>

        <Card>
          <h3 className="font-display text-base font-bold text-ink mb-4">SLA به خطر افتاده</h3>
          <div className="space-y-2">
            {departments.map((d) => {
              const atRisk = slaRecords.filter((s) => s.departmentId === d.id && (s.firstResponseStatus === "At Risk" || s.resolutionStatus === "At Risk")).length;
              if (atRisk === 0) return null;
              return (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-warn-soft/20 border border-warn/30">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg flex items-center justify-center bg-warn/20"><AlertTriangle className="size-4 text-warn" /></div>
                    <span className="font-medium text-ink">{d.name}</span>
                  </div>
                  <Badge variant="warning">{atRisk} تیکت</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}