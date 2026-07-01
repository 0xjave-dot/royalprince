import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { rgbaFromHex } from "../../lib/colorTheme";
import { getTodaysNewArrivalEntry } from "../../data/newArrivals";
import { products } from "../../data/products";
import { useBrowseMode } from "../../context/BrowseModeContext";

export function NewArrivalsSection() {
  const navigate = useNavigate();
  const { browseMode } = useBrowseMode();
  const todayEntry = useMemo(() => getTodaysNewArrivalEntry(new Date(), browseMode), [browseMode]);


  const resolvedProducts = useMemo(() => {
    return todayEntry.productIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is typeof products[number] => Boolean(p));
  }, [todayEntry]);

  if (resolvedProducts.length === 0) {
    return null;
  }

  const handleSeeAll = () => {
    navigate("/all?type=new");
  };

  return (
    <div className="w-full" id="new-arrivals-section">
      <div className="mb-2.5 flex items-center justify-between gap-2.5">
        <div className="min-w-0">
          <p className="font-display text-[9px] font-black uppercase tracking-[0.24em] text-gray2">
            New arrivals
          </p>
          <h3 className="mt-1 truncate font-display text-[16px] font-black uppercase tracking-tight text-dark">
            {todayEntry.title}
          </h3>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-blue bg-blue-light/30 border-blue/20">
          <span className="h-2 w-2 rounded-full bg-blue" />
          
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 pt-0.5 items-stretch">
        {resolvedProducts.map((prod) => (
          <div key={prod.id} className="w-[130px] md:w-[180px] flex-shrink-0 flex">
            <ProductCard product={prod} />
          </div>
        ))}

        <div
          onClick={handleSeeAll}
          style={{
            borderColor: "#1f3f8b40",
            background: "linear-gradient(180deg, rgba(31,63,139,0.08) 0%, rgba(255,255,255,0.92) 74%)",
            boxShadow: `0 14px 30px ${rgbaFromHex("#1f3f8b", 0.08)}`,
          }}
          className="w-[130px] md:w-[180px] flex-shrink-0 flex flex-col justify-between items-start text-left p-3 border border-dashed rounded-[20px] cursor-pointer hover:bg-opacity-10 active:scale-[0.97] transition-all group"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ backgroundColor: "rgba(31,63,139,0.10)" }}
            >
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 text-blue" strokeWidth={3} />
            </div>
            <div className="h-10 w-px bg-black/5" />
            <div>
              <p className="font-display text-[10px] font-black uppercase tracking-[0.22em] text-gray2">
                Explore
              </p>
              <span className="block font-display text-[13px] font-black uppercase tracking-tight text-dark">
                New arrivals
              </span>
            </div>
          </div>

          <span className="mt-3 inline-flex rounded-full px-2.5 py-1 font-display text-[9px] font-extrabold uppercase tracking-wide text-blue bg-blue-light/30">
            Shop now
          </span>
        </div>
      </div>
    </div>
  );
}
