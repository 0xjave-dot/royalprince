import { PageHeader } from "../../components/layout/PageHeader";
import { BackButton } from "../../components/layout/BackButton";
import { Award, Lock, CheckCircle2 } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export default function Rewards() {
  const { pushToast } = useToast();

  return (
    <div className="flex-grow flex flex-col bg-white animate-fade-up-enter min-h-screen pb-10">
      <PageHeader title="Loyalty Rewards" left={<BackButton />} />

      <div className="p-5 space-y-6">
        {/* Empty/clean state (no demo loyalty points) */}
        <div className="bg-gray rounded-card p-6 text-left relative shadow-std select-none">
          <div className="flex items-center gap-3">
            <Award className="w-10 h-10 text-gray2" />
            <div>
              <p className="font-sans text-xs text-gray2 uppercase font-semibold tracking-wider">
                Available Points
              </p>
              <div className="font-display font-black text-[32px] mt-0.5 leading-none text-dark">0 pts</div>
            </div>
          </div>
          <div className="divider h-[1px] bg-gray3 my-4" />
          <p className="font-sans text-xs text-gray2 leading-relaxed">
            Loyalty rewards data is empty for new accounts.
          </p>
        </div>

        <h3 className="font-display font-bold text-sm text-dark mb-3 text-left px-1">Rewards</h3>

        <div className="space-y-4">
          {/* Intentionally blank */}
          <button
            onClick={() => pushToast("Loyalty rewards will appear once points are earned.")}
            className="w-full h-[52px] rounded-std border border-blue bg-blue font-display font-bold text-white text-[13px] shadow-std transition-colors hover:bg-blue/90"
          >
            Learn how to earn points
          </button>
        </div>
      </div>
    </div>
  );
}

