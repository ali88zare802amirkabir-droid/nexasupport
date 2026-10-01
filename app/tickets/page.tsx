// NexaSupport Tickets List Page

"use client";

import { useState, useMemo } from "react";
import { Search, Filter, TicketPlus, TicketCheck, ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useTickets, useApp, useAgents, useCustomers } from "@/lib/store";
import { tickets as initialTickets } from "@/data/tickets";
import { departments } from "@/data/departments";
import { formatDate, getPriorityBadge, getStatusBadge, cn, PRIORITY_LABELS_FA, STATUS_LABELS_FA } from "@/lib/utils";
import { Button, Select, TextInput, Badge, Avatar, Card, Table } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";

const STATUSES = ["New", "Open", "Pending", "Resolved", "Closed"] as const;
const PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;

export default function TicketsPage() {
  const tickets = useTickets();
  const agents = useAgents();
  const customers = useCustomers();
  const { showToast } = useApp();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [agentFilter, setAgentFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [sortBy, setSortBy] = useState<"created" | "updated" | "priority" | "status">("updated");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [density, setDensity] = useState<"compact" | "comfortable">("comfortable");

  const filtered = useMemo(() => {
    let result = [...tickets];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.subject.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || customers.find((c) => c.id === t.customerId)?.name.toLowerCase().includes(q));
    }
    if (statusFilter) result = result.filter((t) => t.status === statusFilter);
    if (priorityFilter) result = result.filter((t) => t.priority === priorityFilter);
    if (agentFilter) result = result.filter((t) => t.agentId === agentFilter);
    if (deptFilter) result = result.filter((t) => t.departmentId === deptFilter);

    result.sort((a, b) => {
      let aVal: string | number, bVal: string | number;
      if (sortBy === "created") { aVal = new Date(a.createdAt).getTime(); bVal = new Date(b.createdAt).getTime(); }
      else if (sortBy === "updated") { aVal = new Date(a.updatedAt).getTime(); bVal = new Date(b.updatedAt).getTime(); }
      else if (sortBy === "priority") { const p = { Urgent: 4, High: 3, Medium: 2, Low: 1 }; aVal = p[a.priority]; bVal = p[b.priority]; }
      else { const s = { New: 5, Open: 4, Pending: 3, Resolved: 2, Closed: 1 }; aVal = s[a.status]; bVal = s[b.status]; }
      const an = Number(aVal); const bn = Number(bVal); return sortDir === "asc" ? (an > bn ? 1 : -1) : (an < bn ? 1 : -1);
    });
    return result;
  }, [search, statusFilter, priorityFilter, agentFilter, deptFilter, sortBy, sortDir, tickets, customers]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(field); setSortDir("desc"); }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="تیکت‌ها"
        subtitle={`${filtered.length} تیکت از ${tickets.length}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => showToast({ title: "تیکت جدید باز شد (نمایشی)", variant: "info" })}><TicketPlus className="size-4" /> جدید</Button>
          </div>
        }
      />

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
            <TextInput placeholder="جستجوی تیکت، مشتری، موضوع..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9" />
          </div>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">همه وضعیت‌ها</option>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS_FA[s]}</option>)}
          </Select>
          <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">همه اولویت‌ها</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABELS_FA[p]}</option>)}
          </Select>
          <Select value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)}>
            <option value="">همه کارشناسان</option>
            {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </Select>
          <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="">همه دپارتمان‌ها</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
          <div className="flex items-center gap-1 bg-surface rounded-xl border border-edge p-1">
            {[
              { key: "created", label: "تاریخ ایجاد" },
              { key: "updated", label: "به‌روزرسانی" },
              { key: "priority", label: "اولویت" },
              { key: "status", label: "وضعیت" },
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
          <Button variant="outline" size="sm" onClick={() => setDensity(density === "compact" ? "comfortable" : "compact")}><Filter className="size-4" /> {density === "compact" ? "فشرده" : "راحت"}</Button>
        </div>
      </Card>

      {/* Tickets Table */}
      <Card padding="none">
        <Table>
          <thead>
            <tr>
              <th className="w-8"></th>
              <th onClick={() => handleSort("updated")} className="cursor-pointer">تیکت <ArrowUpDown className="size-3.5 inline ml-1 opacity-50" /></th>
              <th>موضوع</th>
              <th className="hidden md:table-cell">مشتری</th>
              <th className="hidden lg:table-cell">اولویت</th>
              <th>وضعیت</th>
              <th className="hidden lg:table-cell">کارشناس</th>
              <th className="hidden lg:table-cell">دپارتمان</th>
              <th>ایجاد شده</th>
              <th>به‌روزرسانی</th>
              <th className="w-24">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ticket) => {
              const customer = customers.find((c) => c.id === ticket.customerId);
              const agent = ticket.agentId ? agents.find((a) => a.id === ticket.agentId) : null;
              const dept = departments.find((d) => d.id === ticket.departmentId);
              return (
                <tr key={ticket.id} className="hover:bg-surface-2/40">
                  <td>
                    <input type="checkbox" className="size-4 rounded border-edge bg-surface text-accent focus:ring-accent" />
                  </td>
                  <td className="font-mono text-xs text-ink-2">{ticket.id}</td>
                  <td>
                    <Link href={`/tickets/${ticket.id}`} className="font-medium text-ink hover:text-accent truncate block max-w-[300px]">{ticket.subject}</Link>
                    <p className="text-[11px] text-ink-3 truncate max-w-[300px]">{ticket.description}</p>
                  </td>
                  <td className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Avatar name={customer?.name ?? "نامشخص"} color={customer?.avatarColor ?? "#55a1ff"} size="xs" />
                      <span className="text-sm text-ink truncate max-w-[150px]">{customer?.name}</span>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell">
                    <Badge variant={getPriorityBadge(ticket.priority)}>{PRIORITY_LABELS_FA[ticket.priority]}</Badge>
                  </td>
                  <td>
                    <Badge variant={getStatusBadge(ticket.status)}>{STATUS_LABELS_FA[ticket.status]}</Badge>
                  </td>
                  <td className="hidden lg:table-cell">
                    {agent ? (
                      <div className="flex items-center gap-1">
                        <Avatar name={agent.name} color={agent.avatarColor} size="xs" />
                        <span className="text-sm text-ink">{agent.name}</span>
                      </div>
                    ) : (
                      <Badge variant="default">—</Badge>
                    )}
                  </td>
                  <td className="hidden lg:table-cell">
                    <Badge variant="default" style={{ backgroundColor: dept?.color + "20", color: dept?.color }}>{dept?.name}</Badge>
                  </td>
                  <td className="text-sm text-ink-2">{formatDate(ticket.createdAt)}</td>
                  <td className="text-sm text-ink-2">{formatDate(ticket.updatedAt)}</td>
                  <td>
                    <Link href={`/tickets/${ticket.id}`} className="text-accent hover:underline text-sm">مشاهده</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {filtered.length === 0 && (
          <div className="p-10 text-center">
            <TicketCheck className="size-12 mx-auto text-ink-3 mb-3" />
            <h3 className="text-lg font-semibold text-ink mb-1">تیکتی یافت نشد</h3>
            <p className="text-ink-3">با تغییر فیلترها یا جستجو، نتیجه بیابید</p>
          </div>
        )}
      </Card>
    </div>
  );
}