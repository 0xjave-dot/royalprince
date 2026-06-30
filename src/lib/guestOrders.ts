import type { Order } from "./userAccount";

const GUEST_ORDER_KEY = "royal-prince-fashion.guestOrder";

export interface GuestOrderRecord {
  order: Order;
  createdAt: string;
}

export function saveGuestOrder(order: Order) {
  if (typeof window === "undefined") return;
  const payload: GuestOrderRecord = {
    order,
    createdAt: new Date().toISOString(),
  };
  window.localStorage.setItem(GUEST_ORDER_KEY, JSON.stringify(payload));
}

export function getGuestOrder(orderId?: string | null) {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(GUEST_ORDER_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw) as Partial<GuestOrderRecord>;
    if (!payload.order) return null;
    if (orderId && payload.order.id !== orderId) return null;
    return payload.order;
  } catch {
    return null;
  }
}

export function clearGuestOrder() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(GUEST_ORDER_KEY);
}
