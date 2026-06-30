import { useNavigate } from "react-router-dom";
import { User, MapPin, Ruler, Coins, Languages, Globe2, Bell, Info, ShieldAlert, ChevronRight } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackButton } from "../../components/layout/BackButton";
import { useSettings } from "../../context/SettingsContext";
import { useToast } from "../../context/ToastContext";
import { brandName } from "../../data/brand";

export default function Settings() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const {
    sizeUnit,
    currency,
    language,
    country,
    mySize,
    pushNotifications,
    setPushNotifications
  } = useSettings();

  const handleToggleNotifications = () => {
    setPushNotifications(!pushNotifications);
    pushToast(pushNotifications ? "Notifications Silenced 🔕" : "Notifications Activated 🔔");
  };

  const handleDeleteAccount = () => {
    pushToast("Mock Command: Profile deletion requested.");
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-white animate-fade-up-enter min-h-screen pb-10">
      <PageHeader title="Settings" left={<BackButton />} />

      <div className="p-5 space-y-5 overflow-y-auto">
        {/* Account Panel */}
        <div className="bg-[#f8f8f8] border border-[#e5e5e5] rounded-[24px] p-3.5 space-y-1 shadow-subtle text-left">
          <span className="font-display font-black text-[10.5px] text-[#c7c7c7] tracking-wider uppercase px-1">ACCOUNT</span>
          
          {/* Edit profile */}
          <div
            onClick={() => navigate("/profile/edit")}
            className="setting-row flex items-center py-3 border-b border-gray3/30 cursor-pointer select-none group px-1"
          >
            <div className="icon-wrap w-[34px] h-[34px] rounded-xl bg-[#dfe9ff] text-blue flex items-center justify-center mr-3 flex-shrink-0">
              <User className="w-4 h-4" />
            </div>
            <span className="flex-grow font-display font-bold text-[14.5px] text-dark group-hover:text-blue transition-colors">
              Edit Profile
            </span>
            <ChevronRight className="w-4 h-4 text-gray2" />
          </div>

          {/* Shipping addresses */}
          <div
            onClick={() => navigate("/settings/shipping-address")}
            className="setting-row flex items-center py-3 border-none cursor-pointer select-none group px-1"
          >
            <div className="icon-wrap w-[34px] h-[34px] rounded-xl bg-[#dfe9ff] text-blue flex items-center justify-center mr-3 flex-shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="flex-grow font-display font-bold text-[14.5px] text-dark group-hover:text-blue transition-colors">
              Shipping Address
            </span>
            <ChevronRight className="w-4 h-4 text-gray2" />
          </div>
        </div>

        {/* Global Configuration Bento Panel */}
        <div className="bg-[#f8f8f8] border border-[#e5e5e5] rounded-[24px] p-3.5 space-y-1 shadow-subtle text-left">
          <span className="font-display font-black text-[10.5px] text-[#c7c7c7] tracking-wider uppercase px-1">SYSTEM PREFERENCES</span>

          {/* Sizing options */}
          <div
            onClick={() => navigate("/settings/sizes")}
            className="setting-row flex items-center py-3 border-b border-gray3/30 cursor-pointer select-none group px-1"
          >
            <div className="icon-wrap w-[34px] h-[34px] rounded-xl bg-white border border-[#e5e5e5] text-dark flex items-center justify-center mr-3 flex-shrink-0">
              <Ruler className="w-4 h-4" />
            </div>
            <span className="flex-grow font-display font-bold text-[14.5px] text-dark group-hover:text-blue transition-colors">
              My Sizes
            </span>
            <span className="font-display font-extrabold text-[11px] text-blue bg-[#dfe9ff]/90 px-2.5 py-0.5 rounded-full mr-1">
              Unit {sizeUnit} ({mySize})
            </span>
            <ChevronRight className="w-4 h-4 text-gray2" />
          </div>

          {/* Currency options */}
          <div
            onClick={() => navigate("/settings/currency")}
            className="setting-row flex items-center py-3 border-b border-gray3/30 cursor-pointer select-none group px-1"
          >
            <div className="icon-wrap w-[34px] h-[34px] rounded-xl bg-white border border-[#e5e5e5] text-dark flex items-center justify-center mr-3 flex-shrink-0">
              <Coins className="w-4 h-4" />
            </div>
            <span className="flex-grow font-display font-bold text-[14.5px] text-dark group-hover:text-blue transition-colors">
              Currency
            </span>
            <span className="font-display font-extrabold text-[11px] text-blue bg-[#dfe9ff]/90 px-2.5 py-0.5 rounded-full mr-1">
              {currency}
            </span>
            <ChevronRight className="w-4 h-4 text-gray2" />
          </div>

          {/* Languages options */}
          <div
            onClick={() => navigate("/settings/language")}
            className="setting-row flex items-center py-3 border-b border-gray3/30 cursor-pointer select-none group px-1"
          >
            <div className="icon-wrap w-[34px] h-[34px] rounded-xl bg-white border border-[#e5e5e5] text-dark flex items-center justify-center mr-3 flex-shrink-0">
              <Languages className="w-4 h-4" />
            </div>
            <span className="flex-grow font-display font-bold text-[14.5px] text-dark group-hover:text-blue transition-colors">
              Language
            </span>
            <span className="font-display font-extrabold text-[11px] text-blue bg-[#dfe9ff]/90 px-2.5 py-0.5 rounded-full mr-1">
              {language}
            </span>
            <ChevronRight className="w-4 h-4 text-gray2" />
          </div>

          {/* Country systems */}
          <div
            onClick={() => navigate("/settings/country")}
            className="setting-row flex items-center py-3 border-b border-gray3/30 cursor-pointer select-none group px-1"
          >
            <div className="icon-wrap w-[34px] h-[34px] rounded-xl bg-white border border-[#e5e5e5] text-dark flex items-center justify-center mr-3 flex-shrink-0">
              <Globe2 className="w-4 h-4" />
            </div>
            <span className="flex-grow font-display font-bold text-[14.5px] text-dark group-hover:text-blue transition-colors">
              Country / Region
            </span>
            <span className="font-display font-extrabold text-[11px] text-blue bg-[#dfe9ff]/90 px-2.5 py-0.5 rounded-full mr-1">
              {country}
            </span>
            <ChevronRight className="w-4 h-4 text-gray2" />
          </div>

          {/* Push toggle checkbox switch */}
          <div className="setting-row flex items-center justify-between py-3 border-b border-gray3/30 select-none px-1">
            <div className="flex items-center">
              <div className="icon-wrap w-[34px] h-[34px] rounded-xl bg-white border border-[#e5e5e5] text-dark flex items-center justify-center mr-3">
                <Bell className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-[14.5px] text-dark">Push Notifications</span>
            </div>
            <label style={{ transform: "scale(0.85)" }}>
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={handleToggleNotifications}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-[#e5e5e5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray2 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue" />
            </label>
          </div>

          {/* About documentation links */}
          <div
            onClick={() => navigate("/settings/about")}
            className="setting-row flex items-center py-3 border-none cursor-pointer select-none group px-1"
          >
            <div className="icon-wrap w-[34px] h-[34px] rounded-xl bg-white border border-[#e5e5e5] text-dark flex items-center justify-center mr-3 flex-shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <span className="flex-grow font-display font-bold text-[14.5px] text-dark group-hover:text-blue transition-colors">
              About {brandName}
            </span>
            <ChevronRight className="w-4 h-4 text-gray2" />
          </div>
        </div>

        {/* Security & System Area */}
        <div className="bg-[#f8f8f8] border border-[#e5e5e5] rounded-[24px] p-3.5 space-y-1 shadow-subtle text-left">
          <span className="font-display font-black text-[10.5px] text-[#c7c7c7] tracking-wider uppercase px-1">DANGER ZONE</span>

          {/* Delete account */}
          <div
            onClick={handleDeleteAccount}
            className="setting-row flex items-center py-3 border-none cursor-pointer select-none group px-1 text-red hover:bg-[#fff0f3] rounded-xl pr-1"
          >
            <div className="icon-wrap w-[34px] h-[34px] rounded-xl bg-red/10 text-red flex items-center justify-center mr-3 flex-shrink-0">
              <ShieldAlert className="w-4 h-4 text-red" />
            </div>
            <span className="flex-grow font-display font-bold text-[14.5px] text-red">
              Delete Profile
            </span>
            <ChevronRight className="w-4 h-4 text-red" />
          </div>
        </div>
      </div>
    </div>
  );
}
