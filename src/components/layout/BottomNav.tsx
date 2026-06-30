import { useLocation, useNavigate } from "react-router-dom";
import { Home, Heart, List, ShoppingBag, User } from "lucide-react";
import { useCart } from "../../context/CartContext";

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();

  const navItems = [
    {
      label: "Shop",
      path: "/",
      icon: Home
    },
    {
      label: "Wishlist",
      path: "/wishlist",
      icon: Heart
    },
    {
      label: "Bag",
      path: "/cart",
      icon: ShoppingBag,
      badge: true
    },
    {
      label: "Profile",
      path: "/profile",
      icon: User
    }
  ];

  const handleNav = (path: string) => {
    navigate(path);
  };

  const isPathActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname.startsWith("/product/") || location.pathname.startsWith("/category/") || location.pathname.startsWith("/search");
    }
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] h-[76px] w-full border-t border-[#e5e5e5] bg-white/90 px-2 pt-1 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] backdrop-blur-xl flex items-center justify-around pb-[max(0px,env(safe-area-inset-bottom))]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isPathActive(item.path);

        return (
          <button
            key={item.label}
            onClick={() => handleNav(item.path)}
            className={`flex flex-col items-center gap-[2px] bg-none border-none cursor-pointer py-2 px-3.5 font-display text-[10px] font-bold uppercase tracking-tight transition-all relative ${
              active ? "text-blue" : "text-[#c7c7c7] hover:text-[#202020]"
            }`}
            id={`tab-nav-${item.label.toLowerCase()}`}
          >
            <div className="relative">
              <Icon className="w-5.5 h-5.5" strokeWidth={active ? 2.5 : 2} />
              {item.badge && itemCount > 0 && (
                <div className="absolute -top-1.5 -right-2 bg-red text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-[bounce_1s_infinite]">
                  {itemCount}
                </div>
              )}
            </div>
            <span>{item.label}</span>
            {active && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-blue animate-pulse" />}
          </button>
        );
      })}
    </div>
  );
}
