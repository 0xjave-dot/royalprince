import { PageHeader } from "../../components/layout/PageHeader";
import { BackButton } from "../../components/layout/BackButton";
import { vouchers } from "../../data/vouchers";
import { useToast } from "../../context/ToastContext";
import { Copy, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function Vouchers() {
  const { pushToast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    pushToast(`Copied coupon: ${code}! 🎟️`);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  return (
    <div className="flex-grow flex flex-col bg-white animate-fade-up-enter min-h-screen pb-10">
      <PageHeader title="My Vouchers" left={<BackButton />} />

      <div className="p-5 space-y-4.5">
        {vouchers.map((v) => {
          const isCopied = copiedCode === v.code;
          return (
            <div
              key={v.code}
              className="voucher-coupon relative rounded-std border-2 border-dashed border-[#e0e0e0] overflow-hidden bg-gray p-4 flex items-center justify-between shadow-subtle group hover:border-blue transition-colors"
            >
              <div className="flex-1 text-left select-none pr-3">
                <span className="bg-blue-light text-blue text-[10px] font-extrabold px-2 py-0.5 rounded-[4px] font-display uppercase tracking-wider block w-max mb-1.5">
                  {v.discountType === "freeshipping" ? "FREE SHIPPING" : `${v.value}% OFF`}
                </span>
                <h4 className="font-display font-extrabold text-[15px] text-dark leading-tight">
                  {v.code}
                </h4>
                <p className="font-sans text-xs text-gray2 leading-relaxed mt-1">{v.description}</p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleCopyCode(v.code)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer focus:outline-none ${
                  isCopied
                    ? "bg-green text-white"
                    : "bg-white hover:bg-blue-light/20 text-gray2 hover:text-blue border border-gray3/30"
                }`}
              >
                {isCopied ? (
                  <CheckCircle className="w-5 h-5 text-[#2e7d32]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
