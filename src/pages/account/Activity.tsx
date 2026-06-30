import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ChevronRight, MessageSquare, Compass } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackButton } from "../../components/layout/BackButton";
import { EmptyState } from "../../components/common/EmptyState";
import { useOrders } from "../../context/OrdersContext";
import type { Order } from "../../lib/userAccount";
import { useSettings } from "../../context/SettingsContext";

const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=2348028598695";

export default function Activity() {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { currencySymbol } = useSettings();

  // Selected tab state: "active" (placed, processing, shipped, out_for_delivery) vs "history" (delivered)
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  const filteredOrders = useMemo(() => {
    if (activeTab === "active") {
      return orders.filter((o) => o.status !== "delivered");
    } else {
      return orders.filter((o) => o.status === "delivered");
    }
  }, [orders, activeTab]);

  const getStatusLabelAndColor = (status: Order["status"]) => {
    switch (status) {
      case "placed":
        return { label: "Placing Order", bg: "bg-[#e0e8ff]", text: "text-blue" };
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
  };

  return (
    <div className="flex-1 flex flex-col bg-white animate-fade-up-enter min-h-screen pb-10">
      <PageHeader title="My Activity" left={<BackButton />} />

      <div className="p-5 flex-1 flex flex-col">
        {/* Toggle tabs */}
        <div className="flex gap-2 mb-5 select-none bg-gray p-1 rounded-std border border-black/5">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-2 font-display text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "active"
                ? "bg-white text-blue shadow-sm"
                : "text-gray2 bg-transparent hover:text-dark"
            }`}
          >
            Active Orders ({orders.filter((o) => o.status !== "delivered").length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-2 font-display text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "history"
                ? "bg-white text-blue shadow-sm"
                : "text-gray2 bg-transparent hover:text-dark"
            }`}
          >
            Delivered History ({orders.filter((o) => o.status === "delivered").length})
          </button>
        </div>

        {/* List of orders */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((ord) => {
              const { label, bg, text } = getStatusLabelAndColor(ord.status);
              const totalItems = ord.items.reduce((sum, item) => sum + item.qty, 0);

              const handleCardClick = () => {
                if (ord.status === "delivered") {
                  navigate(`/orders/${ord.items[0].productId}/review`);
                } else {
                  navigate(`/orders/${ord.id}/track`);
                }
              };

              return (
                <div
                  key={ord.id}
                  onClick={handleCardClick}
                  className="hist-item bg-white rounded-std border border-black/[0.04] p-4.5 shadow-subtle cursor-pointer hover:shadow-std transition-all flex flex-col select-none"
                >
                  {/* Top Bar item */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-display font-extrabold text-[12.5px] text-dark">
                      {ord.id}
                    </span>
                    <span
                      className={`font-display text-[10px] font-extrabold tracking-wide uppercase px-2.5 py-0.5 rounded-md ${bg} ${text}`}
                    >
                      {label}
                    </span>
                  </div>

                  {/* Thumbnail Row */}
                  <div className="flex gap-3 items-center">
                    <img
                      src={ord.items[0].image}
                      alt={ord.items[0].name}
                      className="w-12 h-[54px] rounded-lg object-cover bg-gray border border-gray3/20 flex-shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <div className="font-display font-bold text-[14px] leading-tight text-dark truncate">
                        {ord.items[0].name}
                      </div>
                      <p className="font-sans text-[11px] text-gray2 leading-tight mt-1 truncate">
                        {totalItems > 1 ? `and ${totalItems - 1} more garments` : "1 item pack"}
                      </p>
                    </div>
                    <div className="price text-blue font-display text-[15px]">
                      {currencySymbol}
                      {ord.total.toFixed(2)}
                    </div>
                  </div>

                  <div className="divider h-[1px] bg-gray3 my-3" />

                  {/* Footer CTAs */}
                  <div className="flex gap-2.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.assign(WHATSAPP_URL);
                      }}
                      className="btn-outline h-9.5 flex-grow font-display text-xs font-bold border-blue text-blue rounded-[9px] cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat Support</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick();
                      }}
                      className="btn-primary h-9.5 flex-grow font-display text-xs font-bold bg-blue text-white rounded-[9px] cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>{ord.status === "delivered" ? "Draft Review" : "Track Order"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center py-10">
            {activeTab === "active" ? (
              <EmptyState
                emoji="🚚"
                title="No Active Shipments"
                description="We found no active orders in transit. Fill your wardrobe to initialize delivery trackers!"
                actionText="Explore Fashion"
                onAction={() => navigate("/")}
              />
            ) : (
              <EmptyState
                emoji="📦"
                title="Empty History"
                description="Your past order catalogs are currently a blank canvas. Discover timeless attire lists."
                actionText="Shop Trends"
                onAction={() => navigate("/")}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
