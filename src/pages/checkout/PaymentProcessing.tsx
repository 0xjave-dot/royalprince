import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrdersContext";
import { useSettings } from "../../context/SettingsContext";
import { useToast } from "../../context/ToastContext";
import type { Order } from "../../lib/userAccount";
import { saveGuestOrder } from "../../lib/guestOrders";

export default function PaymentProcessing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pushToast } = useToast();
  const { items, subtotal, discountAmount, shippingFee, total, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { firebaseUser, userProfile } = useSettings();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalTime = 35;
    const totalSteps = 2000 / intervalTime;
    const stepIncrement = 100 / totalSteps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + stepIncrement;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress < 100) {
      return;
    }

    const finalizePayment = async () => {
      if (items.length === 0) {
        navigate("/");
        return;
      }

      const shippingAddress = {
        id: "demo-address",
        tag: "Saved",
        name: "Saved shipping address",
        street: "Managed in Shipping Address",
        cityStateCountry: "Update your address to confirm delivery details.",
        isDefault: true,
      };

      const checkoutState = (location.state as {
        checkoutMode?: "self" | "gift";
        giftRecipientName?: string;
        giftMessage?: string;
        sharedWithLovedOne?: boolean;
      } | null) ?? null;
      const checkoutMode = checkoutState?.checkoutMode ?? "self";
      const giftRecipientName = checkoutState?.giftRecipientName ?? "";
      const giftMessage = checkoutState?.giftMessage ?? "";
      const sharedWithLovedOne = Boolean(checkoutState?.sharedWithLovedOne);

      const orderPayload: Omit<Order, "id" | "date" | "estDelivery"> = {
        items,
        subtotal,
        discount: discountAmount,
        shippingFee,
        total,
        status: "placed",
        shippingAddress,
        paymentMethod: "Paystack demo",
        checkoutMode,
        giftRecipientName,
        giftMessage,
        sharedWithLovedOne,
      };

      const createdOrder = firebaseUser
        ? placeOrder(orderPayload)
        : ({
            ...orderPayload,
            id: `GST-${Date.now()}`,
            date: new Date().toLocaleString(),
            estDelivery: "Delivery details pending",
          } as Order);

      if (!firebaseUser) {
        saveGuestOrder({
          ...createdOrder,
          shippingAddress: {
            ...createdOrder.shippingAddress,
            name: userProfile.name || "Guest checkout",
            street: createdOrder.shippingAddress.street || "Guest shipping details",
          },
        });
      }

      clearCart();
      pushToast(firebaseUser ? "Order recorded. Ready for the live payment handoff." : "Guest order recorded. You can continue without signing in.");
      navigate(`/checkout/success?orderId=${createdOrder.id}`);
    };

    void finalizePayment();
  }, [progress, items, subtotal, discountAmount, shippingFee, total, placeOrder, clearCart, pushToast, navigate, firebaseUser, userProfile.name, location.state]);

  return (
    <div className="flex-1 flex flex-col bg-white justify-center items-center p-6 text-center animate-fade-up-enter min-h-screen">
      <div className="flex-1 max-w-[320px] flex flex-col justify-center items-center">
        <div className="w-[104px] h-[104px] rounded-full bg-blue-light/50 flex items-center justify-center mb-6 shadow-[0_0_0_12px_rgba(0,76,255,0.06)]">
          <ShieldCheck className="w-10 h-10 text-blue" />
        </div>

        <h2 className="font-display font-black text-[24px] text-dark tracking-tight mb-2">
          Finalizing order
        </h2>
        <p className="font-sans text-[13px] text-gray2 leading-relaxed mb-8">
          This prototype simulates the payment handoff and records the order in your account.
        </p>

        <div className="w-full h-1.5 bg-gray3 rounded-full overflow-hidden mb-3">
          <div className="h-full bg-blue rounded-full transition-all duration-75 ease-out" style={{ width: `${progress}%` }} />
        </div>

        <div className="font-display font-bold text-xs text-blue">
          {Math.round(progress)}% complete
        </div>
      </div>
    </div>
  );
}
