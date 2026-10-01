// NexaSupport Customers List Page

"use client";

import { useState, useMemo } from "react";
import { Search, Filter, ChevronDown, ChevronUp, ArrowUpDown, UserPlus } from "lucide-react";
import Link from "next/link";
import { useCustomers, useApp } from "@/lib/store";
import { customers as initialCustomers } from "@/data/customers";
import { formatDate, getCustomerStatusBadge, cn, CUSTOMER_STATUS_LABELS_FA } from "@/lib/utils";
import { Button, Select, TextInput, Badge, Avatar, Card, Table } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";

const STATUSES = ["Active", "Inactive", "VIP", "Blocked"] as const;

export default function CustomersPage() {
  const customers = useCustomers();
  const { showToast } = useApp();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "company" | "openTickets" | "resolvedTickets" | "lastContact" | "satisfaction">("lastContact");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let result = [...customers];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.company.toLowerCase().includes(q));
    }
    if (statusFilter) result = result.filter((c) => c.status === statusFilter);

    result.sort((a, b) => {
      let aVal: string | number, bVal: string | number;
      if (sortBy === "name") { aVal = a.name; bVal = b.name; }
      else if (sortBy === "company") { aVal = a.company; bVal = b.company; }
      else if (sortBy === "openTickets") { aVal = a.openTickets; bVal = b.openTickets; }
      else if (sortBy === "resolvedTickets") { aVal = a.resolvedTickets; bVal = b.resolvedTickets; }
      else if (sortBy === "lastContact") { aVal = new Date(a.lastContactAt).getTime(); bVal = new Date(b.lastContactAt).getTime(); }
      else { aVal = a.satisfactionScore; bVal = b.satisfactionScore; }
      if (typeof aVal === "string") return sortDir === "asc" ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
      const an = Number(aVal); const bn = Number(bVal); return sortDir === "asc" ? (an > bn ? 1 : -1) : (an < bn ? 1 : -1);
    });
    return result;
  }, [search, statusFilter, sortBy, sortDir, customers]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(field); setSortDir("desc"); }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="مشتریان"
        subtitle={`${filtered.length} مشتری از ${customers.length}`}
        actions={<Button><UserPlus className="size-4" /> مشتری جدید</Button>}
      />

      <Card padding="md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
            <TextInput placeholder="جستجوی نام، ایمیل، شرکت..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9" />
          </div>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">همه وضعیت‌ها</option>
            {STATUSES.map((s) => <option key={s} value={s}>{CUSTOMER_STATUS_LABELS_FA[s]}</option>)}
          </Select>
          <div className="flex items-center gap-1 bg-surface rounded-xl border border-edge p-1">
            {[
              { key: "name", label: "نام" },
              { key: "company", label: "شرکت" },
              { key: "openTickets", label: "تیکت‌های باز" },
              { key: "resolvedTickets", label: "حل شده" },
              { key: "lastContact", label: "آخرین تماس" },
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

      <Card padding="none">
        <Table>
          <thead>
            <tr>
              <th onClick={() => handleSort("name")} className="cursor-pointer">مشتری <ArrowUpDown className="size-3.5 inline ml-1 opacity-50" /></th>
              <th className="hidden md:table-cell">ایمیل</th>
              <th className="hidden lg:table-cell cursor-pointer" onClick={() => handleSort("company")}>شرکت <ArrowUpDown className="size-3.5 inline ml-1 opacity-50" /></th>
              <th className="hidden lg:table-cell cursor-pointer" onClick={() => handleSort("openTickets")}>باز <ArrowUpDown className="size-3.5 inline ml-1 opacity-50" /></th>
              <th className="hidden lg:table-cell cursor-pointer" onClick={() => handleSort("resolvedTickets")}>حل شده <ArrowUpDown className="size-3.5 inline ml-1 opacity-50" /></th>
              <th className="hidden md:table-cell cursor-pointer" onClick={() => handleSort("lastContact")}>آخرین تماس <ArrowUpDown className="size-3.5 inline ml-1 opacity-50" /></th>
              <th className="hidden lg:table-cell cursor-pointer" onClick={() => handleSort("satisfaction")}>رضایت <ArrowUpDown className="size-3.5 inline ml-1 opacity-50" /></th>
              <th>وضعیت</th>
              <th className="w-24">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr key={customer.id} className="hover:bg-surface-2/40">
                <td>
                  <Link href={`/customers/${customer.id}`} className="flex items-center gap-2">
                    <Avatar name={customer.name} color={customer.avatarColor} size="sm" />
                    <span className="font-medium text-ink hover:text-accent">{customer.name}</span>
                  </Link>
                </td>
                <td className="hidden md:table-cell text-ink-2">{customer.email}</td>
                <td className="hidden lg:table-cell text-ink-2 truncate max-w-[150px]">{customer.company}</td>
                <td className="hidden lg:table-cell">
                  <Badge variant="info">{customer.openTickets}</Badge>
                </td>
                <td className="hidden lg:table-cell text-ink-2">{customer.resolvedTickets}</td>
                <td className="hidden md:table-cell text-sm text-ink-2">{formatDate(customer.lastContactAt)}</td>
                <td className="hidden lg:table-cell">
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-ink">{customer.satisfactionScore}%</span>
                    <Star className="size-3.5 text-warn" />
                  </div>
                </td>
                <td>
                  <Badge variant={getCustomerStatusBadge(customer.status)}>{CUSTOMER_STATUS_LABELS_FA[customer.status]}</Badge>
                </td>
                <td>
                  <Link href={`/customers/${customer.id}`} className="text-accent hover:underline text-sm">مشاهده</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {filtered.length === 0 && (
          <div className="p-10 text-center">
            <Users className="size-12 mx-auto text-ink-3 mb-3" />
            <h3 className="text-lg font-semibold text-ink mb-1">مشتری یافت نشد</h3>
            <p className="text-ink-3">با تغییر فیلترها یا جستجو، نتیجه بیابید</p>
          </div>
        )}
      </Card>
    </div>
  );
}

import { Users, Star } from "lucide-react";