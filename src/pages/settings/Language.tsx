import { PageHeader } from "../../components/layout/PageHeader";
import { BackButton } from "../../components/layout/BackButton";
import { useSettings } from "../../context/SettingsContext";
import { useToast } from "../../context/ToastContext";
import { Check } from "lucide-react";

export default function Language() {
  const { pushToast } = useToast();
  const { language, setLanguage } = useSettings();

  const options = [
    { code: "English", tag: "EN", native: "English (US)" },
    { code: "Español", tag: "ES", native: "Español (ES)" },
    { code: "Français", tag: "FR", native: "Français (FR)" },
    { code: "Deutsch", tag: "DE", native: "Deutsch (DE)" }
  ];

  const handleSelect = (code: string) => {
    setLanguage(code as any);
    pushToast(`Language set to ${code}! 🌐`);
  };

  return (
    <div className="flex-grow flex flex-col bg-white animate-fade-up-enter min-h-screen pb-10">
      <PageHeader title="Select Language" left={<BackButton />} />

      <div className="p-5 space-y-3">
        {options.map((opt) => {
          const selected = language === opt.code;
          return (
            <div
              key={opt.code}
              onClick={() => handleSelect(opt.code)}
              className={`flex items-center justify-between p-4.5 border-2 rounded-std cursor-pointer transition-all ${
                selected ? "border-blue bg-blue-light/20" : "border-gray/50 hover:border-gray2 bg-white"
              }`}
            >
              <div className="flex items-center gap-3 select-none text-left">
                <div className="w-10 h-10 rounded-full bg-gray font-display font-black text-gray2 text-xs flex items-center justify-center border border-gray3/20">
                  {opt.tag}
                </div>
                <div>
                  <span className="font-display font-extrabold text-[14.5px] text-dark">{opt.code}</span>
                  <p className="font-sans text-xs text-gray2 mt-0.5">{opt.native}</p>
                </div>
              </div>

              {selected && (
                <div className="w-[20px] h-[20px] rounded-full bg-blue text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
