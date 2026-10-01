// NexaSupport Command Search (Global Search)

"use client";

import { useState, useEffect, useMemo } from "react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { ICONS } from "./nav";
import { useSearch, useTickets, useCustomers, useApp } from "@/lib/store";
import { Badge, Avatar } from "@/components/ui";
import { tickets as allTickets } from "@/data/tickets";
import { customers } from "@/data/customers";
import { articles } from "@/data/articles";
import { agents } from "@/data/agents";

export function CommandSearch() {
  const { open, toggle } = useSearch();
  const tickets = useTickets();
  const customersList = useCustomers();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          e.preventDefault();
          toggle();
        }
        if (e.key === "Escape") toggle();
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, toggle]);

  if (!open) return null;

  const results = useMemo(() => {
    if (!query.trim()) return { tickets: [], customers: [], articles: [], agents: [] };

    const q = query.toLowerCase();
    return {
      tickets: tickets.filter((t) => t.subject.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)).slice(0, 5),
      customers: customersList.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)).slice(0, 5),
      articles: articles.filter((a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)).slice(0, 5),
      agents: agents.filter((a) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)).slice(0, 5),
    };
  }, [query, tickets, customersList]);

  const totalResults = results.tickets.length + results.customers.length + results.articles.length + results.agents.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 animate-in fade-in duration-fast" onClick={toggle}>
      <div className="w-full max-w-2xl glass rounded-2xl border border-edge shadow-elevated overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-edge">
          <div className="relative">
            <ICONS.Search className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-ink-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی تیکت، مشتری، مقاله، کارشناس... (Escape برای بستن)"
              className="w-full pr-10 pl-4 py-3 rounded-xl bg-surface border border-edge text-ink placeholder:text-ink-3 text-sm focus-ring"
              autoFocus
            />
            <kbd className="absolute left-3 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-mono bg-surface-2 rounded text-ink-3">⌘K</kbd>
          </div>
        </div>

        <div className="max-h-[500px] overflow-y-auto p-3">
          {query.trim() ? (
            totalResults === 0 ? (
              <div className="p-8 text-center">
                <ICONS.Search className="size-12 mx-auto text-ink-3 mb-3" />
                <p className="text-ink-3">نتیجه‌ای برای «{query}» یافت نشد</p>
              </div>
            ) : (
              <>
                {results.tickets.length > 0 && (
                  <div className="mb-4">
                    <h4 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-3">تیکت‌ها ({results.tickets.length})</h4>
                    <ul className="divide-y divide-edge/50">
                      {results.tickets.map((t) => (
                        <li key={t.id} className="p-3 hover:bg-surface-2/50 rounded-xl transition-colors cursor-pointer">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-ink truncate">{t.subject}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={t.priority === "Urgent" ? "danger" : t.priority === "High" ? "warning" : t.priority === "Medium" ? "info" : "success"}>{t.priority}</Badge>
                                <Badge variant={t.status === "Resolved" ? "success" : t.status === "Closed" ? "default" : t.status === "Pending" ? "warning" : "info"}>{t.status}</Badge>
                              </div>
                            </div>
                            <span className="text-xs text-ink-3 shrink-0">{t.id}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.customers.length > 0 && (
                  <div className="mb-4">
                    <h4 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-3">مشتریان ({results.customers.length})</h4>
                    <ul className="divide-y divide-edge/50">
                      {results.customers.map((c) => (
                        <li key={c.id} className="p-3 hover:bg-surface-2/50 rounded-xl transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Avatar name={c.name} color={c.avatarColor} size="sm" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-ink truncate">{c.name}</p>
                              <p className="text-xs text-ink-3 truncate">{c.company} • {c.email}</p>
                            </div>
                            <Badge variant={c.status === "VIP" ? "warning" : c.status === "Active" ? "success" : "default"}>{c.status}</Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.articles.length > 0 && (
                  <div className="mb-4">
                    <h4 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-3">مقالات دانش‌نامه ({results.articles.length})</h4>
                    <ul className="divide-y divide-edge/50">
                      {results.articles.map((a) => (
                        <li key={a.id} className="p-3 hover:bg-surface-2/50 rounded-xl transition-colors cursor-pointer">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-ink truncate">{a.title}</p>
                              <p className="text-xs text-ink-3 truncate">{a.excerpt}</p>
                            </div>
                            <Badge variant={a.status === "Published" ? "success" : a.status === "Draft" ? "default" : "warning"}>{a.status}</Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.agents.length > 0 && (
                  <div>
                    <h4 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-3">کارشناسان ({results.agents.length})</h4>
                    <ul className="divide-y divide-edge/50">
                      {results.agents.map((a) => (
                        <li key={a.id} className="p-3 hover:bg-surface-2/50 rounded-xl transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Avatar name={a.name} color={a.avatarColor} size="sm" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-ink truncate">{a.name}</p>
                              <p className="text-xs text-ink-3 truncate">{a.email} • {a.departmentId}</p>
                            </div>
                            <Badge variant={a.status === "Online" ? "success" : a.status === "Away" ? "warning" : "default"}>{a.status}</Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )
          ) : (
            <div className="p-4">
              <h4 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-3">جستجوی اخیر</h4>
              <p className="px-3 text-sm text-ink-3 text-center py-8">تایپ کنید تا جستجو آغاز شود...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}