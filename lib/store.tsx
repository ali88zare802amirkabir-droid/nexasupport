// NexaSupport Store - Simple React Context + useState (no external deps)

import { createContext, useContext, useState, useEffect, useReducer, ReactNode } from "react";
import type { Ticket, TicketMessage, Customer, Agent, Notification, Activity, KnowledgeArticle, UserProfile, AppSettings } from "@/lib/types";
import { tickets as initialTickets } from "@/data/tickets";
import { customers as initialCustomers } from "@/data/customers";
import { agents as initialAgents } from "@/data/agents";
import { conversations as initialConversations } from "@/data/conversations";
import { notifications as initialNotifications } from "@/data/notifications";
import { activities as initialActivities } from "@/data/activities";
import { articles as initialArticles } from "@/data/articles";
import { userProfile, defaultSettings } from "@/data/profile";

interface ToastMessage {
  id: string;
  title: string;
  variant: "success" | "danger" | "info" | "warning";
}

interface AppState {
  tickets: Ticket[];
  customers: Customer[];
  agents: Agent[];
  conversations: any[];
  notifications: Notification[];
  activities: Activity[];
  articles: KnowledgeArticle[];
  toasts: ToastMessage[];
  sidebarOpen: boolean;
  searchOpen: boolean;
  notificationsOpen: boolean;
  profile: UserProfile;
  settings: AppSettings;
}

const initialState: AppState = {
  tickets: initialTickets,
  customers: initialCustomers,
  agents: initialAgents,
  conversations: initialConversations,
  notifications: initialNotifications,
  activities: initialActivities,
  articles: initialArticles,
  toasts: [],
  sidebarOpen: true,
  searchOpen: false,
  notificationsOpen: false,
  profile: userProfile,
  settings: defaultSettings,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: (action: { type: string; payload?: any }) => void;
} | null>(null);

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function appReducer(state: AppState, action: { type: string; payload?: any }): AppState {
  switch (action.type) {
    case "ADD_TICKET":
      return { ...state, tickets: [action.payload, ...state.tickets] };
    case "UPDATE_TICKET":
      return {
        ...state,
        tickets: state.tickets.map((t) => (t.id === action.payload.id ? { ...t, ...action.payload.updates, updatedAt: new Date().toISOString() } : t)),
      };
    case "DELETE_TICKET":
      return { ...state, tickets: state.tickets.filter((t) => t.id !== action.payload) };
    case "ADD_TICKET_MESSAGE":
      return {
        ...state,
        tickets: state.tickets.map((t) =>
          t.id === action.payload.ticketId && !t.firstResponseAt && action.payload.sender === "agent"
            ? { ...t, firstResponseAt: action.payload.createdAt, updatedAt: new Date().toISOString() }
            : t
        ),
      };
    case "ADD_INTERNAL_NOTE":
      return state;
    case "UPDATE_CUSTOMER":
      return { ...state, customers: state.customers.map((c) => (c.id === action.payload.id ? { ...c, ...action.payload.updates } : c)) };
    case "ADD_NOTIFICATION":
      return { ...state, notifications: [{ ...action.payload, id: uid("notif"), createdAt: new Date().toISOString() }, ...state.notifications] };
    case "MARK_NOTIFICATION_READ":
      return { ...state, notifications: state.notifications.map((n) => (n.id === action.payload ? { ...n, read: true } : n)) };
    case "MARK_ALL_NOTIFICATIONS_READ":
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) };
    case "ADD_ACTIVITY":
      return { ...state, activities: [{ ...action.payload, id: uid("act"), createdAt: new Date().toISOString() }, ...state.activities] };
    case "ADD_ARTICLE":
      return { ...state, articles: [action.payload, ...state.articles] };
    case "UPDATE_ARTICLE":
      return { ...state, articles: state.articles.map((a) => (a.id === action.payload.id ? { ...a, ...action.payload.updates, updatedAt: new Date().toISOString() } : a)) };
    case "SHOW_TOAST":
      return { ...state, toasts: [...state.toasts, { ...action.payload, id: uid("toast") }] };
    case "DISMISS_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case "SET_SIDEBAR_OPEN":
      return { ...state, sidebarOpen: action.payload };
    case "TOGGLE_SEARCH":
      return { ...state, searchOpen: !state.searchOpen };
    case "TOGGLE_NOTIFICATIONS":
      return { ...state, notificationsOpen: !state.notificationsOpen };
    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case "UPDATE_PROFILE":
      return { ...state, profile: { ...state.profile, ...action.payload } };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("nexasupport-storage");
        if (stored) {
          const parsed = JSON.parse(stored);
          return { ...init, ...parsed, toasts: [] };
        }
      } catch { }
    }
    return init;
  });

  useEffect(() => {
    localStorage.setItem("nexasupport-storage", JSON.stringify({
      settings: state.settings,
      profile: state.profile,
      sidebarOpen: state.sidebarOpen,
    }));
  }, [state.settings, state.profile, state.sidebarOpen]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppStore must be used within AppProvider");
  const { state, dispatch } = context;
  return {
    ...state,
    addTicket: (ticket: Ticket) => dispatch({ type: "ADD_TICKET", payload: ticket }),
    updateTicket: (id: string, updates: Partial<Ticket>) => dispatch({ type: "UPDATE_TICKET", payload: { id, updates } }),
    deleteTicket: (id: string) => dispatch({ type: "DELETE_TICKET", payload: id }),
    addTicketMessage: (message: TicketMessage) => dispatch({ type: "ADD_TICKET_MESSAGE", payload: message }),
    addInternalNote: (ticketId: string, content: string, authorId: string) => dispatch({ type: "ADD_INTERNAL_NOTE", payload: { ticketId, content, authorId } }),
    updateCustomer: (id: string, updates: Partial<Customer>) => dispatch({ type: "UPDATE_CUSTOMER", payload: { id, updates } }),
    addNotification: (notification: Omit<Notification, "id" | "createdAt">) => dispatch({ type: "ADD_NOTIFICATION", payload: notification }),
    markNotificationRead: (id: string) => dispatch({ type: "MARK_NOTIFICATION_READ", payload: id }),
    markAllNotificationsRead: () => dispatch({ type: "MARK_ALL_NOTIFICATIONS_READ" }),
    addActivity: (activity: Omit<Activity, "id" | "createdAt">) => dispatch({ type: "ADD_ACTIVITY", payload: activity }),
    addArticle: (article: KnowledgeArticle) => dispatch({ type: "ADD_ARTICLE", payload: article }),
    updateArticle: (id: string, updates: Partial<KnowledgeArticle>) => dispatch({ type: "UPDATE_ARTICLE", payload: { id, updates } }),
    showToast: (toast: Omit<ToastMessage, "id">) => dispatch({ type: "SHOW_TOAST", payload: toast }),
    dismissToast: (id: string) => dispatch({ type: "DISMISS_TOAST", payload: id }),
    toggleSidebar: () => dispatch({ type: "TOGGLE_SIDEBAR" }),
    setSidebarOpen: (open: boolean) => dispatch({ type: "SET_SIDEBAR_OPEN", payload: open }),
    toggleSearch: () => dispatch({ type: "TOGGLE_SEARCH" }),
    toggleNotifications: () => dispatch({ type: "TOGGLE_NOTIFICATIONS" }),
    updateSettings: (settings: Partial<AppSettings>) => dispatch({ type: "UPDATE_SETTINGS", payload: settings }),
    updateProfile: (profile: Partial<UserProfile>) => dispatch({ type: "UPDATE_PROFILE", payload: profile }),
  };
}

export function useApp() { return useAppStore(); }
export function useTickets() { return useAppStore().tickets; }
export function useCustomers() { return useAppStore().customers; }
export function useAgents() { return useAppStore().agents; }
export function useNotifications() { return useAppStore().notifications; }
export function useToasts() { const s = useAppStore(); return { toasts: s.toasts, dismissToast: s.dismissToast }; }
export function useSidebar() { const s = useAppStore(); return { open: s.sidebarOpen, toggle: s.toggleSidebar, setOpen: s.setSidebarOpen }; }
export function useSearch() { const s = useAppStore(); return { open: s.searchOpen, toggle: s.toggleSearch }; }
export function useNotificationsPanel() { const s = useAppStore(); return { open: s.notificationsOpen, toggle: s.toggleNotifications }; }
export function useProfile() { const s = useAppStore(); return { profile: s.profile, update: s.updateProfile }; }
export function useSettings() { const s = useAppStore(); return { settings: s.settings, update: s.updateSettings }; }