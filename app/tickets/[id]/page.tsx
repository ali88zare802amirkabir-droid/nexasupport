// NexaSupport Ticket Detail Page

"use client";

import { use, useState } from "react";
import { ArrowLeft, Send, FileText, Tag, UserPlus, AlertTriangle, MoreVertical, CheckCircle2, Clock, AlertCircle, X, Edit2, Trash2, MessageSquare, Paperclip } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useApp, useAgents, useCustomers } from "@/lib/store";
import { tickets as initialTickets } from "@/data/tickets";
import { ticketMessages } from "@/data/ticketMessages";
import { departments } from "@/data/departments";
import { formatDateTime, formatRelativeTime, getPriorityBadge, getStatusBadge, cn, PRIORITY_LABELS_FA, STATUS_LABELS_FA } from "@/lib/utils";
import { Button, TextArea, Badge, Avatar, Card, Dropdown, Modal } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const ticket = initialTickets.find((t) => t.id === id);
  if (!ticket) notFound();

  const messages = ticketMessages.filter((m) => m.ticketId === ticket.id).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const { agents, customers, updateTicket, addTicketMessage, addInternalNote, showToast } = useApp();
  const customer = customers.find((c) => c.id === ticket.customerId);
  const agent = ticket.agentId ? agents.find((a) => a.id === ticket.agentId) : null;
  const dept = departments.find((d) => d.id === ticket.departmentId);

  const [replyContent, setReplyContent] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleReply = () => {
    if (!replyContent.trim()) return;
    addTicketMessage({
      id: `msg-${Date.now()}`,
      ticketId: ticket.id,
      sender: "agent",
      senderId: "agt-01",
      content: replyContent,
      isInternal: false,
      attachments: [],
      createdAt: new Date().toISOString(),
    });
    showToast({ title: "پاسخ ارسال شد", variant: "success" });
    setReplyContent("");
  };

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    addInternalNote(ticket.id, noteContent, "agt-01");
    showToast({ title: "یادداشت داخلی اضافه شد", variant: "info" });
    setNoteContent("");
    setShowNoteModal(false);
  };

  const handleStatusChange = (status: typeof ticket.status) => {
    updateTicket(ticket.id, { status });
    showToast({ title: `وضعیت به ${STATUS_LABELS_FA[status]} تغییر کرد`, variant: "success" });
  };

  const handlePriorityChange = (priority: typeof ticket.priority) => {
    updateTicket(ticket.id, { priority });
    showToast({ title: `اولویت به ${PRIORITY_LABELS_FA[priority]} تغییر کرد`, variant: "success" });
  };

  const handleAssignAgent = (agentId: string) => {
    updateTicket(ticket.id, { agentId });
    const ag = agents.find((a) => a.id === agentId);
    showToast({ title: `تیکت به ${ag?.name} ارجاع داده شد`, variant: "success" });
  };

  return (
    <div className="flex flex-col gap-6">
      <Link href="/tickets" className="text-sm text-accent hover:underline flex items-center gap-1">
        <ArrowLeft className="size-4" /> بازگشت به تیکت‌ها
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={getStatusBadge(ticket.status)}>{STATUS_LABELS_FA[ticket.status]}</Badge>
            <Badge variant={getPriorityBadge(ticket.priority)}>{PRIORITY_LABELS_FA[ticket.priority]}</Badge>
            <Badge variant="default" style={{ backgroundColor: dept?.color + "20", color: dept?.color }}>{dept?.name}</Badge>
            <Badge variant="default">{ticket.channel}</Badge>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-ink mb-2">{ticket.subject}</h1>
          <p className="text-ink-3">{ticket.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Dropdown
            trigger={<Button variant="outline" size="sm"><MoreVertical className="size-4" /></Button>}
            items={[
              { label: "تغییر وضعیت", onClick: () => {}, icon: <AlertTriangle className="size-4" /> },
              { label: "تغییر اولویت", onClick: () => {}, icon: <Flag className="size-4" /> },
              { label: "ارجاع به کارشناس", onClick: () => {}, icon: <UserPlus className="size-4" /> },
              { label: "اضافه کردن برچسب", onClick: () => {}, icon: <Tag className="size-4" /> },
              { label: "حذف تیکت", onClick: () => {}, icon: <Trash2 className="size-4" />, danger: true },
            ]}
          />
        </div>
      </div>

      {/* Info Bar */}
      <Card padding="md">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-ink-3">مشتری</p>
            <div className="flex items-center gap-2 mt-1">
              <Avatar name={customer?.name ?? "—"} color={customer?.avatarColor ?? "#55a1ff"} size="sm" />
              <span className="font-medium text-ink">{customer?.name}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-ink-3">کارشناس</p>
            <div className="flex items-center gap-2 mt-1">
              {agent ? (
                <>
                  <Avatar name={agent.name} color={agent.avatarColor} size="sm" />
                  <span className="font-medium text-ink">{agent.name}</span>
                </>
              ) : (
                <Badge variant="default" onClick={() => {}} className="cursor-pointer">اختصاص دادن</Badge>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs text-ink-3">SLA پاسخ اول</p>
            <p className="font-mono text-ink mt-1">{ticket.slaFirstResponseAt ? formatRelativeTime(ticket.slaFirstResponseAt) : "—"}</p>
          </div>
          <div>
            <p className="text-xs text-ink-3">SLA حل</p>
            <p className="font-mono text-ink mt-1">{ticket.slaResolutionAt ? formatRelativeTime(ticket.slaResolutionAt) : "—"}</p>
          </div>
        </div>
      </Card>

      {/* Conversation Timeline */}
      <Card padding="none">
        <div className="p-5 border-b border-edge">
          <h2 className="font-display text-base font-bold text-ink">مکالمه</h2>
        </div>
        <div className="divide-y divide-edge">
          {messages.map((msg) => {
            const isCustomer = msg.sender === "customer";
            const isInternal = msg.isInternal;
            const sender = isCustomer ? customer : agents.find((a) => a.id === msg.senderId);
            return (
              <div key={msg.id} className={cn("p-5 flex gap-4", isInternal && "bg-warn-soft/30")}>
                <Avatar name={sender?.name ?? "سیستم"} color={sender?.avatarColor ?? "#94a3b8"} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-ink">{sender?.name ?? "سیستم"}</span>
                      {isInternal && <Badge variant="warning" size="sm">داخلی</Badge>}
                      {msg.sender === "agent" && !isInternal && <Badge variant="primary" size="sm">پاسخ کارشناس</Badge>}
                    </div>
                    <span className="text-xs text-ink-3 shrink-0">{formatDateTime(msg.createdAt)}</span>
                  </div>
                  <p className={cn("mt-1 text-sm text-ink-2 whitespace-pre-wrap", isInternal && "text-warn")}>{msg.content}</p>
                  {msg.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.attachments.map((att) => (
                        <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface border border-edge text-xs text-ink-2 hover:bg-surface-2">
                          <Paperclip className="size-3.5" />
                          {att.name}
                        </a>
                      ))}
                    </div>
                  )}
                  {!isInternal && msg.sender === "agent" && (
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => { setEditingMessageId(msg.id); setEditContent(msg.content); }} className="text-xs text-ink-3 hover:text-accent flex items-center gap-1"><Edit2 className="size-3.5" /> ویرایش</button>
                      <button onClick={() => { if (confirm("حذف پیام؟")) showToast({ title: "پیام حذف شد (نمایشی)", variant: "info" }); }} className="text-xs text-ink-3 hover:text-danger flex items-center gap-1"><Trash2 className="size-3.5" /> حذف</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {messages.length === 0 && (
          <div className="p-10 text-center">
            <MessageSquare className="size-12 mx-auto text-ink-3 mb-3" />
            <p className="text-ink-3">هنوز پیامی وجود ندارد</p>
          </div>
        )}
      </Card>

      {/* Reply & Internal Note */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-display text-base font-bold text-ink mb-4">پاسخ به مشتری</h3>
          <TextArea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="پاسخ خود را بنویسید... (Markdown پشتیبانی می‌شود)"
            rows={6}
          />
          <div className="mt-3 flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setShowNoteModal(true)}><FileText className="size-4" /> یادداشت داخلی</Button>
            <Button onClick={handleReply} disabled={!replyContent.trim()}><Send className="size-4" /> ارسال پاسخ</Button>
          </div>
        </Card>

        <Card>
          <h3 className="font-display text-base font-bold text-ink mb-4">عملیات سریع</h3>
          <div className="space-y-3">
            <div>
              <label className="label">تغییر وضعیت</label>
              <div className="flex flex-wrap gap-2">
                {["New", "Open", "Pending", "Resolved", "Closed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s as typeof ticket.status)}
                    className={cn("px-3 py-1.5 rounded-lg text-sm font-medium transition-colors", ticket.status === s ? "bg-accent/10 text-accent border border-accent" : "bg-surface-2 text-ink-2 hover:bg-surface-3")}
                  >
                    {STATUS_LABELS_FA[s]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">تغییر اولویت</label>
              <div className="flex flex-wrap gap-2">
                {["Low", "Medium", "High", "Urgent"].map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePriorityChange(p as typeof ticket.priority)}
                    className={cn("px-3 py-1.5 rounded-lg text-sm font-medium transition-colors", ticket.priority === p ? "bg-accent/10 text-accent border border-accent" : "bg-surface-2 text-ink-2 hover:bg-surface-3")}
                  >
                    {PRIORITY_LABELS_FA[p]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">ارجاع به کارشناس</label>
              <div className="flex flex-wrap gap-2">
                {agents.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleAssignAgent(a.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-2 hover:bg-surface-3 transition-colors"
                  >
                    <Avatar name={a.name} color={a.avatarColor} size="xs" />
                    <span className="text-sm font-medium text-ink">{a.name}</span>
                    <Badge variant={a.status === "Online" ? "success" : a.status === "Away" ? "warning" : "default"} size="sm">{a.status}</Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Internal Note Modal */}
      <Modal isOpen={showNoteModal} onClose={() => setShowNoteModal(false)} title="یادداشت داخلی" size="md">
        <TextArea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="یادداشت داخلی (فقط برای تیم پشتیبانی قابل مشاهده است)..."
          rows={6}
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowNoteModal(false)}>انصراف</Button>
          <Button onClick={handleAddNote} disabled={!noteContent.trim()}>افزودن یادداشت</Button>
        </div>
      </Modal>

      {/* Edit Message Modal */}
      {editingMessageId && (
        <Modal isOpen={!!editingMessageId} onClose={() => setEditingMessageId(null)} title="ویرایش پیام" size="md">
          <TextArea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={6}
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingMessageId(null)}>انصراف</Button>
            <Button onClick={() => { showToast({ title: "پیام ویرایش شد (نمایشی)", variant: "success" }); setEditingMessageId(null); }}>ذخیره</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

import { Flag } from "lucide-react";