import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";

export default function ReviewDone() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col bg-white justify-center items-center p-6 text-center animate-fade-up-enter min-h-screen">
      <div className="flex-grow flex flex-col justify-center items-center max-w-[280px] w-full py-8">
        <div className="text-[64px] animate-[pulse_2s_infinite] select-none filter drop-shadow-md">
          🌟
        </div>
        <h2 className="font-display font-black text-[26px] text-dark tracking-tight leading-tight mt-6 mb-2">
          Thank You!
        </h2>
        <p className="font-sans text-[13px] text-gray2 leading-relaxed mb-8">
          Your review has been securely logged and will instantly assist other shoppe designers.
        </p>

        <button
          onClick={() => navigate("/")}
          className="btn-primary w-full h-[54px] bg-blue text-white rounded-std text-[14.5px] font-display font-bold shadow-std active:scale-[0.98] transition-transform flex items-center justify-center cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
