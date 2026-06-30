import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Map, MapPin, Truck, Box, Check, FileCheck } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackButton } from "../../components/layout/BackButton";
import { useOrders } from "../../context/OrdersContext";

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById } = useOrders();

  const order = useMemo(() => {
    return getOrderById(id || "");
  }, [id, getOrderById]);

  if (!order) {
    return (
      <div className="p-5 text-center flex flex-col justify-center items-center h-[50vh]">
        <h3 className="title-md font-display">Order Not Found</h3>
        <button onClick={() => navigate("/orders")} className="btn-primary mt-4">
          View Activity
        </button>
      </div>
    );
  }

  // Determine active stages for checklist
  const statsList = ["placed", "processing", "shipped", "out_for_delivery", "delivered"];
  const currentStepIndex = statsList.indexOf(order.status);

  const steps = [
    {
      id: "placed",
      title: "Order Placed",
      time: order.date,
      desc: "We received your order and are spinning up processing details."
    },
    {
      id: "processing",
      title: "Processing Wardrobe",
      time: "Awaiting standard fabric cuts and custom tailoring confirmation.",
      desc: "Items packaged at our primary fulfillment center."
    },
    {
      id: "shipped",
      title: "Shipped via FedEx",
      time: "Tracking Number: FEDEX-94829",
      desc: "Package left our logistics depot."
    },
    {
      id: "out_for_delivery",
      title: "Out for Delivery",
      time: "Expected arrival shortly within lookbook frame.",
      desc: "Nearby courier is on route to your doorstep."
    },
    {
      id: "delivered",
      title: "Delivered",
      time: "Package dropped off securely.",
      desc: "Delivered at front porch."
    }
  ];

  return (
    <div className="flex-grow flex flex-col bg-white animate-fade-up-enter min-h-screen pb-10">
      <PageHeader title="Track Order" left={<BackButton />} />

      {/* Dynamic maps decor */}
      <div className="p-5 space-y-5">
        {/* Unsplash map placeholder backdrop */}
        <div className="delivery-map w-full h-[180px] bg-gradient-to-br from-[#dfe9ff] to-blue-light/30 rounded-std flex items-center justify-center relative overflow-hidden select-none border border-black/5">
          <div className="absolute inset-0 opacity-40">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
              alt="Map outline"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-[58px] h-[52px] bg-white rounded-xl shadow-std flex items-center justify-center relative z-10 animate-bounce">
            <Truck className="w-6 h-6 text-blue" />
          </div>
          <div className="absolute bottom-3 left-3 bg-[#202020]/90 text-white rounded-lg text-[10px] font-display font-semibold px-2 py-1 flex items-center gap-1.5 backdrop-blur-xs select-none">
            <Map className="w-3.5 h-3.5 text-blue" />
            <span>Map View</span>
          </div>
        </div>

        {/* Card info */}
        <div className="bg-gray p-4 rounded-std border border-black/[0.03] space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="font-sans text-gray2 font-medium">Estimated Arrival</span>
            <span className="font-display font-extrabold text-blue">{order.estDelivery}</span>
          </div>
        </div>

        <h3 className="font-display font-bold text-sm text-dark mb-2 mt-4 px-1">Progression Log</h3>

        {/* Dynamic Timeline Checkpoints */}
        <div className="space-y-0.5 relative pl-3 select-none">
          {steps.map((st, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={st.id} className="order-step flex gap-4 pt-1 relative pb-6">
                {/* Vertical continuous pipe */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-4 top-8 bottom-0 w-[2px] ${
                      index < currentStepIndex ? "bg-blue" : "bg-gray3"
                    }`}
                  />
                )}

                {/* Ring or check checkpoint */}
                <div
                  className={`step-dot w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 border-2 font-display text-[13.5px] font-bold ${
                    isCompleted
                      ? "bg-blue border-blue text-white"
                      : "bg-white border-gray3 text-[#aaa]"
                  } ${isCurrent ? "animate-pulse shadow-md border-blue" : ""}`}
                >
                  {isCompleted ? <Check className="w-4 h-4 text-white" strokeWidth={2.5} /> : index + 1}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 pt-0.5 text-left">
                  <h4
                    className={`font-display text-[14.5px] font-bold ${
                      isCompleted ? "text-dark" : "text-gray2"
                    }`}
                  >
                    {st.title}
                  </h4>
                  <p className="font-sans text-xs text-[#555] line-clamp-1 mt-0.5">{st.desc}</p>
                  {(isCompleted || isCurrent) && st.time && (
                    <span className="inline-block font-sans text-[10.5px] text-[#999] leading-tight mt-1 border border-gray3/30 px-2 py-0.5 bg-gray rounded-md">
                      {st.time}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
