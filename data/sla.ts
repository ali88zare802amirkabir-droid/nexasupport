// NexaSupport Mock Data - SLA Records

import type { SLARecord, TicketPriority } from "@/lib/types";
import { tickets } from "./tickets";
import { departments } from "./departments";

function addMinutes(dateStr: string, minutes: number): string {
  return new Date(new Date(dateStr).getTime() + minutes * 60000).toISOString();
}

export const slaRecords: SLARecord[] = tickets.map((ticket) => {
  const dept = departments.find((d) => d.id === ticket.departmentId) || departments[0];
  const firstResponseTargetMinutes = dept.slaFirstResponseMinutes;
  const resolutionTargetMinutes = dept.slaResolutionMinutes;

  const slaFirstResponseAt = addMinutes(ticket.createdAt, firstResponseTargetMinutes);
  const slaResolutionAt = addMinutes(ticket.createdAt, resolutionTargetMinutes);

  const firstResponseStatus = ticket.firstResponseAt
    ? (new Date(ticket.firstResponseAt).getTime() <= new Date(slaFirstResponseAt).getTime() ? "Within" : "Breached")
    : (Date.now() > new Date(slaFirstResponseAt).getTime() ? "Breached" : (Date.now() > new Date(slaFirstResponseAt).getTime() - 3600000 ? "At Risk" : "Within"));

  const resolutionStatus = ticket.resolvedAt
    ? (new Date(ticket.resolvedAt).getTime() <= new Date(slaResolutionAt).getTime() ? "Within" : "Breached")
    : (Date.now() > new Date(slaResolutionAt).getTime() ? "Breached" : (Date.now() > new Date(slaResolutionAt).getTime() - 3600000 ? "At Risk" : "Within"));

  return {
    ticketId: ticket.id,
    priority: ticket.priority,
    departmentId: ticket.departmentId,
    firstResponseTargetMinutes,
    resolutionTargetMinutes,
    firstResponseAt: ticket.firstResponseAt,
    resolvedAt: ticket.resolvedAt,
    slaFirstResponseAt,
    slaResolutionAt,
    firstResponseStatus: firstResponseStatus as "Within" | "At Risk" | "Breached",
    resolutionStatus: resolutionStatus as "Within" | "At Risk" | "Breached",
  };
});