// NexaSupport Metrics & Analytics

import { tickets } from "@/data/tickets";
import { customers } from "@/data/customers";
import { agents } from "@/data/agents";
import { departments } from "@/data/departments";
import { conversations } from "@/data/conversations";
import { activities } from "@/data/activities";
import { slaRecords } from "@/data/sla";
import { satisfactionRecords } from "@/data/satisfaction";
import type { Ticket, Agent, Department, DashboardMetrics, ChartDataPoint, TicketStatus, TicketPriority, SLAStatus } from "@/lib/types";
import { STATUS_LABELS_FA, PRIORITY_LABELS_FA, CHANNEL_LABELS_FA } from "@/lib/utils";

export function getDashboardMetrics(): DashboardMetrics {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  const openTickets = tickets.filter((t) => t.status === "Open" || t.status === "New").length;
  const pendingTickets = tickets.filter((t) => t.status === "Pending").length;
  const resolvedToday = tickets.filter((t) => t.status === "Resolved" && t.resolvedAt && t.resolvedAt >= todayStart).length;

  const respondedTickets = tickets.filter((t) => t.firstResponseAt);
  const avgResponseMinutes = respondedTickets.length > 0
    ? Math.round(respondedTickets.reduce((sum, t) => {
        const created = new Date(t.createdAt).getTime();
        const responded = new Date(t.firstResponseAt!).getTime();
        return sum + (responded - created) / 60000;
      }, 0) / respondedTickets.length)
    : 0;

  const slaAtRisk = slaRecords.filter((s) => s.firstResponseStatus === "At Risk" || s.resolutionStatus === "At Risk").length;

  const positiveSatisfactions = satisfactionRecords.filter((s) => s.rating === "Positive").length;
  const satisfactionScore = satisfactionRecords.length > 0
    ? Math.round((positiveSatisfactions / satisfactionRecords.length) * 100)
    : 0;

  return {
    openTickets,
    pendingTickets,
    resolvedToday,
    avgResponseMinutes,
    slaAtRisk,
    satisfactionScore,
  };
}

export function getTicketVolumeData(days = 7): ChartDataPoint[] {
  const result: ChartDataPoint[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const dayTickets = tickets.filter((t) => t.createdAt.startsWith(dateStr));
    const newCount = dayTickets.filter((t) => t.status === "New" || t.status === "Open").length;
    const resolvedCount = dayTickets.filter((t) => t.resolvedAt && t.resolvedAt.startsWith(dateStr)).length;
    const pendingCount = dayTickets.filter((t) => t.status === "Pending").length;

    result.push({
      label: date.toLocaleDateString("fa-IR", { weekday: "short", day: "numeric", month: "short" }),
      new: newCount,
      resolved: resolvedCount,
      pending: pendingCount,
    });
  }
  return result;
}

export function getTicketsByPriority(): ChartDataPoint[] {
  const priorities: TicketPriority[] = ["Low", "Medium", "High", "Urgent"];
  return priorities.map((priority) => ({
    label: PRIORITY_LABELS_FA[priority],
    value: tickets.filter((t) => t.priority === priority).length,
    priority,
  }));
}

export function getTicketsByStatus(): ChartDataPoint[] {
  const statuses: TicketStatus[] = ["New", "Open", "Pending", "Resolved", "Closed"];
  return statuses.map((status) => ({
    label: STATUS_LABELS_FA[status],
    value: tickets.filter((t) => t.status === status).length,
    status,
  }));
}

export function getTicketsByDepartment(): ChartDataPoint[] {
  return departments.map((dept) => ({
    label: dept.name,
    value: tickets.filter((t) => t.departmentId === dept.id).length,
    departmentId: dept.id,
  }));
}

export function getTicketsByChannel(): ChartDataPoint[] {
  const channels: ("Email" | "Chat" | "Phone" | "Portal" | "Social")[] = ["Email", "Chat", "Phone", "Portal", "Social"];
  return channels.map((channel) => ({
    label: CHANNEL_LABELS_FA[channel],
    value: tickets.filter((t) => t.channel === channel).length,
    channel,
  }));
}

export function getSLAOverview(): ChartDataPoint[] {
  const within = slaRecords.filter((s) => s.firstResponseStatus === "Within" && s.resolutionStatus === "Within").length;
  const atRisk = slaRecords.filter((s) => s.firstResponseStatus === "At Risk" || s.resolutionStatus === "At Risk").length;
  const breached = slaRecords.filter((s) => s.firstResponseStatus === "Breached" || s.resolutionStatus === "Breached").length;

  return [
    { label: "در چارچوب", value: within, status: "Within" },
    { label: "در خطر", value: atRisk, status: "At Risk" },
    { label: "نقض شده", value: breached, status: "Breached" },
  ];
}

export function getAgentPerformance(): ChartDataPoint[] {
  return agents.map((agent) => ({
    label: agent.name,
    assigned: agent.assignedTickets,
    resolved: agent.resolvedTickets,
    avgResponse: agent.avgResponseMinutes,
    satisfaction: agent.satisfactionScore,
    agentId: agent.id,
  }));
}

export function getResolutionTrend(days = 7): ChartDataPoint[] {
  const result: ChartDataPoint[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const created = tickets.filter((t) => t.createdAt.startsWith(dateStr)).length;
    const resolved = tickets.filter((t) => t.resolvedAt && t.resolvedAt.startsWith(dateStr)).length;

    result.push({
      label: date.toLocaleDateString("fa-IR", { weekday: "short" }),
      created,
      resolved,
      rate: created > 0 ? Math.round((resolved / created) * 100) : 0,
    });
  }
  return result;
}

export function getSatisfactionTrend(days = 7): ChartDataPoint[] {
  const result: ChartDataPoint[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const dayRecords = satisfactionRecords.filter((s) => s.createdAt.startsWith(dateStr));
    const positive = dayRecords.filter((s) => s.rating === "Positive").length;
    const total = dayRecords.length;

    result.push({
      label: date.toLocaleDateString("fa-IR", { weekday: "short" }),
      score: total > 0 ? Math.round((positive / total) * 100) : 0,
      total,
    });
  }
  return result;
}

export function getPriorityDistribution(): ChartDataPoint[] {
  return getTicketsByPriority();
}

export function getDepartmentDistribution(): ChartDataPoint[] {
  return getTicketsByDepartment();
}

export function getChannelDistribution(): ChartDataPoint[] {
  return getTicketsByChannel();
}

export function getSLAComplianceByPriority(): ChartDataPoint[] {
  const priorities: TicketPriority[] = ["Low", "Medium", "High", "Urgent"];
  return priorities.map((priority) => {
    const prioritySLA = slaRecords.filter((s) => s.priority === priority);
    const within = prioritySLA.filter((s) => s.firstResponseStatus === "Within" && s.resolutionStatus === "Within").length;
    const result: ChartDataPoint = {
      label: PRIORITY_LABELS_FA[priority],
      value: prioritySLA.length > 0 ? Math.round((within / prioritySLA.length) * 100) : 100,
      priority: priority
    };
    return result;
  });
}

export function getSLAComplianceByDepartment(): ChartDataPoint[] {
  return departments.map((dept) => {
    const deptSLA = slaRecords.filter((s) => s.departmentId === dept.id);
    const within = deptSLA.filter((s) => s.firstResponseStatus === "Within" && s.resolutionStatus === "Within").length;
    return {
      label: dept.name,
      value: deptSLA.length > 0 ? Math.round((within / deptSLA.length) * 100) : 100,
      departmentId: dept.id,
    };
  });
}