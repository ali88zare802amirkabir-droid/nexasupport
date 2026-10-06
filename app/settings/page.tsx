// NexaSupport Settings Page

"use client";

import { useState } from "react";
import { Building2, Mail, Globe, Shield, Bell, Palette, LayoutGrid, Zap, Moon, Sun, Monitor, Minimize, Maximize, Save, User, Key, Globe2, Clock, AlertTriangle, CheckCircle2, MessageSquare } from "lucide-react";
import { useProfile, useSettings, useApp } from "@/lib/store";
import { useTheme } from "@/components/providers/theme-provider";
import { Card, Button, TextInput, Select, Badge, Avatar, Switch } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";

const TIMEZONES = ["Asia/Tehran", "UTC", "Europe/London", "America/New_York", "Asia/Dubai", "Asia/Tokyo"];
const LANGUAGES = [{ value: "fa", label: "فارسی" }, { value: "en", label: "English" }];

export default function SettingsPage() {
  const { profile, update: updateProfile } = useProfile();
  const { settings, update: updateSettings } = useSettings();
  const { showToast } = useApp();
  const { setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<"workspace" | "tickets" | "sla" | "notifications" | "appearance">("workspace");
  const [formData, setFormData] = useState({
    companyName: settings.companyName,
    supportEmail: settings.supportEmail,
    timezone: settings.timezone,
    defaultPriority: settings.defaultPriority,
    defaultStatus: settings.defaultStatus,
    autoAssignment: settings.autoAssignment,
    slaFirstResponse: settings.slaFirstResponseMinutes,
    slaResolution: settings.slaResolutionMinutes,
    notifSLA: settings.notifications.slaWarnings,
    notifNewTickets: settings.notifications.newTickets,
    notifReplies: settings.notifications.customerReplies,
    notifMentions: settings.notifications.internalMentions,
    theme: settings.appearance.theme,
    density: settings.appearance.density,
    reducedMotion: settings.appearance.reducedMotion,
  });

  const tabs = [
    { id: "workspace", label: "فضای کار", icon: <Building2 className="size-4" /> },
    { id: "tickets", label: "تیکت‌ها", icon: <TicketCheck className="size-4" /> },
    { id: "sla", label: "SLA", icon: <Clock className="size-4" /> },
    { id: "notifications", label: "اعلان‌ها", icon: <Bell className="size-4" /> },
    { id: "appearance", label: "نمایش", icon: <Palette className="size-4" /> },
  ];

  const handleChange = (key: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateSettings({
      companyName: formData.companyName,
      supportEmail: formData.supportEmail,
      timezone: formData.timezone,
      defaultPriority: formData.defaultPriority as "Low" | "Medium" | "High" | "Urgent",
      defaultStatus: formData.defaultStatus as "New" | "Open" | "Pending" | "Resolved" | "Closed",
      autoAssignment: formData.autoAssignment,
      slaFirstResponseMinutes: formData.slaFirstResponse,
      slaResolutionMinutes: formData.slaResolution,
      notifications: {
        slaWarnings: formData.notifSLA,
        newTickets: formData.notifNewTickets,
        customerReplies: formData.notifReplies,
        internalMentions: formData.notifMentions,
      },
      appearance: {
        theme: formData.theme as "dark" | "light" | "system",
        density: formData.density as "compact" | "comfortable" | "spacious",
        reducedMotion: formData.reducedMotion,
      },
    });
    setTheme(formData.theme as "dark" | "light" | "system");
    showToast({ title: "تنظیمات ذخیره شد", variant: "success" });
  };

  const handleProfileSave = () => {
    showToast({ title: "پروفایل به‌روزرسانی شد", variant: "success" });
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="تنظیمات" subtitle="مدیریت تنظیمات پلتفرم پشتیبانی" />

      {/* Profile Card */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <Avatar name={profile.name} color={profile.avatarColor} size="xl" />
            <div>
              <h3 className="font-display text-xl font-bold text-ink">{profile.name}</h3>
              <p className="text-ink-3">{profile.email}</p>
              <p className="text-sm text-ink-3 mt-1">{profile.role} • {profile.department}</p>
            </div>
          </div>
          <div className="flex-1" />
          <Button onClick={handleProfileSave}><Save className="size-4" /> ذخیره پروفایل</Button>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-4">
        <nav className="w-full sm:w-48 flex-shrink-0" aria-label="تنظیمات">
          <ul className="space-y-1 bg-surface rounded-2xl border border-edge p-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-fast",
                    activeTab === tab.id
                      ? "bg-accent/10 text-accent"
                      : "text-ink-3 hover:bg-surface-2 hover:text-ink"
                  )}
                >
                  <span className="shrink-0">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-1">
          {/* Workspace Tab */}
          {activeTab === "workspace" && (
            <Card>
              <h3 className="font-display text-base font-bold text-ink mb-6">تنظیمات فضای کار</h3>
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput label="نام شرکت" value={formData.companyName} onChange={(e) => handleChange("companyName", e.target.value)} />
                  <TextInput label="ایمیل پشتیبانی" type="email" value={formData.supportEmail} onChange={(e) => handleChange("supportEmail", e.target.value)} />
                </div>
                <Select label="منطقه زمانی" value={formData.timezone} onChange={(e) => handleChange("timezone", e.target.value)}>
                  {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
                </Select>
                <Select label="زبان پیش‌فرض" value={profile.preferredLanguage} onChange={(e) => { handleChange("preferredLanguage", e.target.value); updateProfile({ preferredLanguage: e.target.value as "fa" | "en" }); }}>
                  {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </Select>
              </div>
            </Card>
          )}

          {/* Tickets Tab */}
          {activeTab === "tickets" && (
            <Card>
              <h3 className="font-display text-base font-bold text-ink mb-6">تنظیمات تیکت‌ها</h3>
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select label="اولویت پیش‌فرض" value={formData.defaultPriority} onChange={(e) => handleChange("defaultPriority", e.target.value)}>
                    <option value="Low">کم</option>
                    <option value="Medium">متوسط</option>
                    <option value="High">بالا</option>
                    <option value="Urgent">فوری</option>
                  </Select>
                  <Select label="وضعیت پیش‌فرض" value={formData.defaultStatus} onChange={(e) => handleChange("defaultStatus", e.target.value)}>
                    <option value="New">جدید</option>
                    <option value="Open">باز</option>
                    <option value="Pending">در انتظار</option>
                    <option value="Resolved">حل شده</option>
                    <option value="Closed">بسته</option>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface border border-edge">
                  <div>
                    <p className="font-medium text-ink">اختصاص خودکار تیکت‌ها</p>
                    <p className="text-sm text-ink-3">تیکت‌های جدید به طور خودکار بر اساس مهارت و بار کار به کارشناس ارجاع داده می‌شوند</p>
                  </div>
                  <Switch checked={formData.autoAssignment} onChange={(e) => handleChange("autoAssignment", e.target.checked)} />
                </div>
              </div>
            </Card>
          )}

          {/* SLA Tab */}
          {activeTab === "sla" && (
            <Card>
              <h3 className="font-display text-base font-bold text-ink mb-6">تنظیمات SLA</h3>
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">هدف پاسخ اول (دقیقه)</label>
                    <TextInput type="number" value={formData.slaFirstResponse} onChange={(e) => handleChange("slaFirstResponse", parseInt(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label className="label">هدف حل (دقیقه)</label>
                    <TextInput type="number" value={formData.slaResolution} onChange={(e) => handleChange("slaResolution", parseInt(e.target.value) || 0)} />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface border border-edge">
                  <h4 className="font-medium text-ink mb-3">SLA پیش‌فرض بر اساس اولویت</h4>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { label: "کم", first: 240, resolve: 1440 },
                      { label: "متوسط", first: 120, resolve: 720 },
                      { label: "بالا", first: 60, resolve: 480 },
                      { label: "فوری", first: 30, resolve: 240 },
                    ].map((p) => (
                      <div key={p.label} className="p-3 rounded-xl bg-surface-2 border border-edge">
                        <p className="font-medium text-ink">{p.label}</p>
                        <div className="flex gap-2 mt-2 text-sm">
                          <span className="flex-1 text-ink-3">پاسخ اول: {p.first}د</span>
                          <span className="flex-1 text-ink-3">حل: {p.resolve}د</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <Card>
              <h3 className="font-display text-base font-bold text-ink mb-6">ترجیحات اعلان</h3>
              <div className="space-y-4">
                {[
                  { key: "notifSLA", label: "هشدارهای SLA", desc: "اطلاع‌رسانی هنگام نزدیک شدن به موعد SLA" },
                  { key: "notifNewTickets", label: "تیکت‌های جدید", desc: "اعلان هنگام ایجاد تیکت جدید" },
                  { key: "notifReplies", label: "پاسخ‌های مشتری", desc: "اطلاع‌رسانی هنگام پاسخ مشتری به تیکت" },
                  { key: "notifMentions", label: "منشن‌های داخلی", desc: "اعلان هنگام منشن شدن در یادداشت داخلی" },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between p-4 rounded-xl bg-surface border border-edge">
                    <div>
                      <p className="font-medium text-ink">{n.label}</p>
                      <p className="text-sm text-ink-3">{n.desc}</p>
                    </div>
                    <Switch checked={formData[n.key as keyof typeof formData] as boolean} onChange={(e) => handleChange(n.key, e.target.checked)} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <Card>
              <h3 className="font-display text-base font-bold text-ink mb-6">تنظیمات نمایش</h3>
              <div className="space-y-6">
                <div>
                  <label className="label">تم</label>
                  <div className="flex gap-3">
                    {[
                      { value: "dark", label: "تاریک", icon: <Moon className="size-5" /> },
                      { value: "light", label: "روشن", icon: <Sun className="size-5" /> },
                      { value: "system", label: "سیستم", icon: <Monitor className="size-5" /> },
                    ].map((t) => (
                      <button
                        key={t.value}
                        onClick={() => handleChange("theme", t.value)}
                        className={cn("flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all", formData.theme === t.value ? "border-accent bg-accent/5" : "border-edge hover:border-accent/50")}
                      >
                        <div className="size-12 rounded-xl flex items-center justify-center bg-surface-2">{t.icon}</div>
                        <span className="text-sm font-medium">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">تراکم</label>
                  <div className="flex gap-3">
                    {[
                      { value: "compact", label: "فشرده", icon: <Minimize className="size-5" />, desc: "فضای کم‌تر، اطلاعات بیشتر" },
                      { value: "comfortable", label: "راحت", icon: <LayoutGrid className="size-5" />, desc: "متوازن و استاندارد" },
                      { value: "spacious", label: "گسترده", icon: <Maximize className="size-5" />, desc: "فضای بیشتر، خوانایی بهتر" },
                    ].map((d) => (
                      <button
                        key={d.value}
                        onClick={() => handleChange("density", d.value)}
                        className={cn("flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all", formData.density === d.value ? "border-accent bg-accent/5" : "border-edge hover:border-accent/50")}
                      >
                        <div className="size-12 rounded-xl flex items-center justify-center bg-surface-2">{d.icon}</div>
                        <span className="text-sm font-medium">{d.label}</span>
                        <p className="text-xs text-ink-3 text-center">{d.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface border border-edge">
                  <div>
                    <p className="font-medium text-ink">کاهش حرکات</p>
                    <p className="text-sm text-ink-3">غیرفعال‌سازی انیمیشن‌ها برای دسترس‌پذیری بهتر</p>
                  </div>
                  <Switch checked={formData.reducedMotion} onChange={(e) => handleChange("reducedMotion", e.target.checked)} />
                </div>
              </div>
            </Card>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} className="w-full sm:w-auto"><Save className="size-4" /> ذخیره تمام تغییرات</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { TicketCheck } from "lucide-react";