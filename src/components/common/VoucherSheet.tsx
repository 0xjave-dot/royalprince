import { useState } from "react";
import { X, Ticket } from "lucide-react";
import { vouchers } from "../../data/vouchers";

interface VoucherSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVoucher: (code: string) => boolean;
}

export function VoucherSheet({ isOpen, onClose, onApplyVoucher }: VoucherSheetProps) {
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!code.trim()) return;
    const success = onApplyVoucher(code.trim());
    if (success) {
      setErrorMsg(null);
      onClose();
    } else {
      setErrorMsg("Invalid voucher code. Please try again.");
    }
  };

  const handleSelectVoucher = (vCode: string) => {
    onApplyVoucher(vCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/45 z-[210] flex items-end justify-center animate-fade-in">
      {/* Click outside target */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Frame */}
      <div className="sheet relative w-full max-w-[420px] bg-white rounded-t-[20px] p-5 shadow-std max-h-[75vh] overflow-y-auto z-[220] flex flex-col">
        <div className="sheet-handle w-10 h-1 bg-gray3 rounded-2xl mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-display font-bold text-[18px] text-dark">Apply Voucher</span>
          <button onClick={onClose} className="p-1 text-dark hover:opacity-70 focus:outline-none">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Manual input */}
        <div className="flex gap-2.5 mb-3">
          <input
            className="input-field flex-1 h-[52px] bg-gray rounded-std px-4 font-sans text-sm outline-none border border-transparent focus:border-blue/20"
            placeholder="Enter voucher code (e.g. SAVE10)"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setErrorMsg(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
          />
          <button
            onClick={handleSubmit}
            className="bg-blue text-white px-5 rounded-std font-display font-bold text-sm active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer"
          >
            Apply
          </button>
        </div>

        {errorMsg && <p className="text-red text-xs font-semibold mb-3 px-1">{errorMsg}</p>}

        <h3 className="title-sm text-[14px] font-display font-bold mb-3 mt-1 text-gray2">
          Available Vouchers
        </h3>

        {/* Voucher List */}
        <div className="space-y-3 overflow-y-auto no-scrollbar">
          {vouchers.map((v) => {
            return (
              <div
                key={v.code}
                onClick={() => handleSelectVoucher(v.code)}
                className="voucher-card border-1.5 border-dashed border-blue rounded-std p-4 flex items-center gap-[12px] bg-blue-light cursor-pointer transition-all hover:opacity-90 active:scale-[0.99] select-none"
              >
                <div className="voucher-icon w-11 h-11 rounded-std bg-blue flex items-center justify-center text-[20px] flex-shrink-0 text-white">
                  <Ticket className="w-5.5 h-map-5.5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="title-sm font-display font-bold text-base text-dark">{v.code}</div>
                  <p className="body-sm text-xs text-[#555]">{v.description}</p>
                </div>
                <div className="text-[11px] font-display font-bold text-blue bg-white/60 px-2 py-0.5 rounded-md">
                  Exp. in {v.expiryDays}d
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
