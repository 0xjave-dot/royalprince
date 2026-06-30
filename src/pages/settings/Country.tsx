import { PageHeader } from "../../components/layout/PageHeader";
import { BackButton } from "../../components/layout/BackButton";
import { useSettings } from "../../context/SettingsContext";
import { useToast } from "../../context/ToastContext";
import { Check } from "lucide-react";

export default function Country() {
  const { pushToast } = useToast();
  const { country, setCountry } = useSettings();

  const options = [
    { name: "United States", code: "US", flag: "🇺🇸" },
    { name: "United Kingdom", code: "UK", flag: "🇬🇧" },
    { name: "France", code: "FR", flag: "🇫🇷" },
    { name: "Germany", code: "DE", flag: "🇩🇪" },
    { name: "Spain", code: "ES", flag: "🇪🇸" }
  ];

  const handleSelect = (name: string) => {
    setCountry(name as any);
    pushToast(`Region set to ${name}! 🌍`);
  };

  return (
    <div className="flex-grow flex flex-col bg-white animate-fade-up-enter min-h-screen pb-10">
      <PageHeader title="Country / Region" left={<BackButton />} />

      <div className="p-5 space-y-3">
        {options.map((opt) => {
          const selected = country === opt.name;
          return (
            <div
              key={opt.name}
              onClick={() => handleSelect(opt.name)}
              className={`flex items-center justify-between p-4.5 border-2 rounded-std cursor-pointer transition-all ${
                selected ? "border-blue bg-blue-light/20" : "border-gray/50 hover:border-gray2 bg-white"
              }`}
            >
              <div className="flex items-center gap-3 select-none text-left">
                <span className="text-2xl filter drop-shadow-xs">{opt.flag}</span>
                <div>
                  <span className="font-display font-extrabold text-[14.5px] text-dark">{opt.name}</span>
                  <p className="font-sans text-xs text-gray2 mt-0.5">International Logistics Zone {opt.code}</p>
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
