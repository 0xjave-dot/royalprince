import { PageHeader } from "../../components/layout/PageHeader";
import { BackButton } from "../../components/layout/BackButton";
import { useSettings } from "../../context/SettingsContext";
import { useToast } from "../../context/ToastContext";

export default function Sizes() {
  const { pushToast } = useToast();
  const { sizeUnit, setSizeUnit, mySize, setMySize } = useSettings();

  const handleUnitToggle = (unit: "US" | "UK") => {
    setSizeUnit(unit);
    pushToast(`Measurement switched to ${unit} unit! 📏`);
  };

  const handleSizeSelect = (sz: string) => {
    setMySize(sz);
    pushToast(`Profile size preferences saved to: ${sz}! 👗`);
  };

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="flex-grow flex flex-col bg-white animate-fade-up-enter min-h-screen pb-10">
      <PageHeader title="My Size Guide" left={<BackButton />} />

      <div className="p-5 space-y-6">
        {/* Metric selection block */}
        <div>
          <label className="input-label font-display font-semibold text-xs text-dark mb-2.5 block select-none text-left">
            Measurement Standard
          </label>
          <div className="flex gap-3 bg-gray rounded-std p-1 border border-black/5 select-none">
            <button
              onClick={() => handleUnitToggle("US")}
              className={`flex-grow py-3 font-display text-xs font-bold rounded-lg transition-all cursor-pointer ${
                sizeUnit === "US"
                  ? "bg-white text-blue shadow-sm font-black"
                  : "text-gray2 bg-transparent hover:text-dark"
              }`}
            >
              US Metric Standard
            </button>
            <button
              onClick={() => handleUnitToggle("UK")}
              className={`flex-grow py-3 font-display text-xs font-bold rounded-lg transition-all cursor-pointer ${
                sizeUnit === "UK"
                  ? "bg-white text-blue shadow-sm font-black"
                  : "text-gray2 bg-transparent hover:text-dark"
              }`}
            >
              UK Metric Standard
            </button>
          </div>
        </div>

        {/* Fashion fits selectors */}
        <div>
          <label className="input-label font-display font-semibold text-xs text-dark mb-4 block select-none text-left">
            Preferred Garment Size ({sizeUnit})
          </label>

          <div className="grid grid-cols-3 gap-3">
            {sizeOptions.map((sz) => {
              const active = mySize === sz;
              return (
                <button
                  key={sz}
                  onClick={() => handleSizeSelect(sz)}
                  className={`size-btn rounded-std border py-5 font-display text-[14.5px] font-black transition-all cursor-pointer flex flex-col items-center justify-center ${
                    active
                      ? "border-blue bg-blue text-white shadow-md scale-102"
                      : "border-gray3 text-dark bg-white hover:bg-gray"
                  }`}
                >
                  <span>{sz}</span>
                  <span className={`text-[10px] mt-1 font-medium ${active ? "text-white/80" : "text-gray2"}`}>
                    {sizeUnit === "US"
                      ? sz === "S" ? "US 4 - 6" : "US Standard"
                      : sz === "S" ? "UK 8 - 10" : "UK Standard"
                    }
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Decorative tip card */}
        <div className="bg-blue-light/40 rounded-std p-4 border border-blue/10 text-left select-none">
          <h4 className="font-display font-bold text-xs text-blue mb-1">Tailored Size Recommendation</h4>
          <p className="font-sans text-[12.5px] text-[#555] leading-relaxed">
            Selecting standard preferences filters your home cards automatically and ensures our designers match sleeves and neck fits impeccably.
          </p>
        </div>
      </div>
    </div>
  );
}
