import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useSettings } from "./SettingsContext";
import { CartItem, Order, ShippingAddress } from "../lib/userAccount";

interface OrdersContextType {
  orders: Order[];
  placeOrder: (order: Omit<Order, "id" | "date" | "estDelivery">) => Order;
  getOrderById: (id: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { account, updateAccount } = useSettings();
  const orders = account.orders.items;

  const placeOrder = (newOrder: Omit<Order, "id" | "date" | "estDelivery">): Order => {
    const orderId = `SHP-${Date.now()}`;
    const today = new Date();

    const estStart = new Date();
    estStart.setDate(today.getDate() + 3);
    const estEnd = new Date();
    estEnd.setDate(today.getDate() + 5);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formatDate = (d: Date) => `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}, ${d.getFullYear()}`;

    const formattedDate = `${formatDate(today)} at ${today.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    const formattedEstDelivery = `${formatDate(estStart)} - ${formatDate(estEnd)}`;

    const shippingAddress: ShippingAddress = {
      ...newOrder.shippingAddress,
      isDefault: Boolean(newOrder.shippingAddress.isDefault),
    };

    const order: Order = {
      ...newOrder,
      id: orderId,
      date: formattedDate,
      estDelivery: formattedEstDelivery,
      shippingAddress,
      items: newOrder.items.map((item: CartItem) => ({ ...item })),
      checkoutMode: newOrder.checkoutMode ?? "self",
      giftRecipientName: newOrder.giftRecipientName ?? "",
      giftMessage: newOrder.giftMessage ?? "",
      sharedWithLovedOne: Boolean(newOrder.sharedWithLovedOne),
    };

    updateAccount({
      ...account,
      orders: {
        items: [order, ...orders],
      },
    });

    return order;
  };

  const getOrderById = (id: string): Order | undefined => orders.find((order) => order.id === id);

  return (
    <OrdersContext.Provider value={{ orders, placeOrder, getOrderById }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within OrdersProvider");
  }
  return context;
}
