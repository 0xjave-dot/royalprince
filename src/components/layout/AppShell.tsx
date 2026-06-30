import { useEffect, useMemo, type ReactNode, type CSSProperties } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../lib/auth";
import { useBrowseMode } from "../../context/BrowseModeContext";
import { recordVisit } from "../../lib/adminAnalytics";
import { ArrowRight, Search, ShoppingBag, UserRound, UsersRound } from "lucide-react";
import { rgbaFromHex } from "../../lib/colorTheme";
import { brandLogoUrl, brandName, brandTheme } from "../../data/brand";
import { WhatsAppFloatingButton } from "../common/WhatsAppFloatingButton";

interface AppShellProps {
  children?: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { browseMode, setBrowseMode } = useBrowseMode();
  const theme = useMemo(() => brandTheme, []);

  // Bottom navigation only appears on these primary e-commerce tab screens
  const primaryTabs = ["/", "/wishlist", "/cart", "/profile"];
  const showBottomNav =
    primaryTabs.includes(location.pathname) ||
    location.pathname.startsWith("/category/") ||
    location.pathname === "/all";

  const shellStyle = {
    background: theme.shellBackground,
    color: "#202020",
    ["--color-blue" as string]: theme.accent,
    ["--color-blue-light" as string]: theme.accentLight,
    ["--color-pink" as string]: theme.accent,
  } as CSSProperties;

  useEffect(() => {
    const { style } = document.body;
    const previous = {
      background: style.background,
      color: style.color,
      colorBlue: style.getPropertyValue("--color-blue"),
      colorBlueLight: style.getPropertyValue("--color-blue-light"),
      colorPink: style.getPropertyValue("--color-pink"),
    };

    style.background = theme.shellBackground;
    style.color = "#202020";
    style.setProperty("--color-blue", theme.accent);
    style.setProperty("--color-blue-light", theme.accentLight);
    style.setProperty("--color-pink", theme.accent);

    return () => {
      style.background = previous.background;
      style.color = previous.color;
      style.setProperty("--color-blue", previous.colorBlue);
      style.setProperty("--color-blue-light", previous.colorBlueLight);
      style.setProperty("--color-pink", previous.colorPink);
    };
  }, [theme.accent, theme.accentLight, theme.shellBackground]);

  useEffect(() => {
    void recordVisit(`${location.pathname}${location.search}`, user?.uid);
  }, [location.pathname, location.search, user?.uid]);

  return (
    <div className="min-h-screen w-full font-sans antialiased text-[#202020]" style={shellStyle}>
      <div className="relative w-full min-h-screen mx-auto bg-white flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.03)] border-x-0 transition-all md:max-w-[1440px] md:min-h-[calc(100vh-24px)] md:my-3 md:rounded-[30px] md:overflow-hidden md:border md:border-black/5">
        <div
          className="fixed inset-x-0 top-0 z-[120] flex h-10 items-center justify-between gap-3 border-b border-black/5 px-4 sm:px-6 py-2 md:static md:h-auto md:z-auto md:py-3"
          style={{
            background: `linear-gradient(135deg, ${theme.accentLighter} 0%, #ffffff 72%)`,
          }}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{
                backgroundColor: theme.accent,
                boxShadow: `0 0 0 6px ${rgbaFromHex(theme.accent, 0.12)}`,
              }}
            />
            <div className="hidden md:flex items-center gap-1 rounded-full border border-black/5 bg-white/75 p-1 shadow-[0_8px_22px_rgba(0,0,0,0.05)]">
              <button
                type="button"
                onClick={() => setBrowseMode("women")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] transition ${
                  browseMode === "women" ? "bg-blue text-white shadow-sm" : "text-[#5b5b5b] hover:text-dark"
                }`}
              >
                <UserRound className="h-3.5 w-3.5" />
                Women
              </button>
              <button
                type="button"
                onClick={() => setBrowseMode("men")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] transition ${
                  browseMode === "men" ? "bg-blue text-white shadow-sm" : "text-[#5b5b5b] hover:text-dark"
                }`}
              >
                <UsersRound className="h-3.5 w-3.5" />
                Men
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setBrowseMode("women")}
              className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] transition ${
                browseMode === "women" ? "bg-blue text-white" : "bg-white/70 text-[#666]"
              }`}
            >
              Women
            </button>
            <button
              type="button"
              onClick={() => setBrowseMode("men")}
              className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] transition ${
                browseMode === "men" ? "bg-blue text-white" : "bg-white/70 text-[#666]"
              }`}
            >
              Men
            </button>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/70 bg-white/70 shadow-sm"
              style={{ color: theme.accent }}
            >
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>

        <div className="h-10 shrink-0 md:hidden" aria-hidden="true" />

        {/* Desktop/Tablet Header Navigation Bar */}
        <header className="hidden md:flex items-center justify-between px-6 lg:px-8 py-4 border-b border-[#e5e5e5] bg-white/95 backdrop-blur-xl sticky top-0 z-50 select-none">
          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => navigate("/")}>
            <img
              src={brandLogoUrl}
              alt={`${brandName} logo`}
              className="w-8 h-8 object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="font-display font-black text-xl tracking-tight text-dark uppercase">{brandName}</span>
          </div>

          <nav className="flex items-center gap-6 lg:gap-8">
            <button onClick={() => navigate("/")} className={`font-display font-bold uppercase text-xs tracking-wider transition-colors cursor-pointer ${location.pathname === "/" ? "text-blue" : "text-[#555] hover:text-blue"}`}>Shop</button>

            <button onClick={() => navigate("/wishlist")} className={`font-display font-bold uppercase text-xs tracking-wider transition-colors cursor-pointer ${location.pathname === "/wishlist" ? "text-blue" : "text-[#555] hover:text-blue"}`}>Wishlist</button>
            <button onClick={() => navigate("/cart")} className={`relative font-display font-bold uppercase text-xs tracking-wider transition-colors cursor-pointer ${location.pathname === "/cart" ? "text-blue" : "text-[#555] hover:text-blue"}`}>
              Bag
              {itemCount > 0 && (
                <span className="absolute -top-2.5 -right-3.5 bg-[#f81140] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button onClick={() => navigate("/profile")} className={`font-display font-bold uppercase text-xs tracking-wider transition-colors cursor-pointer ${(location.pathname.startsWith("/profile") || location.pathname.startsWith("/settings")) ? "text-blue" : "text-[#555] hover:text-blue"}`}>Profile</button>
          </nav>

          {/* Header Actions (Search Button) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/search")}
              className="flex items-center gap-2 bg-[#f5f5f5] hover:bg-[#eee] transition-all rounded-full px-4 py-1.75 text-gray2 text-[11px] font-bold tracking-tight select-none cursor-pointer border border-transparent hover:border-blue/20"
            >
              <Search className="w-3.5 h-3.5 text-[#555]" />
              <span>SEARCH COLLECTION</span>
            </button>
          </div>
        </header>

        {/* Scrollable content canvas */}
        <div className={`flex-grow min-h-0 flex flex-col ${showBottomNav ? "pb-[calc(92px+env(safe-area-inset-bottom))] md:pb-0" : ""} overflow-y-auto no-scrollbar`}>
          <div className="w-full mx-auto flex-1 md:px-0">
            {children || <Outlet />}
          </div>
        </div>
        
        {showBottomNav && (
          <div className="md:hidden">
            <BottomNav />
          </div>
        )}

        {itemCount > 0 && (
          <button
            onClick={() => navigate("/cart")}
            aria-label="Open bag"
            title="Open bag"
            className="fixed left-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] md:bottom-6 z-[109] group"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-blue/20 blur-md opacity-80 animate-pulse"
            />
            <span className="absolute inset-0 rounded-full border border-blue/20" aria-hidden="true" />
            <span className="relative flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full bg-gradient-to-br from-blue to-blue/80 shadow-[0_14px_30px_rgba(194,31,45,0.28)] transition-transform duration-200 animate-[bounce_1.35s_ease-in-out_infinite] group-hover:scale-105">
              <ShoppingBag className="h-8 w-8 text-white" strokeWidth={2.1} />
              <span className="absolute -top-1.5 -right-1.5 min-w-[1.35rem] rounded-full bg-red px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-white shadow-[0_4px_10px_rgba(248,17,64,0.28)]">
                {itemCount}
              </span>
            </span>
          </button>
        )}

        <WhatsAppFloatingButton />
      </div>
    </div>
  );
}
