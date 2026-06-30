import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Delete, ScanFace, ArrowLeft, ShieldCheck } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../lib/auth";

export default function PinVerify() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [pin, setPin] = useState<string>("");

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 rounded-full border-[3px] border-blue border-t-transparent animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleKeyClick = (num: string) => {
    if (pin.length >= 4) return;
    const nextPin = pin + num;
    setPin(nextPin);

    if (nextPin.length === 4) {
      setTimeout(() => {
        pushToast("Verification successful.");
        navigate("/");
      }, 500);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleNumericTouchID = () => {
    pushToast("Scanning Face ID...");
    setTimeout(() => {
      pushToast("Identity confirmed.");
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fdfdfd_0%,_#f3f6fb_46%,_#eef2f7_100%)] px-4 py-5 sm:px-6 sm:py-8 text-dark animate-fade-up-enter">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-[540px] flex-col justify-center">
        <button
          onClick={() => navigate("/login")}
          className="mb-4 inline-flex items-center gap-1.5 self-start rounded-full border border-black/5 bg-white/80 px-3.5 py-2 font-display text-[13px] font-bold text-dark shadow-[0_10px_25px_rgba(0,0,0,0.04)] backdrop-blur-sm transition hover:bg-white"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          <span>Back to sign in</span>
        </button>

        <div className="overflow-hidden rounded-[28px] border border-black/5 bg-white/95 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="px-5 pt-5 text-center sm:px-6">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-light text-blue">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="mt-4 font-display text-[28px] font-black tracking-tight text-dark">
              Enter your PIN
            </h2>
            <p className="mt-1 font-sans text-[13.5px] leading-relaxed text-gray2">
              Use your 4-digit PIN or Face ID to continue securely.
            </p>
          </div>

          <div className="flex flex-1 flex-col justify-between px-0 pb-0 pt-5 text-center">
            <div className="mt-2">
              <p className="font-sans text-[15px] text-gray2 mb-3">Enter your 4-digit PIN</p>
              <div className="mb-8 flex justify-center gap-4">
                {[0, 1, 2, 3].map((index) => {
                  const filled = pin.length > index;
                  return (
                    <div
                      key={index}
                      className={`h-4 w-4 rounded-full transition-all duration-200 ${
                        filled ? "bg-blue scale-110" : "bg-gray3"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 border-t border-gray3 mt-auto">
              {[
                { num: "1", label: "" },
                { num: "2", label: "ABC" },
                { num: "3", label: "DEF" },
                { num: "4", label: "GHI" },
                { num: "5", label: "JKL" },
                { num: "6", label: "MNO" },
                { num: "7", label: "PQRS" },
                { num: "8", label: "TUV" },
                { num: "9", label: "WXYZ" },
              ].map((key) => (
                <button
                  key={key.num}
                  onClick={() => handleKeyClick(key.num)}
                  className="flex h-[72px] flex-col items-center justify-center border-b border-r border-[#ececec] bg-white cursor-pointer hover:bg-gray active:bg-[#e0e0e0] border-t-0 focus:outline-none"
                >
                  <span className="font-display text-[22px] font-bold text-dark">{key.num}</span>
                  {key.label && (
                    <span className="font-sans text-[8px] text-gray2 -mt-0.5">{key.label}</span>
                  )}
                </button>
              ))}

              <button
                onClick={handleNumericTouchID}
                className="flex h-[72px] flex-col items-center justify-center border-b border-r border-[#ececec] bg-white cursor-pointer hover:bg-gray active:bg-[#e0e0e0] font-sans text-[11px] font-semibold text-blue focus:outline-none"
              >
                <ScanFace className="w-5 h-5 mb-0.5 text-blue" />
                <span>Face ID</span>
              </button>

              <button
                onClick={() => handleKeyClick("0")}
                className="flex h-[72px] items-center justify-center border-b border-r border-[#ececec] bg-white cursor-pointer hover:bg-gray active:bg-[#e0e0e0] focus:outline-none"
              >
                <span className="font-display text-[22px] font-bold text-dark">0</span>
              </button>

              <button
                onClick={handleBackspace}
                className="flex h-[72px] items-center justify-center border-b border-r border-[#ececec] bg-white cursor-pointer hover:bg-gray active:bg-[#e0e0e0] focus:outline-none"
              >
                <Delete className="w-5.5 h-5.5 text-dark" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
