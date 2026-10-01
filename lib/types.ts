// NexaSupport Type Definitions

export type TicketStatus = "New" | "Open" | "Pending" | "Resolved" | "Closed";
export type TicketPriority = "Low" | "Medium" | "High" | "Urgent";
export type TicketChannel = "Email" | "Chat" | "Phone" | "Portal" | "Social";
export type AgentStatus = "Online" | "Away" | "Offline";
export type CustomerStatus = "Active" | "Inactive" | "VIP" | "Blocked";
export type ArticleStatus = "Published" | "Draft" | "Archived";
export type SLAStatus = "Within" | "At Risk" | "Breached";
export type SatisfactionRating = "Positive" | "Neutral" | "Negative";
export type NotificationType = "ticket_assigned" | "sla_warning" | "customer_replied" | "ticket_resolved" | "internal_mention";
export type MessageSender = "customer" | "agent" | "system";
export type NoteType = "internal" | "customer";

export interface Department {
  id: string;
  name: string;
  description: string;
  color: string;
  agentIds: string[];
  slaFirstResponseMinutes: number;
  slaResolutionMinutes: number;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  departmentId: string;
  status: AgentStatus;
  assignedTickets: number;
  resolvedTickets: number;
  avgResponseMinutes: number;
  satisfactionScore: number;
  maxConcurrentTickets: number;
  skills: string[];
  joinedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  avatarColor: string;
  status: CustomerStatus;
  openTickets: number;
  resolvedTickets: number;
  totalTickets: number;
  lastContactAt: string;
  satisfactionScore: number;
  tags: string[];
  createdAt: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  channel: TicketChannel;
  customerId: string;
  agentId: string | null;
  departmentId: string;
  tags: string[];
  slaFirstResponseAt: string | null;
  slaResolutionAt: string | null;
  firstResponseAt: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  sender: MessageSender;
  senderId: string;
  content: string;
  isInternal: boolean;
  attachments: Attachment[];
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface Conversation {
  id: string;
  subject: string;
  customerId: string;
  agentId: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  status: "active" | "waiting" | "closed";
  channel: TicketChannel;
  createdAt: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt: string;
  status: ArticleStatus;
  views: number;
  helpful: number;
  notHelpful: number;
  authorId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  relatedId: string | null;
  relatedType: "ticket" | "customer" | "agent" | "sla" | null;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: "ticket_created" | "ticket_assigned" | "ticket_replied" | "ticket_resolved" | "ticket_status_changed" | "priority_changed" | "customer_added" | "internal_note";
  actorId: string;
  actorName: string;
  actorType: "agent" | "customer" | "system";
  ticketId: string | null;
  customerId: string | null;
  description: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface SLARecord {
  ticketId: string;
  priority: TicketPriority;
  departmentId: string;
  firstResponseTargetMinutes: number;
  resolutionTargetMinutes: number;
  firstResponseAt: string | null;
  resolvedAt: string | null;
  slaFirstResponseAt: string;
  slaResolutionAt: string;
  firstResponseStatus: SLAStatus;
  resolutionStatus: SLAStatus;
}

export interface SatisfactionRecord {
  id: string;
  ticketId: string;
  customerId: string;
  rating: SatisfactionRating;
  comment: string | null;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarColor: string;
  role: string;
  department: string;
  dailyGoalTickets: number;
  preferredLanguage: "fa" | "en";
  timezone: string;
}

export interface AppSettings {
  companyName: string;
  supportEmail: string;
  timezone: string;
  defaultPriority: TicketPriority;
  defaultStatus: TicketStatus;
  autoAssignment: boolean;
  slaFirstResponseMinutes: number;
  slaResolutionMinutes: number;
  notifications: {
    slaWarnings: boolean;
    newTickets: boolean;
    customerReplies: boolean;
    internalMentions: boolean;
  };
  appearance: {
    theme: "dark" | "light" | "system";
    density: "compact" | "comfortable" | "spacious";
    reducedMotion: boolean;
  };
}

export interface FilterState {
  search: string;
  status: string;
  priority: string;
  agentId: string;
  departmentId: string;
  dateFrom: string;
  dateTo: string;
  slaStatus: string;
}

export interface DashboardMetrics {
  openTickets: number;
  pendingTickets: number;
  resolvedToday: number;
  avgResponseMinutes: number;
  slaAtRisk: number;
  satisfactionScore: number;
}

export interface ChartDataPoint {
  label: string;
  value?: number;
  [key: string]: any;
}