import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { Order, UserAccountDoc } from "./userAccount";

export type VisitSourceKind = "direct" | "internal" | "external";

export interface VisitLog {
  id: string;
  path: string;
  sourceKind: VisitSourceKind;
  sourceHost: string;
  referrer: string;
  locale: string;
  timeZone: string;
  device: string;
  sessionId: string;
  userId?: string;
  createdAt?: unknown;
}

export interface VisitSummaryRow {
  label: string;
  count: number;
}

export interface OrderPerformanceRow {
  productId: string;
  name: string;
  qty: number;
  revenue: number;
}

export interface DailyOrderRow {
  day: string;
  orders: number;
  revenue: number;
}

export interface OrderAnalyticsSummary {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  statusCounts: VisitSummaryRow[];
  dailyOrders: DailyOrderRow[];
  productPerformance: OrderPerformanceRow[];
}

export interface VisitAnalyticsSummary {
  totalVisits: number;
  uniqueSessions: number;
  sourceCounts: VisitSummaryRow[];
  locationCounts: VisitSummaryRow[];
  recentVisits: VisitLog[];
}

function safeString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function makeSessionId() {
  const existing = sessionStorage.getItem("royal-prince-fashion-visit-session");
  if (existing) return existing;

  const next = `visit-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  sessionStorage.setItem("royal-prince-fashion-visit-session", next);
  return next;
}

function classifySource(referrer: string): VisitSourceKind {
  if (!referrer) return "direct";

  try {
    const referrerHost = new URL(referrer).hostname;
    if (referrerHost === window.location.hostname) {
      return "internal";
    }
    return "external";
  } catch {
    return "external";
  }
}

export async function recordVisit(path: string, userId?: string) {
  if (typeof window === "undefined") return;

  const dedupeKey = `royal-prince-fashion-visit:${sessionStorage.getItem("royal-prince-fashion-visit-session") ?? "anon"}:${path}`;
  if (sessionStorage.getItem(dedupeKey)) return;
  sessionStorage.setItem(dedupeKey, "1");

  const referrer = document.referrer ?? "";
  const sourceHost = referrer ? (() => {
    try {
      return new URL(referrer).hostname;
    } catch {
      return "unknown";
    }
  })() : "direct";

  const payload: Omit<VisitLog, "id"> = {
    path,
    sourceKind: classifySource(referrer),
    sourceHost,
    referrer,
    locale: safeString(navigator.language, "unknown"),
    timeZone: safeString(Intl.DateTimeFormat().resolvedOptions().timeZone, "unknown"),
    device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
    sessionId: makeSessionId(),
    userId,
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, "analyticsVisits"), payload);
}

export function summarizeVisits(visits: VisitLog[]): VisitAnalyticsSummary {
  const sourceMap = new Map<string, number>();
  const locationMap = new Map<string, number>();
  const sessionIds = new Set<string>();

  visits.forEach((visit) => {
    sessionIds.add(visit.sessionId);
    const sourceLabel =
      visit.sourceKind === "direct"
        ? "Direct"
        : visit.sourceKind === "internal"
          ? "Internal"
          : visit.sourceHost || "External";
    sourceMap.set(sourceLabel, (sourceMap.get(sourceLabel) ?? 0) + 1);

    const locationLabel = [visit.locale, visit.timeZone].filter(Boolean).join(" · ") || "Unknown";
    locationMap.set(locationLabel, (locationMap.get(locationLabel) ?? 0) + 1);
  });

  return {
    totalVisits: visits.length,
    uniqueSessions: sessionIds.size,
    sourceCounts: Array.from(sourceMap.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count),
    locationCounts: Array.from(locationMap.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count),
    recentVisits: [...visits].sort((a, b) => {
      const aTime = a.createdAt && typeof a.createdAt === "object" && "toMillis" in a.createdAt
        ? (a.createdAt as { toMillis: () => number }).toMillis()
        : 0;
      const bTime = b.createdAt && typeof b.createdAt === "object" && "toMillis" in b.createdAt
        ? (b.createdAt as { toMillis: () => number }).toMillis()
        : 0;
      return bTime - aTime;
    }),
  };
}

function toDayLabel(orderId: string, dateLabel?: string) {
  const timestamp = Number(orderId.replace(/^SHP-/, ""));
  if (Number.isFinite(timestamp) && timestamp > 0) {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
  }

  if (dateLabel) {
    return dateLabel.split(" at ")[0] ?? dateLabel;
  }

  return "Unknown";
}

export function summarizeOrders(accounts: UserAccountDoc[]): OrderAnalyticsSummary {
  const orderList: Order[] = accounts.flatMap((account) => account.orders?.items ?? []);
  const statusCounts = new Map<string, number>();
  const dailyOrders = new Map<string, { orders: number; revenue: number }>();
  const productPerformance = new Map<string, OrderPerformanceRow>();

  let totalRevenue = 0;

  orderList.forEach((order) => {
    totalRevenue += order.total;
    statusCounts.set(order.status, (statusCounts.get(order.status) ?? 0) + 1);

    const day = toDayLabel(order.id, order.date);
    const currentDay = dailyOrders.get(day) ?? { orders: 0, revenue: 0 };
    currentDay.orders += 1;
    currentDay.revenue += order.total;
    dailyOrders.set(day, currentDay);

    order.items.forEach((item) => {
      const current = productPerformance.get(item.productId) ?? {
        productId: item.productId,
        name: item.name,
        qty: 0,
        revenue: 0,
      };
      current.qty += item.qty;
      current.revenue += item.qty * item.price;
      productPerformance.set(item.productId, current);
    });
  });

  return {
    totalOrders: orderList.length,
    totalRevenue,
    averageOrderValue: orderList.length > 0 ? totalRevenue / orderList.length : 0,
    statusCounts: Array.from(statusCounts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count),
    dailyOrders: Array.from(dailyOrders.entries())
      .map(([day, value]) => ({ day, ...value }))
      .sort((a, b) => a.day.localeCompare(b.day)),
    productPerformance: Array.from(productPerformance.values()).sort((a, b) => b.qty - a.qty),
  };
}
