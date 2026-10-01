// NexaSupport Agents Page

"use client";

import { useState, useMemo } from "react";
import { Search, Filter, UserPlus, TrendingUp, TrendingDown, ChevronUp, ChevronDown, ArrowUpDown, Star, Clock, CheckCircle2, Users, Activity, Mail, Phone } from "lucide-react";
import { useAgents, useApp } from "@/lib/store";
import { agents } from "@/data/agents";
import { departments } from "@/data/departments";
import { getAgentStatusBadge, AGENT_STATUS_LABELS_FA, cn } from "@/lib/utils";
import { Button, Select, TextInput, Badge, Avatar, Card, Table } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";

const STATUSES = ["Online", "Away", "Offline"] as const;

export default function AgentsPage() {
  const agentsList = useAgents();
  const { showToast } = useApp();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "assigned" | "resolved" | "avgResponse" | "satisfaction">("resolved");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let result = [...agentsList];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.skills.some((s) => s.toLowerCase().includes(q)));
    }
    if (statusFilter) result = result.filter((a) => a.status === statusFilter);
    if (deptFilter) result = result.filter((a) => a.departmentId === deptFilter);

    result.sort((a, b) => {
      let aVal: string | number, bVal: string | number;
      if (sortBy === "name") { aVal = a.name; bVal = b.name; }
      else if (sortBy === "assigned") { aVal = a.assignedTickets; bVal = b.assignedTickets; }
      else if (sortBy === "resolved") { aVal = a.resolvedTickets; bVal = b.resolvedTickets; }
      else if (sortBy === "avgResponse") { aVal = a.avgResponseMinutes; bVal = b.avgResponseMinutes; }
      else { aVal = a.satisfactionScore; bVal = b.satisfactionScore; }
      if (typeof aVal === "string") return sortDir === "asc" ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
      const an = Number(aVal);
      const bn = Number(bVal);
      return sortDir === "asc" ? (an > bn ? 1 : -1) : (an < bn ? 1 : -1);
    });
    return result;
  }, [search, statusFilter, deptFilter, sortBy, sortDir, agentsList]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(field); setSortDir("desc"); }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="کارشناسان"
        subtitle={`${filtered.length} کارشناس` }
        actions={<Button><UserPlus className="size-4" /> کارشناس جدید</Button>}
      />

      <Card padding="md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
            <TextInput placeholder="جستجوی نام، ایمیل، مهارت..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9" />
          </div>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">همه وضعیت‌ها</option>
            {STATUSES.map((s) => <option key={s} value={s}>{AGENT_STATUS_LABELS_FA[s]}</option>)}
          </Select>
          <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="">همه دپارتمان‌ها</option>
            {departments.map((d) => <option key={d.id} value={d.id} style={{ color: d.color }}>{d.name}</option>)}
          </Select>
          <div className="flex items-center gap-1 bg-surface rounded-xl border border-edge p-1">
            {[
              { key: "name", label: "نام" },
              { key: "assigned", label: "تخصیص‌یافته" },
              { key: "resolved", label: "حل شده" },
              { key: "avgResponse", label: "میانگین پاسخ" },
              { key: "satisfaction", label: "رضایت" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => handleSort(opt.key as typeof sortBy)}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", sortBy === opt.key ? "bg-accent/10 text-accent" : "text-ink-3 hover:bg-surface-2 hover:text-ink")}
              >
                {opt.label} {sortBy === opt.key ? (sortDir === "asc" ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />) : <ArrowUpDown className="size-3.5 opacity-50" />}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Agent Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((agent) => {
          const dept = departments.find((d) => d.id === agent.departmentId);
          return (
            <Card key={agent.id} hover className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={agent.name} color={agent.avatarColor} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg font-bold text-ink truncate">{agent.name}</h3>
                  <p className="text-sm text-ink-3 truncate">{agent.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={getAgentStatusBadge(agent.status)} size="sm">{AGENT_STATUS_LABELS_FA[agent.status]}</Badge>
                    <Badge variant="default" size="sm" style={{ backgroundColor: dept?.color + "20", color: dept?.color }}>{dept?.name}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-xl bg-surface border border-edge">
                <div>
                  <p className="text-xs text-ink-3">تخصیص‌یافته</p>
                  <p className="font-display text-xl font-bold text-ink">{agent.assignedTickets}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-3">حل شده</p>
                  <p className="font-display text-xl font-bold text-ok">{agent.resolvedTickets}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-3">میانگین پاسخ</p>
                  <p className="font-display text-xl font-bold text-accent">{agent.avgResponseMinutes}د</p>
                </div>
                <div>
                  <p className="text-xs text-ink-3">رضایت</p>
                  <p className="font-display text-xl font-bold text-warn">{agent.satisfactionScore}%</p>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-edge">
                <h4 className="text-xs font-semibold text-ink-3 mb-2">مهارت‌ها</h4>
                <div className="flex flex-wrap gap-1">
                  {agent.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="default" size="sm">{skill}</Badge>
                  ))}
                  {agent.skills.length > 4 && <Badge variant="default" size="sm">+{agent.skills.length - 4} بیشتر</Badge>}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card>
          <div className="p-10 text-center">
            <Users className="size-12 mx-auto text-ink-3 mb-3" />
            <h3 className="text-lg font-semibold text-ink mb-1">کارشناسی یافت نشد</h3>
            <p className="text-ink-3">با تغییر فیلترها یا جستجو، نتیجه بیابید</p>
          </div>
        </Card>
      )}
    </div>
  );
}