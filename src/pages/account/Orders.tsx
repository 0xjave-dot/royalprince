import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock3, ChevronRight, Package, ShoppingBag, CreditCard, MessageSquare } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackButton } from "../../components/layout/BackButton";
import { EmptyState } from "../../components/common/EmptyState";
import { ScrollReveal } from "../../components/common/ScrollReveal";
import { useOrders } from "../../context/OrdersContext";
import type { Order } from "../../lib/userAccount";
import { useSettings } from "../../context/SettingsContext";

const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=2348028598695";

type OrderFilter = "all" | Order["status"] | "active" | "history";

function getStatusMeta(status: Order["status"]) {
  switch (status) {
    case "placed":
      return { label: "Placed", bg: "bg-[#e0e8ff]", text: "text-blue" };
    case "processing":
      return { label: "Processing", bg: "bg-[#fff8e0]", text: "text-[#d19c00]" };
    case "shipped":
      return { label: "Shipped", bg: "bg-[#e8f5e9]", text: "text-[#2e7d32]" };
    case "out_for_delivery":
      return { label: "Out for Delivery", bg: "bg-blue-light", text: "text-blue" };
    case "delivered":
    default:
      return { label: "Delivered", bg: "bg-[#e8f5e9]", text: "text-[#2e7d32]" };
  }
}

function getOrderType(order: Order) {
  const dressCount = order.items.filter((item) => item.productId.includes("dress") || item.name.toLowerCase().includes("dress")).length;
  const shoeCount = order.items.filter((item) => item.productId.includes("shoe") || item.name.toLowerCase().includes("shoe")).length;
  const bagCount = order.items.filter((item) => item.productId.includes("bag") || item.name.toLowerCase().includes("bag")).length;
  const pieceCount = order.items.filter((item) => item.productId.includes("tp-") || item.name.toLowerCase().includes("two-piece")).length;

  const ranked = [
    { label: "Dresses", count: dressCount },
    { label: "Two-Pieces", count: pieceCount },
    { label: "Shoes", count: shoeCount },
    { label: "Bags", count: bagCount },
  ].sort((a, b) => b.count - a.count);

  return ranked[0]?.count ? ranked[0].label : "Mixed Order";
}

export default function Orders() {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { currencySymbol } = useSettings();

  const [activeTab, setActiveTab] = useState<OrderFilter>("all");

  const filteredOrders = useMemo(() => {
    if (activeTab === "all") return orders;
    if (activeTab === "active") return orders.filter((order) => order.status !== "delivered");
    if (activeTab === "history") return orders.filter((order) => order.status === "delivered");
    return orders.filter((order) => order.status === activeTab);
  }, [activeTab, orders]);

  const totals = useMemo(() => {
    const active = orders.filter((order) => order.status !== "delivered").length;
    const delivered = orders.filter((order) => order.status === "delivered").length;
    const processing = orders.filter((order) => order.status === "processing").length;
    return { active, delivered, processing };
  }, [orders]);

  return (
    <div className="flex-1 flex flex-col bg-white animate-fade-up-enter min-h-screen pb-10">
      <PageHeader title="Orders" left={<BackButton />} />

      <div className="p-5 flex-1 space-y-5">
        <div className="rounded-[24px] bg-gradient-to-br from-blue to-[#3b6bff] text-white p-5 shadow-std overflow-hidden relative">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-[10px] font-black uppercase tracking-[0.24em] text-white/70">
                Order history
              </p>
              <h2 className="mt-2 font-display text-[24px] font-black leading-tight">
                Track everything you&apos;ve bought
              </h2>
              <p className="mt-2 max-w-[420px] text-[13px] text-white/75 leading-relaxed">
                Review all purchases, filter by status, and quickly inspect each order&apos;s date, type, payment method, and fulfillment stage.
              </p>
            </div>
            <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-[20px] bg-white/15">
              <ShoppingBag className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setActiveTab("all")}
            className={`rounded-[16px] px-3 py-3 text-left border transition-all cursor-pointer ${
              activeTab === "all" ? "bg-blue text-white border-blue" : "bg-white border-black/5"
            }`}
          >
            <div className="font-display text-[10px] font-black uppercase tracking-[0.22em] opacity-70">All</div>
            <div className="mt-1 font-display text-[18px] font-black">{orders.length}</div>
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`rounded-[16px] px-3 py-3 text-left border transition-all cursor-pointer ${
              activeTab === "active" ? "bg-blue text-white border-blue" : "bg-white border-black/5"
            }`}
          >
            <div className="font-display text-[10px] font-black uppercase tracking-[0.22em] opacity-70">Active</div>
            <div className="mt-1 font-display text-[18px] font-black">{totals.active}</div>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`rounded-[16px] px-3 py-3 text-left border transition-all cursor-pointer ${
              activeTab === "history" ? "bg-blue text-white border-blue" : "bg-white border-black/5"
            }`}
          >
            <div className="font-display text-[10px] font-black uppercase tracking-[0.22em] opacity-70">Delivered</div>
            <div className="mt-1 font-display text-[18px] font-black">{totals.delivered}</div>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5 select-none">
          {[
            { id: "all", label: "All Orders" },
            { id: "active", label: "Active" },
            { id: "processing", label: "Processing" },
            { id: "shipped", label: "Shipped" },
            { id: "history", label: "Delivered" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as OrderFilter)}
              className={`px-4 py-1.5 rounded-full border font-display text-[12.5px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "border-blue bg-blue-light text-blue"
                  : "border-gray3 text-[#555] bg-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray2 font-medium px-1">
          <span>{filteredOrders.length} order{filteredOrders.length === 1 ? "" : "s"} found</span>
          <button
            onClick={() => window.location.assign(WHATSAPP_URL)}
            className="inline-flex items-center gap-1.5 font-display font-bold text-blue hover:underline"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Need help?
          </button>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => {
              const { label, bg, text } = getStatusMeta(order.status);
              const totalItems = order.items.reduce((sum, item) => sum + item.qty, 0);
              const orderType = getOrderType(order);

              return (
                <React.Fragment key={order.id}>
                  <ScrollReveal delay={index * 0.05}>
                    <div
                      className="bg-white rounded-[22px] border border-black/[0.04] shadow-subtle p-4.5 hover:shadow-std transition-all cursor-pointer"
                      onClick={() => navigate(`/orders/${order.items[0]?.productId}/track`)}
                    >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="min-w-0">
                        <div className="font-display font-extrabold text-[12.5px] text-dark truncate">
                          {order.id}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-gray2">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 className="h-3.5 w-3.5" />
                            {order.date}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Package className="h-3.5 w-3.5" />
                            {orderType}
                          </span>
                        </div>
                      </div>
                      <span className={`font-display text-[10px] font-extrabold tracking-wide uppercase px-2.5 py-0.5 rounded-md ${bg} ${text}`}>
                        {label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[72px_minmax(0,1fr)] gap-3 items-center">
                      <img
                        src={order.items[0]?.image}
                        alt={order.items[0]?.name}
                        className="w-full h-[80px] sm:h-[72px] rounded-[16px] object-cover bg-gray border border-gray3/20"
                      />
                      <div className="min-w-0">
                        <div className="font-display font-bold text-[14px] leading-tight text-dark truncate">
                          {order.items[0]?.name}
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-gray2">
                          <div className="rounded-[12px] bg-gray px-3 py-2">
                            <div className="uppercase tracking-[0.18em] font-black text-[9px] text-[#888]">Payment</div>
                            <div className="mt-0.5 font-display font-bold text-dark truncate">{order.paymentMethod}</div>
                          </div>
                          <div className="rounded-[12px] bg-gray px-3 py-2">
                            <div className="uppercase tracking-[0.18em] font-black text-[9px] text-[#888]">Items</div>
                            <div className="mt-0.5 font-display font-bold text-dark">{totalItems}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-[11px] text-gray2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-light/40 px-2.5 py-1 font-display font-bold text-blue">
                          {order.items[0]?.size || "One Size"}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray px-2.5 py-1 font-display font-bold text-dark">
                          {order.items[0]?.color || "Default"}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-[10px] font-black uppercase tracking-[0.18em] text-gray2">
                          Total
                        </div>
                        <div className="font-display text-[18px] font-black text-blue">
                          {currencySymbol}
                          {order.total.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-gray3/40 pt-3">
                      <div className="text-[11px] text-gray2">
                        <div className="font-display font-bold text-dark">Fulfillment</div>
                        <div className="mt-0.5">{order.status}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray2" />
                    </div>
                    </div>
                  </ScrollReveal>
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<ShoppingBag className="h-7 w-7" />}
            title="No Orders Yet"
            description="Your order archive is empty right now. Once you place orders, they will show up here with status, payment and date details."
            actionText="Start Shopping"
            onAction={() => navigate("/")}
          />
        )}
      </div>
    </div>
  );
}
