import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, Ticket, ChevronRight, ShoppingBag } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { VoucherSheet } from "../../components/common/VoucherSheet";
import { useCart } from "../../context/CartContext";
import { useSettings } from "../../context/SettingsContext";
import { useToast } from "../../context/ToastContext";

export default function Cart() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const { currencySymbol } = useSettings();
  const {
    items,
    updateQty,
    removeItem,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    itemCount
  } = useCart();

  const [isVoucherOpen, setIsVoucherOpen] = useState(false);

  // Apply voucher handler
  const handleApplyVoucher = (code: string): boolean => {
    const success = applyVoucher(code);
    if (success) {
      pushToast(`Applied voucher: ${code.toUpperCase()}! 🎉`);
    } else {
      pushToast("Invalid voucher code");
    }
    return success;
  };

  return (
    <div className="flex-grow flex flex-col bg-white animate-fade-up-enter pb-10">
      <PageHeader
        title="My Bag"
        right={
          <div className="relative p-1">
            <ShoppingBag className="w-5 h-5 text-dark" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-red text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
        }
      />

      {/* Bag Body */}
      {items.length > 0 ? (
        <div className="flex-1 p-5 space-y-5">
          {/* Items Feed list */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex gap-4.5 py-4 border-b border-[#f0f0f0] items-center animate-fade-up-enter"
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-[92px] rounded-std object-cover bg-gray border border-gray3/20 flex-shrink-0"
                />

                {/* Info and quantity counters */}
                <div className="flex-1 flex flex-col justify-between h-[92px]">
                  <div>
                    <h4 className="font-display font-bold text-[14.5px] text-dark leading-tight line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="font-sans text-xs text-gray2 mt-1">
                      Size: {item.size} &middot; Color:{" "}
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full border border-gray2/40 align-middle"
                        style={{ backgroundColor: item.color }}
                      />
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <span className="price text-blue text-[15px] font-display">
                      {currencySymbol}
                      {(item.price * item.qty).toFixed(2)}
                    </span>

                    {/* Quantity selectors */}
                    <div className="flex items-center gap-3 bg-gray rounded-full px-2.5 py-1">
                      <button
                        onClick={() => updateQty(item.productId, item.size, item.color, item.qty - 1)}
                        className="p-1 hover:opacity-75 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer"
                      >
                        <Minus className="w-3 h-3 text-dark" strokeWidth={2.5} />
                      </button>
                      <span className="font-display font-bold text-xs text-dark w-4 text-center select-none">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.productId, item.size, item.color, item.qty + 1)}
                        className="p-1 hover:opacity-75 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-dark" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => {
                    removeItem(item.productId, item.size, item.color);
                    pushToast("Removed from bag");
                  }}
                  className="p-2 text-gray2 hover:text-red hover:bg-[#fff0f3] rounded-full active:scale-90 transition-all focus:outline-none cursor-pointer"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Voucher Bar */}
          <div
            onClick={() => setIsVoucherOpen(true)}
            className="voucher-card border-1.5 border-dashed border-blue rounded-std p-4 flex items-center gap-3 bg-blue-light cursor-pointer select-none active:scale-[0.99] transition-all hover:bg-blue-light/75"
          >
            <div className="voucher-icon w-11 h-11 rounded-std bg-blue flex items-center justify-center text-[20px] text-white">
              <Ticket className="w-5.5 h-map-5.5 text-white" />
            </div>
            <div className="flex-1">
              <div className="title-sm font-display font-bold text-[14.5px] leading-tight text-dark">
                {appliedVoucher ? `Coupon: ${appliedVoucher.code}` : "Add Voucher"}
              </div>
              <p className="body-sm text-[11.5px]">
                {appliedVoucher ? appliedVoucher.description : "Apply vouchers for supreme discounts"}
              </p>
            </div>
            {appliedVoucher ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeVoucher();
                  pushToast("Voucher removed");
                }}
                className="text-xs font-bold text-red hover:underline z-10"
              >
                Clear
              </button>
            ) : (
              <ChevronRight className="w-5 h-5 text-blue ml-auto" />
            )}
          </div>

          {/* Dynamic math totals */}
          <div className="bg-gray rounded-std p-4.5 space-y-3.5 border border-black/[0.03]">
            <div className="flex justify-between items-center text-[13.5px]">
              <span className="font-sans text-gray2">Subtotal</span>
              <span className="font-display font-bold text-dark">
                {currencySymbol}
                {subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center text-[13.5px]">
              <span className="font-sans text-gray2">Discount</span>
              <span className="font-display font-bold text-red">
                -{currencySymbol}
                {discountAmount.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center text-[13.5px]">
              <span className="font-sans text-gray2">Shipping</span>
              <span className={`font-display font-bold ${shippingFee === 0 ? "text-blue" : "text-dark"}`}>
                {shippingFee === 0 ? (
                  "FREE"
                ) : (
                  `${currencySymbol}${shippingFee.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="divider h-[1px] bg-gray3 my-1" />

            <div className="flex justify-between items-center text-dark">
              <span className="font-display font-bold text-sm">Total</span>
              <span className="price text-[19px] text-blue font-display">
                {currencySymbol}
                {total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* CTA Footer navigation button */}
          <div className="pt-2">
            <button
              onClick={() => navigate("/checkout")}
              className="btn-primary w-full h-[58px] bg-blue text-white rounded-std text-[15px] font-display font-extrabold shadow-std active:scale-[0.98] transition-transform flex items-center justify-center cursor-pointer"
            >
              Proceed to Checkout — {currencySymbol}
              {total.toFixed(2)}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <EmptyState
            icon={<ShoppingBag className="h-7 w-7" />}
            title="Your Bag is Empty"
            description="Looks like you haven't added anything to your bag yet."
            actionText="Get back to shopping"
            onAction={() => navigate("/")}
          />
        </div>
      )}

      {/* Embedded Voucher modal sheet */}
      <VoucherSheet
        isOpen={isVoucherOpen}
        onClose={() => setIsVoucherOpen(false)}
        onApplyVoucher={handleApplyVoucher}
      />
    </div>
  );
}
