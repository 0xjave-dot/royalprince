import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, MapPin, ChevronRight, AlertCircle, Gift, User, Send } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackButton } from "../../components/layout/BackButton";
import { useCart } from "../../context/CartContext";
import { useSettings } from "../../context/SettingsContext";
import { useToast } from "../../context/ToastContext";
import { decodeSharedBag, encodeSharedBag } from "../../lib/sharedBag";

function renderBagLineItem({
  image,
  name,
  size,
  color,
  qty,
  price,
  currencySymbol,
}: {
  image: string;
  name: string;
  size: string;
  color: string;
  qty: number;
  price: number;
  currencySymbol: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-gray3/40 bg-white p-3">
      <img
        src={image}
        alt={name}
        className="h-[74px] w-[58px] rounded-[14px] object-cover bg-gray flex-shrink-0 border border-black/[0.04]"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="font-display font-extrabold text-[13.5px] text-dark leading-tight line-clamp-1">
              {name}
            </h4>
            <p className="mt-1 font-sans text-[11.5px] text-gray2">
              Size {size} · Qty {qty}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-display font-bold text-[13px] text-dark">
              {currencySymbol}
              {(price * qty).toFixed(2)}
            </div>
            <div className="mt-1 flex items-center justify-end gap-1.5 text-[10px] text-gray2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full border border-gray2/40"
                style={{ backgroundColor: color }}
              />
              <span className="uppercase tracking-[0.18em]">{color}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { pushToast } = useToast();
  const { currencySymbol, userProfile, account, firebaseUser } = useSettings();
  const { items, appliedVoucher, subtotal, discountAmount, shippingFee, total, replaceCart } = useCart();
  const [checkoutMode, setCheckoutMode] = useState<"self" | "gift">("self");
  const [giftRecipientName, setGiftRecipientName] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [isSharingBag, setIsSharingBag] = useState(false);
  const [sharedWithLovedOne, setSharedWithLovedOne] = useState(false);
  const sharedBagParam = searchParams.get("s") || searchParams.get("bag") || "";
  const sharedBagPayload = useMemo(
    () => (sharedBagParam ? decodeSharedBag(sharedBagParam) : null),
    [sharedBagParam]
  );
  const importedBagRef = useRef<string | null>(null);
  const sharedBagItems = sharedBagPayload?.items ?? items;
  const isSharedBagCheckout = Boolean(sharedBagPayload?.items?.length);

  const defaultAddress = account.shippingAddresses.items.find((address) => address.isDefault) ?? account.shippingAddresses.items[0];
  const isGuest = !firebaseUser;
  const shareBagUrl = useMemo(
    () => `${window.location.origin}/checkout?share=1&s=${encodeSharedBag(items, checkoutMode)}`,
    [checkoutMode, items]
  );
  const bagShareText = useMemo(() => `Open this bag: ${shareBagUrl}`, [shareBagUrl]);

  useEffect(() => {
    if (!sharedBagPayload?.items?.length) {
      return;
    }

    if (importedBagRef.current === sharedBagParam) {
      return;
    }

    replaceCart(sharedBagPayload.items, null);

    if (sharedBagPayload.checkoutMode) {
      setCheckoutMode(sharedBagPayload.checkoutMode);
    }

    if (sharedBagPayload.giftRecipientName) {
      setGiftRecipientName(sharedBagPayload.giftRecipientName);
    }

    if (sharedBagPayload.giftMessage) {
      setGiftMessage(sharedBagPayload.giftMessage);
    }

    setSharedWithLovedOne(true);
    importedBagRef.current = sharedBagParam;
    pushToast("Shared bag loaded.");
  }, [pushToast, replaceCart, sharedBagParam, sharedBagPayload]);

  if (items.length === 0) {
    return (
      <div className="p-5 text-center flex flex-col justify-center items-center h-[50vh]">
        <h3 className="title-md font-display">No items to checkout</h3>
        <button onClick={() => navigate("/")} className="btn-primary mt-4">
          Browse items
        </button>
      </div>
    );
  }

  const handlePayment = () => {
    if (checkoutMode === "gift" && !giftRecipientName.trim()) {
      pushToast("Please add the gift recipient's name before continuing.");
      return;
    }

    pushToast(
      isGuest
        ? "Continuing as guest to the demo payment step."
        : "Reviewing order and continuing to the demo payment step."
    );
    navigate("/checkout/processing", {
      state: {
        checkoutMode,
        giftRecipientName: giftRecipientName.trim(),
        giftMessage: giftMessage.trim(),
        sharedWithLovedOne,
      },
    });
  };

  const handleSignIn = () => {
    navigate("/login", {
      state: {
        returnTo: `${location.pathname}${location.search}`,
      },
    });
  };

  const handleShareBag = async () => {
    const text = bagShareText;

    if (navigator.share) {
      try {
        setIsSharingBag(true);
        await navigator.share({
          title: "Royal Prince Fashion bag",
          text,
          url: shareBagUrl,
        });
        setSharedWithLovedOne(true);
        return;
      } catch {
        // Fall through to clipboard.
      } finally {
        setIsSharingBag(false);
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setSharedWithLovedOne(true);
      pushToast("Bag summary copied to clipboard.");
    } catch {
      pushToast("Could not share your bag right now.");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white animate-fade-up-enter min-h-screen pb-10">
      <PageHeader title="Checkout" left={<BackButton />} />

      <div className="p-4 sm:p-5 lg:p-6 xl:p-8 flex-1">
        <div className="mx-auto w-full max-w-6xl grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_420px] items-start">
          <div className="space-y-6">
            {isSharedBagCheckout && (
              <div className="rounded-[28px] border border-blue/15 bg-blue-light/20 shadow-subtle overflow-hidden">
                <div className="border-b border-blue/10 px-5 py-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-black text-sm tracking-tight text-dark">
                      Shared bag preview
                    </h3>
                    <p className="font-sans text-xs text-gray2 mt-1">
                      This checkout was opened from a shared bag link. Review the items below before continuing.
                    </p>
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-blue">
                    {sharedBagItems.reduce((sum, item) => sum + item.qty, 0)} items
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  {sharedBagItems.map((item) => (
                    <div key={`${item.productId}-${item.size}-${item.color}`}>
                      {renderBagLineItem({
                        image: item.image,
                        name: item.name,
                        size: item.size,
                        color: item.color,
                        qty: item.qty,
                        price: item.price,
                        currencySymbol,
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-[28px] border border-black/[0.05] bg-white shadow-subtle overflow-hidden">
              <div className="border-b border-gray3/30 px-5 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-sm tracking-tight text-dark">
                    Shipping Address
                  </h3>
                  <p className="font-sans text-xs text-gray2 mt-1">
                    {isGuest
                      ? "Continue as guest and add delivery details in the next step."
                      : "Confirm the delivery address before completing the order."}
                  </p>
                </div>
                {!isGuest ? (
                  <button
                    onClick={() => navigate("/settings/shipping-address")}
                    className="text-[12.5px] font-display font-bold text-blue hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                ) : (
                  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#888]">Guest</span>
                )}
              </div>
              <div
                onClick={() => !isGuest && navigate("/settings/shipping-address")}
                className={`p-5 flex items-start gap-4 transition-colors ${isGuest ? "cursor-default" : "cursor-pointer hover:bg-gray/40"}`}
              >
                <div className="w-[42px] h-[42px] bg-blue-light/50 rounded-std flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4.5 h-4.5 text-blue" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display font-extrabold text-[15px] text-dark">
                    {isGuest ? "Guest checkout" : defaultAddress?.name || userProfile.name || "Add shipping address"}
                  </div>
                  <p className="font-sans text-sm text-gray2 leading-relaxed mt-1">
                    {isGuest
                      ? "You can complete the demo order without signing in. Delivery details can be captured in the next step."
                      : defaultAddress
                        ? defaultAddress.street
                        : "Tap to add a shipping address so this order can be delivered."}
                  </p>
                </div>
                {!isGuest ? <ChevronRight className="w-4 h-4 text-gray2 self-center" /> : null}
              </div>
            </div>

            <div className="rounded-[28px] border border-black/[0.05] bg-white shadow-subtle overflow-hidden">
              <div className="border-b border-gray3/30 px-5 py-4">
                <h3 className="font-display font-black text-sm tracking-tight text-dark">
                  Payment Preview
                </h3>
                <p className="font-sans text-xs text-gray2 mt-1">
                  This build simulates the payment flow you will wire to Paystack later.
                </p>
              </div>
              <div className="p-5">
                <div className="rounded-[22px] bg-[#0f172a] text-white p-5 sm:p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                  <div className="relative flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-[11px] font-display font-bold uppercase tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Demo checkout
                      </div>
                      <h4 className="font-display font-black text-[22px] sm:text-[24px] mt-4 leading-tight">
                        Clean, premium handoff
                      </h4>
                      <p className="font-sans text-sm text-white/70 leading-relaxed mt-3 max-w-[420px]">
                        The live version can hand off to Paystack. For now, we keep the demo honest and finish with a confirmed order summary.
                      </p>
                    </div>
                    <div className="hidden sm:flex w-[84px] h-[84px] rounded-[22px] bg-white/10 items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-10 h-10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-black/[0.05] bg-white shadow-subtle overflow-hidden">
              <div className="border-b border-gray3/30 px-5 py-4">
                <h3 className="font-display font-black text-sm tracking-tight text-dark">
                  Order Summary
                </h3>
              </div>
              <div className="p-5 space-y-3.5">
                <div className="flex justify-between items-center text-[13.5px]">
                  <span className="font-sans text-gray2">{items.length} items</span>
                  <span className="font-display font-bold text-dark">
                    {currencySymbol}
                    {subtotal.toFixed(2)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-[13.5px]">
                    <span className="font-sans text-gray2">
                      Discount {appliedVoucher ? `(${appliedVoucher.code})` : ""}
                    </span>
                    <span className="font-display font-bold text-red">
                      -{currencySymbol}
                      {discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-[13.5px]">
                  <span className="font-sans text-gray2">Shipping</span>
                  <span className={`font-display font-bold ${shippingFee === 0 ? "text-blue" : "text-dark"}`}>
                    {shippingFee === 0 ? "FREE" : `${currencySymbol}${shippingFee.toFixed(2)}`}
                  </span>
                </div>

                <div className="divider h-[1px] bg-gray3 my-1" />

                <div className="flex justify-between items-center text-dark">
                  <span className="font-display font-bold text-sm">Total Price</span>
                  <span className="price text-[19px] text-blue font-display">
                    {currencySymbol}
                    {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-6 space-y-4">
            <div className="rounded-[28px] border border-black/[0.05] bg-[#f8f8f8] p-5 shadow-subtle">
              <p className="font-display font-black text-[10.5px] text-[#c7c7c7] tracking-wider uppercase">
                Ready to pay
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="w-11 h-11 rounded-std bg-white flex items-center justify-center border border-black/5">
                  <ShieldCheck className="w-5 h-5 text-blue" />
                </div>
                <div>
                  <div className="font-display font-extrabold text-dark">Demo payment</div>
                  <p className="font-sans text-xs text-gray2 mt-0.5">
                    Confirmed in the app, then ready for Paystack wiring.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-black/[0.05] bg-white p-5 shadow-subtle">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-std bg-blue-light/40 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-5 h-5 text-blue" />
                </div>
                <div className="min-w-0">
                  <div className="font-display font-extrabold text-dark">Checkout mode</div>
                  <p className="font-sans text-xs text-gray2 mt-0.5">
                    Choose whether this bag is for you or being sent as a gift.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutMode("self")}
                  className={`rounded-[16px] border px-3 py-3 text-left transition-all cursor-pointer ${
                    checkoutMode === "self"
                      ? "border-blue bg-blue-light/40"
                      : "border-gray3 bg-white hover:bg-gray/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className={`h-4 w-4 ${checkoutMode === "self" ? "text-blue" : "text-gray2"}`} />
                    <span className="font-display text-[13px] font-bold text-dark">For myself</span>
                  </div>
                  <p
                    className={`mt-1 text-[11px] ${
                      checkoutMode === "self" ? "text-[#404040]" : "text-[#5a5a5a]"
                    }`}
                  >
                    Standard checkout for your own order.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setCheckoutMode("gift")}
                  className={`rounded-[16px] border px-3 py-3 text-left transition-all cursor-pointer ${
                    checkoutMode === "gift"
                      ? "border-blue bg-blue-light/40"
                      : "border-gray3 bg-white hover:bg-gray/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Gift className={`h-4 w-4 ${checkoutMode === "gift" ? "text-blue" : "text-gray2"}`} />
                    <span className="font-display text-[13px] font-bold text-dark">As a gift</span>
                  </div>
                  <p
                    className={`mt-1 text-[11px] ${
                      checkoutMode === "gift" ? "text-[#404040]" : "text-[#5a5a5a]"
                    }`}
                  >
                    Package it for someone special.
                  </p>
                </button>
              </div>

              {checkoutMode === "gift" && (
                <div className="mt-4 space-y-3">
                  <label className="block">
                    <span className="mb-1.5 block font-display text-xs font-bold text-dark">Gift recipient name</span>
                    <input
                      value={giftRecipientName}
                      onChange={(e) => setGiftRecipientName(e.target.value)}
                      placeholder="Who is this for?"
                      className="w-full h-[48px] rounded-[14px] border border-gray3 bg-[#fbfbfb] px-4 font-sans text-sm outline-none transition focus:border-blue/30 focus:bg-white"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block font-display text-xs font-bold text-dark">Gift message</span>
                    <textarea
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      placeholder="Write a short note to the recipient"
                      rows={3}
                      className="w-full rounded-[14px] border border-gray3 bg-[#fbfbfb] px-4 py-3 font-sans text-sm outline-none transition focus:border-blue/30 focus:bg-white resize-none"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="rounded-[28px] border border-black/[0.05] bg-white p-5 shadow-subtle">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-std bg-[#0f172a] flex items-center justify-center flex-shrink-0 text-white">
                  <Send className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-display font-extrabold text-dark">Share bag</div>
                  <p className="font-sans text-xs text-gray2 mt-0.5">
                    Send your cart to someone who wants to pay for it.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleShareBag}
                disabled={isSharingBag}
                className="mt-4 w-full h-[52px] rounded-std border border-blue/15 bg-blue-light/30 font-display font-bold text-blue transition hover:bg-blue-light/50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSharingBag ? "Preparing share..." : sharedWithLovedOne ? "Bag shared" : "Share shopping bag"}
              </button>
            </div>

            <div className="rounded-[28px] border border-black/[0.05] bg-white shadow-subtle overflow-hidden">
              <div className="border-b border-gray3/30 px-5 py-4">
                <h3 className="font-display font-black text-sm tracking-tight text-dark">
                  Items in this order
                </h3>
                <p className="font-sans text-xs text-gray2 mt-1">
                  A visual check of what will be paid for.
                </p>
              </div>
              <div className="p-5 space-y-3">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`}>
                    {renderBagLineItem({
                      image: item.image,
                      name: item.name,
                      size: item.size,
                      color: item.color,
                      qty: item.qty,
                      price: item.price,
                      currencySymbol,
                    })}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handlePayment}
              className="btn-primary w-full h-[58px] bg-blue text-white rounded-std text-[15px] font-display font-extrabold shadow-std active:scale-[0.98] transition-transform flex items-center justify-center cursor-pointer"
            >
              {isGuest ? "Continue as Guest" : "Complete Order"}
            </button>

            {isGuest && (
              <div className="text-center -mt-1">
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="font-display text-[12.5px] font-bold text-blue hover:underline cursor-pointer"
                >
                  Or sign in
                </button>
              </div>
            )}

            <div className="rounded-[20px] border border-amber-200 bg-amber-50 p-4 text-[12px] text-amber-900 flex gap-3">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="font-sans leading-relaxed">
                This is a demo build. Add your live Paystack keys and webhook verification before going public.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
