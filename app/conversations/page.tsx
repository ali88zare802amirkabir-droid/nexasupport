// NexaSupport Conversations Page

"use client";

import { useState, useMemo } from "react";
import { Search, Inbox, MailOpen, UserCheck, Clock, MessageSquare, Send } from "lucide-react";
import { useApp } from "@/lib/store";
import { conversations } from "@/data/conversations";
import { customers } from "@/data/customers";
import { agents } from "@/data/agents";
import { formatDate, formatRelativeTime, cn, CHANNEL_LABELS_FA } from "@/lib/utils";
import { Button, Select, TextInput, Badge, Avatar, Card, Tabs, TextArea } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";

const TABS = [
  { id: "all", label: "همه", icon: <Inbox className="size-4" /> },
  { id: "unread", label: "خوانده نشده", icon: <MailOpen className="size-4" /> },
  { id: "assigned", label: "اختصاص‌یافته", icon: <UserCheck className="size-4" /> },
  { id: "waiting", label: "در انتظار", icon: <Clock className="size-4" /> },
];

const STATUS_LABELS: Record<string, string> = {
  active: "فعال",
  waiting: "در انتظار",
  closed: "بسته",
};

export default function ConversationsPage() {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  const filtered = useMemo(() => {
    let result = [...conversations];
    if (activeTab === "unread") result = result.filter((c) => c.unreadCount > 0);
    else if (activeTab === "assigned") result = result.filter((c) => c.agentId);
    else if (activeTab === "waiting") result = result.filter((c) => c.status === "waiting");

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.subject.toLowerCase().includes(q) || customers.find((cust) => cust.id === c.customerId)?.name.toLowerCase().includes(q));
    }
    if (channelFilter) result = result.filter((c) => c.channel === channelFilter);
    return result;
  }, [activeTab, search, channelFilter]);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;
  const selectedCustomer = selected ? customers.find((c) => c.id === selected.customerId) : null;
  const selectedAgent = selected?.agentId ? agents.find((a) => a.id === selected.agentId) : null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="مکالمات" subtitle={`${filtered.length} مکالمه`} />

      <Card padding="md">
        <div className="flex flex-wrap items-center gap-3">
          <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} className="flex-1" />
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
            <TextInput placeholder="جستجوی موضوع، مشتری..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9" />
          </div>
          <Select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)}>
            <option value="">همه کانال‌ها</option>
            <option value="Email">ایمیل</option>
            <option value="Chat">چت</option>
            <option value="Phone">تلفن</option>
            <option value="Portal">پرتال</option>
            <option value="Social">شبکه اجتماعی</option>
          </Select>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Conversation List */}
        <Card className="lg:col-span-1" padding="none">
          <div className="p-4 border-b border-edge">
            <h3 className="font-display text-base font-bold text-ink">مکالمات</h3>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="size-12 mx-auto text-ink-3 mb-3" />
                <p className="text-ink-3">مکالمه‌ای یافت نشد</p>
              </div>
            ) : (
              <ul className="divide-y divide-edge/50">
                {filtered.map((conv) => {
                  const customer = customers.find((c) => c.id === conv.customerId);
                  const agent = conv.agentId ? agents.find((a) => a.id === conv.agentId) : null;
                  const isSelected = conv.id === selectedId;
                  return (
                    <li key={conv.id}>
                      <button
                        onClick={() => setSelectedId(conv.id)}
                        className={cn(
                          "block w-full text-right p-4 transition-colors",
                          isSelected ? "bg-accent/10 border-s-2 border-accent" : "hover:bg-surface-2/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar name={customer?.name ?? "—"} color={customer?.avatarColor ?? "#55a1ff"} size="sm" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium text-ink truncate">{customer?.name}</span>
                              {conv.unreadCount > 0 && <Badge variant="primary" size="sm">{conv.unreadCount}</Badge>}
                            </div>
                            <p className="text-sm text-ink-3 truncate mt-0.5">{conv.subject}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-ink-3">
                              <span>{formatRelativeTime(conv.lastMessageAt)}</span>
                              {agent && <span className="flex items-center gap-1"><UserCheck className="size-3" />{agent.name}</span>}
                              <Badge variant="default" size="xs">{CHANNEL_LABELS_FA[conv.channel] ?? conv.channel}</Badge>
                            </div>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Card>

        {/* Conversation Detail */}
        <Card className="lg:col-span-3" padding="none">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center p-6">
              <MessageSquare className="size-16 mx-auto text-ink-3 mb-4" />
              <h3 className="text-lg font-semibold text-ink mb-2">مکالمه‌ای انتخاب نشده</h3>
              <p className="text-ink-3">یک مکالمه از لیست را انتخاب کنید</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="p-5 border-b border-edge">
                <div className="flex items-center gap-3">
                  <Avatar name={selectedCustomer?.name ?? "—"} color={selectedCustomer?.avatarColor ?? "#55a1ff"} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-bold text-ink truncate">{selected.subject}</h3>
                      <Badge variant="default">{CHANNEL_LABELS_FA[selected.channel] ?? selected.channel}</Badge>
                      <Badge variant={selected.status === "waiting" ? "warning" : selected.status === "closed" ? "default" : "success"}>
                        {STATUS_LABELS[selected.status] ?? selected.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-ink-3 mt-1">
                      {selectedCustomer?.name}
                      {selectedAgent ? ` • کارشناس: ${selectedAgent.name}` : " • بدون کارشناس"}
                      {` • ایجاد: ${formatDate(selected.createdAt)}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-5 space-y-3 max-h-[420px] overflow-y-auto">
                <div className="flex items-start gap-3">
                  <Avatar name={selectedCustomer?.name ?? "—"} color={selectedCustomer?.avatarColor ?? "#55a1ff"} size="sm" />
                  <div className="flex-1 min-w-0 p-3 rounded-xl bg-surface border border-edge">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-ink text-sm">{selectedCustomer?.name}</span>
                      <span className="text-xs text-ink-3 shrink-0">{formatRelativeTime(selected.lastMessageAt)}</span>
                    </div>
                    <p className="text-sm text-ink-2 mt-1">{selected.lastMessage}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-edge">
                <TextArea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="پاسخ خود را بنویسید..."
                  rows={3}
                />
                <div className="mt-3 flex justify-end">
                  <Button
                    onClick={() => {
                      if (!reply.trim()) return;
                      showToast({ title: "پاسخ ارسال شد (نمایشی)", variant: "success" });
                      setReply("");
                    }}
                    disabled={!reply.trim()}
                  >
                    <Send className="size-4" /> ارسال پاسخ
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
