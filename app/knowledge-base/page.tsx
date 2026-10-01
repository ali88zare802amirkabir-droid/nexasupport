// NexaSupport Knowledge Base Page

"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Plus, FileText, Edit2, Trash2, Eye, ExternalLink, ChevronDown, ChevronUp, ArrowUpDown, BookOpen, Tag } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { articles } from "@/data/articles";
import { agents } from "@/data/agents";
import { formatDate, getArticleStatusBadge, cn, ARTICLE_STATUS_LABELS_FA } from "@/lib/utils";
import { Button, Select, TextInput, Badge, Avatar, Card, Table, Modal, TextArea, Dropdown } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";

const CATEGORIES = ["همه", "شروع کار", "صورتحساب و پرداخت", "حساب کاربری", "فنی و تکنیکی", "سفارشات", "عیب‌یابی", "امنیت", "API و توسعه"];

export default function KnowledgeBasePage() {
  const { showToast, addArticle, updateArticle } = useApp();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("همه");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "category" | "views" | "updated" | "status">("updated");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<typeof articles[0] | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("شروع کار");
  const [formContent, setFormContent] = useState("");
  const [formStatus, setFormStatus] = useState<"Published" | "Draft" | "Archived">("Draft");

  const filtered = useMemo(() => {
    let result = [...articles];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.content.toLowerCase().includes(q));
    }
    if (categoryFilter !== "همه") result = result.filter((a) => a.category === categoryFilter);
    if (statusFilter) result = result.filter((a) => a.status === statusFilter);

    result.sort((a, b) => {
      let aVal: string | number, bVal: string | number;
      if (sortBy === "title") { aVal = a.title; bVal = b.title; }
      else if (sortBy === "category") { aVal = a.category; bVal = b.category; }
      else if (sortBy === "views") { aVal = a.views; bVal = b.views; }
      else if (sortBy === "updated") { aVal = new Date(a.updatedAt).getTime(); bVal = new Date(b.updatedAt).getTime(); }
      else { const s = { Published: 3, Draft: 2, Archived: 1 }; aVal = s[a.status]; bVal = s[b.status]; }
      if (typeof aVal === "string") return sortDir === "asc" ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
      const an = Number(aVal); const bn = Number(bVal); return sortDir === "asc" ? (an > bn ? 1 : -1) : (an < bn ? 1 : -1);
    });
    return result;
  }, [search, categoryFilter, statusFilter, sortBy, sortDir]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(field); setSortDir("desc"); }
  };

  const openCreateModal = () => {
    setFormTitle("");
    setFormCategory("شروع کار");
    setFormContent("");
    setFormStatus("Draft");
    setEditingArticle(null);
    setShowCreateModal(true);
  };

  const openEditModal = (article: typeof articles[0]) => {
    setFormTitle(article.title);
    setFormCategory(article.category);
    setFormContent(article.content);
    setFormStatus(article.status);
    setEditingArticle(article);
    setShowCreateModal(true);
  };

  const handleSubmit = () => {
    if (!formTitle.trim() || !formContent.trim()) return;
    if (editingArticle) {
      updateArticle(editingArticle.id, { title: formTitle, category: formCategory, content: formContent, status: formStatus, updatedAt: new Date().toISOString() });
      showToast({ title: "مقاله به‌روزرسانی شد", variant: "success" });
    } else {
      const author = agents[0];
      addArticle({
        id: `art-${Date.now()}`,
        title: formTitle,
        slug: formTitle.toLowerCase().replace(/[\s\u200c]+/g, "-").replace(/[^\w\-]/g, ""),
        category: formCategory,
        content: formContent,
        excerpt: formContent.slice(0, 150) + "...",
        status: formStatus,
        views: 0,
        helpful: 0,
        notHelpful: 0,
        authorId: author.id,
        tags: [formCategory],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      showToast({ title: "مقاله جدید ایجاد شد", variant: "success" });
    }
    setShowCreateModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="دانش‌نامه"
        subtitle={`${filtered.length} مقاله` }
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={openCreateModal}><Plus className="size-4" /> مقاله جدید</Button>
          </div>
        }
      />

      <Card padding="md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
            <TextInput placeholder="جستجوی عنوان، محتوا، برچسب..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9" />
          </div>
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">همه وضعیت‌ها</option>
            <option value="Published">منتشر شده</option>
            <option value="Draft">پیش‌نویس</option>
            <option value="Archived">بایگانی</option>
          </Select>
          <div className="flex items-center gap-1 bg-surface rounded-xl border border-edge p-1">
            {[
              { key: "title", label: "عنوان" },
              { key: "category", label: "دسته" },
              { key: "views", label: "بازدید" },
              { key: "updated", label: "به‌روزرسانی" },
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
        </div>
      </Card>

      <Card padding="none">
        <Table>
          <thead>
            <tr>
              <th onClick={() => handleSort("title")} className="cursor-pointer">مقاله <ArrowUpDown className="size-3.5 inline ml-1 opacity-50" /></th>
              <th className="hidden md:table-cell cursor-pointer" onClick={() => handleSort("category")}>دسته <ArrowUpDown className="size-3.5 inline ml-1 opacity-50" /></th>
              <th className="hidden lg:table-cell cursor-pointer" onClick={() => handleSort("views")}>بازدید <ArrowUpDown className="size-3.5 inline ml-1 opacity-50" /></th>
              <th className="hidden lg:table-cell cursor-pointer" onClick={() => handleSort("updated")}>به‌روزرسانی <ArrowUpDown className="size-3.5 inline ml-1 opacity-50" /></th>
              <th className="hidden lg:table-cell cursor-pointer" onClick={() => handleSort("status")}>وضعیت <ArrowUpDown className="size-3.5 inline ml-1 opacity-50" /></th>
              <th className="w-32">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((article) => (
              <tr key={article.id} className="hover:bg-surface-2/40">
                <td>
                  <div>
                    <Link href={`/knowledge-base/${article.slug}`} className="font-medium text-ink hover:text-accent truncate block max-w-[300px]">{article.title}</Link>
                    <p className="text-[11px] text-ink-3 truncate max-w-[300px]">{article.excerpt}</p>
                  </div>
                </td>
                <td className="hidden md:table-cell"><Badge variant="default">{article.category}</Badge></td>
                <td className="hidden lg:table-cell">
                  <div className="flex items-center gap-1">
                    <Eye className="size-3.5 text-ink-3" />
                    <span className="text-sm text-ink-2">{article.views.toLocaleString()}</span>
                  </div>
                </td>
                <td className="hidden lg:table-cell text-sm text-ink-2">{formatDate(article.updatedAt)}</td>
                <td className="hidden lg:table-cell"><Badge variant={getArticleStatusBadge(article.status)}>{ARTICLE_STATUS_LABELS_FA[article.status]}</Badge></td>
                <td>
                  <Dropdown
                    trigger={<Button variant="ghost" size="sm"><MoreVertical className="size-4" /></Button>}
                    items={[
                      { label: "مشاهده", onClick: () => {}, icon: <Eye className="size-4" /> },
                      { label: "ویرایش", onClick: () => openEditModal(article), icon: <Edit2 className="size-4" /> },
                      { label: "مشاهده در سایت", onClick: () => {}, icon: <ExternalLink className="size-4" /> },
                      { label: "حذف", onClick: () => { if (confirm("حذف مقاله؟")) showToast({ title: "مقاله حذف شد (نمایشی)", variant: "info" }); }, icon: <Trash2 className="size-4" />, danger: true },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {filtered.length === 0 && <div className="p-10 text-center"><BookOpen className="size-12 mx-auto text-ink-3 mb-3" /><h3 className="text-lg font-semibold text-ink mb-1">مقاله‌ای یافت نشد</h3><p className="text-ink-3">با تغییر فیلترها یا جستجو، نتیجه بیابید</p></div>}
      </Card>

      {/* Create/Edit Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title={editingArticle ? "ویرایش مقاله" : "مقاله جدید"} size="lg">
        <div className="space-y-4">
          <TextInput label="عنوان" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="عنوان مقاله" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="دسته‌بندی" value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
              {CATEGORIES.filter((c) => c !== "همه").map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select label="وضعیت" value={formStatus} onChange={(e) => setFormStatus(e.target.value as typeof formStatus)}>
              <option value="Draft">پیش‌نویس</option>
              <option value="Published">منتشر شده</option>
              <option value="Archived">بایگانی</option>
            </Select>
          </div>
          <TextArea label="محتوا" value={formContent} onChange={(e) => setFormContent(e.target.value)} placeholder="محتوا (Markdown پشتیبانی می‌شود)" rows={10} />
          <div className="flex justify-end gap-2 pt-2 border-t border-edge">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>انصراف</Button>
            <Button onClick={handleSubmit} disabled={!formTitle.trim() || !formContent.trim()}>{editingArticle ? "ذخیره تغییرات" : "ایجاد مقاله"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

import { MoreVertical } from "lucide-react";