import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-1.5 bg-none border-none cursor-pointer font-display font-semibold text-[15px] text-dark hover:opacity-80 active:scale-95 transition-all py-1"
    >
      <ArrowLeft className="w-4.5 h-4.5 text-dark" strokeWidth={2.5} />
      <span>Back</span>
    </button>
  );
}
