// NexaSupport SLA Page

"use client";

import { useState, useMemo } from "react";
import { Search, Filter, AlertTriangle, CheckCircle2, XCircle, Clock, TrendingUp, TrendingDown, ChevronUp, ChevronDown, ArrowUpDown, Target, AlertCircle } from "lucide-react";
import { slaRecords } from "@/data/sla";
import { tickets } from "@/data/tickets";
import { departments } from "@/data/departments";
import { formatRelativeTime, getSLAStatusBadge, cn, PRIORITY_LABELS_FA, STATUS_LABELS_FA } from "@/lib/utils";
import { Button, Select, TextInput, Badge, Card, Table, Progress } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";
import { CountBarChart, DonutChart, TrendChart, StackedBarChart } from "@/components/charts";

const SLA_STATUSES = ["Within", "At Risk", "Breached"] as const;

export default function SLAPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [sortBy, setSortBy] = useState<"ticket" | "priority" | "dept" | "firstResponse" | "resolution">("firstResponse");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const enrichedSLA = useMemo(() => {
    return slaRecords.map((sla) => {
      const ticket = tickets.find((t) => t.id === sla.ticketId);
      const dept = departments.find((d) => d.id === sla.departmentId);
      return { ...sla, ticket, dept };
    });
  }, []);

  const filtered = useMemo(() => {
    let result = [...enrichedSLA];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.ticket?.id.toLowerCase().includes(q) || s.ticket?.subject.toLowerCase().includes(q));
    }
    if (statusFilter) result = result.filter((s) => s.firstResponseStatus === statusFilter || s.resolutionStatus === statusFilter);
    if (priorityFilter) result = result.filter((s) => s.priority === priorityFilter);
    if (deptFilter) result = result.filter((s) => s.dept?.id === deptFilter);

    result.sort((a, b) => {
      let aVal: string | number, bVal: string | number;
      if (sortBy === "ticket") { aVal = a.ticket?.id ?? ""; bVal = b.ticket?.id ?? ""; }
      else if (sortBy === "priority") { const p = { Urgent: 4, High: 3, Medium: 2, Low: 1 }; aVal = p[a.priority]; bVal = p[b.priority]; }
      else if (sortBy === "dept") { aVal = a.dept?.name ?? ""; bVal = b.dept?.name ?? ""; }
      else if (sortBy === "firstResponse") { aVal = a.firstResponseStatus === "Breached" ? 0 : a.firstResponseStatus === "At Risk" ? 1 : 2; bVal = b.firstResponseStatus === "Breached" ? 0 : b.firstResponseStatus === "At Risk" ? 1 : 2; }
      else { aVal = a.resolutionStatus === "Breached" ? 0 : a.resolutionStatus === "At Risk" ? 1 : 2; bVal = b.resolutionStatus === "Breached" ? 0 : b.resolutionStatus === "At Risk" ? 1 : 2; }
      if (typeof aVal === "string") return sortDir === "asc" ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
      const an = Number(aVal); const bn = Number(bVal); return sortDir === "asc" ? (an > bn ? 1 : -1) : (an < bn ? 1 : -1);
    });
    return result;
  }, [search, statusFilter, priorityFilter, deptFilter, sortBy, sortDir]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(field); setSortDir("desc"); }
  };

  const withinCount = slaRecords.filter((s) => s.firstResponseStatus === "Within" && s.resolutionStatus === "Within").length;
  const atRiskCount = slaRecords.filter((s) => s.firstResponseStatus === "At Risk" || s.resolutionStatus === "At Risk").length;
  const breachedCount = slaRecords.filter((s) => s.firstResponseStatus === "Breached" || s.resolutionStatus === "Breached").length;
  const total = slaRecords.length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="SLA" subtitle="مانیتورینگ قراردادهای سطح خدمات" />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card hover>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-3">در چارچوب SLA</p>
                <p className="font-display text-3xl font-bold text-ok">{withinCount}</p>
                <p className="text-xs text-ink-3 mt-1">{total > 0 ? Math.round((withinCount / total) * 100) : 100}% از کل</p>
              </div>
              <div className="size-14 rounded-xl bg-ok/15 flex items-center justify-center"><CheckCircle2 className="size-7 text-ok" /></div>
            </div>
          </div>
        </Card>
        <Card hover>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-3">در خطر</p>
                <p className="font-display text-3xl font-bold text-warn">{atRiskCount}</p>
                <p className="text-xs text-ink-3 mt-1">{total > 0 ? Math.round((atRiskCount / total) * 100) : 0}% از کل</p>
              </div>
              <div className="size-14 rounded-xl bg-warn/15 flex items-center justify-center"><AlertTriangle className="size-7 text-warn" /></div>
            </div>
          </div>
        </Card>
        <Card hover>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-3">نقض شده</p>
                <p className="font-display text-3xl font-bold text-danger">{breachedCount}</p>
                <p className="text-xs text-ink-3 mt-1">{total > 0 ? Math.round((breachedCount / total) * 100) : 0}% از کل</p>
              </div>
              <div className="size-14 rounded-xl bg-danger/15 flex items-center justify-center"><XCircle className="size-7 text-danger" /></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-display text-base font-bold text-ink mb-4">SLA - وضعیت کلی</h3>
          <DonutChart
            data={[
              { label: "در چارچوب", value: withinCount, color: "var(--ok)" },
              { label: "در خطر", value: atRiskCount, color: "var(--warn)" },
              { label: "نقض شده", value: breachedCount, color: "var(--danger)" },
            ]}
            height={250}
          />
        </Card>

        <Card>
          <h3 className="font-display text-base font-bold text-ink mb-4">SLA بر اساس اولویت</h3>
          <CountBarChart
            data={["Low", "Medium", "High", "Urgent"].map((p) => {
              const pSLA = slaRecords.filter((s) => s.priority === p);
              const within = pSLA.filter((s) => s.firstResponseStatus === "Within" && s.resolutionStatus === "Within").length;
              return { label: PRIORITY_LABELS_FA[p], value: pSLA.length > 0 ? Math.round((within / pSLA.length) * 100) : 100, priority: p };
            })}
            layout="horizontal"
            height={250}
          />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-display text-base font-bold text-ink mb-4">SLA بر اساس دپارتمان</h3>
          <CountBarChart
            data={departments.map((d) => {
              const dSLA = slaRecords.filter((s) => s.departmentId === d.id);
              const within = dSLA.filter((s) => s.firstResponseStatus === "Within" && s.resolutionStatus === "Within").length;
              return { label: d.name, value: dSLA.length > 0 ? Math.round((within / dSLA.length) * 100) : 100, color: d.color };
            })}
            layout="horizontal"
            height={250}
          />
        </Card>

        <Card>
          <h3 className="font-display text-base font-bold text-ink mb-4">روند نقض SLA (۷ روز اخیر)</h3>
          <TrendChart
            data={Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              const dateStr = date.toISOString().split("T")[0];
              const breached = slaRecords.filter((s) => (s.firstResponseStatus === "Breached" || s.resolutionStatus === "Breached") && s.ticketId && tickets.find((t) => t.id === s.ticketId)?.createdAt.startsWith(dateStr)).length;
              return { label: date.toLocaleDateString("fa-IR", { weekday: "short" }), value: breached };
            })}
            color="var(--danger)"
            height={250}
          />
        </Card>
      </div>

      {/* SLA Table */}
      <Card padding="md">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
            <TextInput placeholder="جستجوی تیکت..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9" />
          </div>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">همه وضعیت‌ها</option>
            {SLA_STATUSES.map((s) => <option key={s} value={s}>{s === "Within" ? "در چارچوب" : s === "At Risk" ? "در خطر" : "نقض شده"}</option>)}
          </Select>
          <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">همه اولویت‌ها</option>
            {["Low", "Medium", "High", "Urgent"].map((p) => <option key={p} value={p}>{PRIORITY_LABELS_FA[p]}</option>)}
          </Select>
          <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="">همه دپارتمان‌ها</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
        </div>
      </Card>

      <Card padding="none">
        <Table>
          <thead>
            <tr>
              <th onClick={() => handleSort("ticket")} className="cursor-pointer">تیکت <ArrowUpDown className="size-3.5 inline ml-1 opacity-50" /></th>
              <th className="hidden md:table-cell">موضوع</th>
              <th className="hidden lg:table-cell cursor-pointer" onClick={() => handleSort("priority")}>اولویت <ArrowUpDown className="size-3.5 inline ml-1 opacity-50" /></th>
              <th className="hidden lg:table-cell cursor-pointer" onClick={() => handleSort("dept")}>دپارتمان <ArrowUpDown className="size-3.5 inline ml-1 opacity-50" /></th>
              <th onClick={() => handleSort("firstResponse")} className="cursor-pointer">SLA پاسخ اول <ArrowUpDown className="size-3.5 inline ml-1 opacity-50" /></th>
              <th onClick={() => handleSort("resolution")} className="cursor-pointer">SLA حل <ArrowUpDown className="size-3.5 inline ml-1 opacity-50" /></th>
              <th className="hidden lg:table-cell">زمان باقی‌مانده پاسخ اول</th>
              <th className="hidden lg:table-cell">زمان باقی‌مانده حل</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sla) => (
              <tr key={sla.ticketId} className="hover:bg-surface-2/40">
                <td className="font-mono text-xs text-ink-2">{sla.ticket?.id}</td>
                <td className="hidden md:table-cell text-ink truncate max-w-[200px]">{sla.ticket?.subject}</td>
                <td className="hidden lg:table-cell"><Badge variant={sla.priority === "Urgent" ? "danger" : sla.priority === "High" ? "warning" : sla.priority === "Medium" ? "info" : "success"}>{PRIORITY_LABELS_FA[sla.priority]}</Badge></td>
                <td className="hidden lg:table-cell"><Badge variant="default" style={{ backgroundColor: sla.dept?.color + "20", color: sla.dept?.color }}>{sla.dept?.name}</Badge></td>
                <td>
                  <div className="flex items-center gap-2">
                    <Badge variant={getSLAStatusBadge(sla.firstResponseStatus)}>{sla.firstResponseStatus === "Within" ? "در چارچوب" : sla.firstResponseStatus === "At Risk" ? "در خطر" : "نقض شده"}</Badge>
                    {sla.firstResponseAt && <span className="text-xs text-ink-3">(پاسخ داده شد)</span>}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Badge variant={getSLAStatusBadge(sla.resolutionStatus)}>{sla.resolutionStatus === "Within" ? "در چارچوب" : sla.resolutionStatus === "At Risk" ? "در خطر" : "نقض شده"}</Badge>
                    {sla.resolvedAt && <span className="text-xs text-ink-3">(حل شده)</span>}
                  </div>
                </td>
                <td className="hidden lg:table-cell">
                  {sla.firstResponseAt ? <span className="text-ok text-sm">✓ پاسخ داده شده</span> : <span className={cn("font-mono text-sm", sla.firstResponseStatus === "Breached" ? "text-danger" : sla.firstResponseStatus === "At Risk" ? "text-warn" : "text-ok")}>{formatRelativeTime(sla.slaFirstResponseAt)}</span>}
                </td>
                <td className="hidden lg:table-cell">
                  {sla.resolvedAt ? <span className="text-ok text-sm">✓ حل شده</span> : <span className={cn("font-mono text-sm", sla.resolutionStatus === "Breached" ? "text-danger" : sla.resolutionStatus === "At Risk" ? "text-warn" : "text-ok")}>{formatRelativeTime(sla.slaResolutionAt)}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {filtered.length === 0 && <div className="p-10 text-center"><Target className="size-12 mx-auto text-ink-3 mb-3" /><h3 className="text-lg font-semibold text-ink mb-1">رکورد SLA یافت نشد</h3><p className="text-ink-3">با تغییر فیلترها، نتیجه بیابید</p></div>}
      </Card>
    </div>
  );
}