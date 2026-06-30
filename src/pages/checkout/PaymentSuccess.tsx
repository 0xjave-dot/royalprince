import { useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useOrders } from "../../context/OrdersContext";
import { useSettings } from "../../context/SettingsContext";
import { getGuestOrder } from "../../lib/guestOrders";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const { getOrderById } = useOrders();
  const { currencySymbol } = useSettings();

  const order = useMemo(() => {
    return getOrderById(orderId) ?? getGuestOrder(orderId);
  }, [orderId, getOrderById]);

  const displayId = order?.id ?? "#SHP-PENDING";
  const displayTotal = order?.total ?? 0;
  const displayEst = order?.estDelivery ?? "Delivery details pending";
  const paymentLabel = order?.paymentMethod ?? "Paystack";
  const checkoutLabel = order?.checkoutMode === "gift"
    ? `Gift for ${order.giftRecipientName || "someone special"}`
    : "For yourself";

  return (
    <div className="flex-1 flex flex-col bg-white justify-center items-center p-6 text-center animate-fade-up-enter min-h-screen">
      <div className="flex-1 flex flex-col justify-center items-center max-w-[320px] w-full py-8">
        <div className="w-[110px] h-[110px] rounded-full bg-[#e8f5e9] flex items-center justify-center mb-6 shadow-[0_0_0_12px_#edfbf2] animate-[scale_0.3s_ease]">
          <CheckCircle2 className="w-16 h-16 text-[#2e7d32]" strokeWidth={1.5} />
        </div>

        <h2 className="font-display font-black text-[26px] text-dark tracking-tight leading-tight mb-2">
          Payment Successful!
        </h2>
        <p className="font-sans text-[13px] text-gray2 leading-relaxed mb-1">
          {paymentLabel} payment has been confirmed.
        </p>

        <div className="price text-[28px] text-blue font-display mt-2 mb-6">
          {currencySymbol}
          {displayTotal.toFixed(2)}
        </div>

        <div className="bg-gray rounded-std p-4 border border-black/[0.03] w-full text-left space-y-3.5 mb-8">
          <div className="flex justify-between items-center text-xs gap-4">
            <span className="font-sans text-gray2 flex-shrink-0">Checkout</span>
            <span className="font-display font-bold text-dark text-right leading-tight max-w-[150px]">
              {checkoutLabel}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="font-sans text-gray2">Order ID</span>
            <span className="font-display font-bold text-dark">{displayId}</span>
          </div>

          {order?.sharedWithLovedOne && (
            <div className="flex justify-between items-center text-xs gap-4">
              <span className="font-sans text-gray2 flex-shrink-0">Shared</span>
              <span className="font-display font-bold text-dark text-right leading-tight max-w-[150px]">
                Loved one payment link sent
              </span>
            </div>
          )}

          <div className="flex justify-between items-start text-xs gap-4">
            <span className="font-sans text-gray2 flex-shrink-0">Est. Delivery</span>
            <span className="font-display font-bold text-dark text-right leading-tight max-w-[150px]">
              {displayEst}
            </span>
          </div>
        </div>

        <div className="w-full space-y-3">
          {order ? (
            orderId.startsWith("GST-") ? (
              <button
                onClick={() => navigate("/")}
                className="btn-primary w-full h-[54px] bg-blue text-white rounded-std text-[14.5px] font-display font-bold shadow-std active:scale-[0.98] transition-transform flex items-center justify-center cursor-pointer"
              >
                Continue Shopping
              </button>
            ) : (
              <button
                onClick={() => navigate("/orders")}
                className="btn-primary w-full h-[54px] bg-blue text-white rounded-std text-[14.5px] font-display font-bold shadow-std active:scale-[0.98] transition-transform flex items-center justify-center cursor-pointer"
              >
                Track My Order
              </button>
            )
          ) : null}

          <button
            onClick={() => navigate("/")}
            className="w-full text-center text-xs font-display font-bold text-blue hover:underline cursor-pointer py-1"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
