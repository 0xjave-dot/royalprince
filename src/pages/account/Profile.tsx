import { useNavigate } from "react-router-dom";
import {
  Settings,
  LogOut,
  ChevronRight,
  Ticket,
  MapPin,
  MessageSquare,
  LogIn,
  ShieldCheck,
  Package,
} from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { useSettings } from "../../context/SettingsContext";

const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=2348028598695";

export default function Profile() {
  const navigate = useNavigate();
  const { userProfile, firebaseUser, signOut, account } = useSettings();
  const rewardPoints = account.rewards.points;
  const loadingAccount = false;

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getInitials(userProfile.name);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  if (!firebaseUser) {
    return (
      <div className="flex-grow flex flex-col bg-white animate-fade-up-enter pb-10">
        <PageHeader
          title="Profile"
          right={null}
        />
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-gray flex items-center justify-center">
            <LogIn className="w-10 h-10 text-gray2" />
          </div>
          <div>
            <h2 className="font-display font-bold text-[20px] text-dark mb-1">You're not signed in</h2>
            <p className="font-sans text-[13px] text-gray2 leading-relaxed max-w-[220px]">
              Sign in to view your profile, orders, wishlist and more.
            </p>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="w-full max-w-[260px] h-[52px] bg-blue text-white font-display font-bold text-[15px] rounded-std shadow-std active:scale-[0.98] transition-transform cursor-pointer"
          >
            Sign In
          </button>
          <p className="font-sans text-[13px] text-gray2">
            No account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue font-bold cursor-pointer hover:underline"
            >
              Create one
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col bg-white animate-fade-up-enter pb-10">
      <PageHeader
        title="Profile"
        right={null}
      />

      <div className="p-5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-2">
          {userProfile.avatarUrl || firebaseUser.photoURL ? (
            <img
              src={userProfile.avatarUrl || firebaseUser.photoURL || ""}
              alt="Profile"
              className="min-w-[76px] w-[76px] h-[76px] rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="profile-avatar min-w-[76px] h-[76px] rounded-full bg-gradient-to-br from-blue to-pink flex items-center justify-center font-display font-bold text-2xl text-white shadow-md border-2 border-white">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h2 className="font-display font-extrabold text-[19px] text-dark leading-tight truncate">
              {userProfile.name || "No name set"}
            </h2>
            <p className="font-sans text-[12.5px] text-gray2 mt-0.5 truncate">{userProfile.email}</p>
          </div>
        </div>

        <div
          onClick={() => navigate("/settings/rewards")}
          className="relative rounded-std p-5 bg-gradient-to-br from-blue to-[#3b6bff] text-white cursor-pointer select-none shadow-std active:scale-[0.99] transition-transform overflow-hidden"
        >
          <div className="absolute right-[-10px] top-[-10px] w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
          <div className="flex justify-between items-start mb-3.5">
            <div>
              <p className="font-sans text-[11px] text-white/70 font-semibold tracking-wide uppercase">
                Loyalty Reward Points
              </p>
              <div className="font-display font-black text-[26px] mt-0.5">
                {loadingAccount ? "..." : `${rewardPoints} pts`}
              </div>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full font-display text-[11px] font-bold">
              {rewardPoints >= 1000 ? "Gold Tier" : "Bronze Tier"}
            </div>
          </div>
          <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: rewardPoints >= 1000 ? "62%" : "0%" }} />
          </div>
          <p className="font-sans text-[11px] text-white/70 mt-2 font-medium">
            {rewardPoints >= 1000
              ? "Platinum tier unlocked. Keep going to stay ahead."
              : "Earn points through purchases and rewards."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
          <div onClick={() => navigate("/orders")} className="setting-row flex items-center py-3.5 border-b border-gray3/30 cursor-pointer select-none group px-1">
            <div className="icon-wrap w-[36px] h-[36px] rounded-std bg-blue-light/50 text-blue flex items-center justify-center mr-3 flex-shrink-0">
              <Package className="w-4.5 h-4.5" />
            </div>
            <span className="flex-grow font-display font-bold text-[14.5px] text-dark group-hover:text-blue transition-colors">Orders</span>
            <span className="text-xs bg-[#f3f7ff] text-blue font-bold px-2 py-0.5 rounded-full mr-2">
              {account.orders.items.length}
            </span>
            <ChevronRight className="w-4.5 h-4.5 text-gray2" />
          </div>

          <div onClick={() => navigate("/settings/vouchers")} className="setting-row flex items-center py-3.5 border-b border-gray3/30 cursor-pointer select-none group px-1">
            <div className="icon-wrap w-[36px] h-[36px] rounded-std bg-blue-light/50 text-blue flex items-center justify-center mr-3 flex-shrink-0">
              <Ticket className="w-4.5 h-4.5" />
            </div>
            <span className="flex-grow font-display font-bold text-[14.5px] text-dark group-hover:text-blue transition-colors">My Vouchers</span>
            <ChevronRight className="w-4.5 h-4.5 text-gray2" />
          </div>

          <div onClick={() => navigate("/settings/shipping-address")} className="setting-row flex items-center py-3.5 border-b border-gray3/30 cursor-pointer select-none group px-1">
            <div className="icon-wrap w-[36px] h-[36px] rounded-std bg-blue-light/50 text-blue flex items-center justify-center mr-3 flex-shrink-0">
              <MapPin className="w-4.5 h-4.5" strokeWidth={2.5} />
            </div>
            <span className="flex-grow font-display font-bold text-[14.5px] text-dark group-hover:text-blue transition-colors">Shipping Addresses</span>
            <ChevronRight className="w-4.5 h-4.5 text-gray2" />
          </div>

          <div
            onClick={() => window.location.assign(WHATSAPP_URL)}
            className="setting-row flex items-center py-3.5 border-b border-gray3/30 cursor-pointer select-none group px-1"
          >
            <div className="icon-wrap w-[36px] h-[36px] rounded-std bg-blue-light/50 text-blue flex items-center justify-center mr-3 flex-shrink-0 relative">
              <MessageSquare className="w-4.5 h-4.5" />
              <div className="absolute top-[2px] right-[2px] w-2.5 h-2.5 rounded-full bg-red border-2 border-white" />
            </div>
            <span className="flex-grow font-display font-bold text-[14.5px] text-dark group-hover:text-blue transition-colors">Chat Support</span>
            <span className="text-xs bg-[#fff0f3] text-red font-bold px-2 py-0.5 rounded-full mr-2">1 Alert</span>
            <ChevronRight className="w-4.5 h-4.5 text-gray2" />
          </div>

          <div onClick={() => navigate("/settings")} className="setting-row flex items-center py-3.5 border-b border-gray3/30 cursor-pointer select-none group px-1">
            <div className="icon-wrap w-[36px] h-[36px] rounded-std bg-blue-light/50 text-blue flex items-center justify-center mr-3 flex-shrink-0">
              <Settings className="w-4.5 h-4.5" />
            </div>
            <span className="flex-grow font-display font-bold text-[14.5px] text-dark group-hover:text-blue transition-colors">Settings</span>
            <ChevronRight className="w-4.5 h-4.5 text-gray2" />
          </div>

          <div
            onClick={handleSignOut}
            className="setting-row flex items-center py-3.5 border-b-0 cursor-pointer select-none group px-1 text-red hover:bg-[#fff0f3]/40 rounded-lg pr-3"
          >
            <div className="icon-wrap w-[36px] h-[36px] rounded-std bg-red/10 text-red flex items-center justify-center mr-3 flex-shrink-0">
              <LogOut className="w-4.5 h-4.5" />
            </div>
            <span className="flex-grow font-display font-bold text-[14.5px] text-red">Sign Out</span>
            <ChevronRight className="w-4.5 h-4.5 text-red" />
          </div>
        </div>
      </div>

    </div>
  );
}
